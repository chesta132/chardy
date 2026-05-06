import type { AxiosError, AxiosResponse } from "axios";
import { capital } from "../manipulate/string";
import type { ZodType } from "zod";
import { ErrorReplyType, Pagination, ReplyEnvelope } from "../reply/types";

export class ResponseError {
  // AxiosError<any> because response props replaced to non undefined
  readonly axios: AxiosError<any> & { response: { data: ReplyEnvelope<ErrorReplyType, false> } };
  readonly data: ReplyEnvelope<ErrorReplyType, false>["data"];
  readonly meta: ReplyEnvelope<ErrorReplyType, false>["meta"];

  constructor(error: AxiosError<ReplyEnvelope<ErrorReplyType, false>>) {
    if (!error.response?.data) {
      throw new Error("Invalid server error: missing response data");
    }
    this.axios = error as AxiosError<any> & { response: { data: ReplyEnvelope<ErrorReplyType, false> } };
    this.data = error.response.data.data;
    this.meta = error.response.data.meta;
  }

  getCode() {
    return this.data.code;
  }

  getMessage({ skipCapital = false } = {}) {
    if (skipCapital) return this.data.message;
    else return capital(this.data.message);
  }

  getField() {
    return this.data.field;
  }

  getDetails() {
    return this.data.details;
  }
}

export class ResponseSuccess<T> {
  data: T;
  meta: ReplyEnvelope<T, true>["meta"];
  readonly axios: AxiosResponse<ReplyEnvelope<T, true>>;
  readonly validator: ZodType;

  constructor(response: AxiosResponse<ReplyEnvelope<T, true>>, validator: ZodType) {
    this.axios = response;
    this.validator = validator;
    const data = response.data;
    if (data instanceof Blob || typeof data !== "object") {
      this.data = validator.parse(data) as any;
      this.meta = { status: "SUCCESS" };
    } else {
      this.data = validator.parse(data.data) as any;
      this.meta = data.meta;
    }
  }

  getInfo() {
    return this.meta.information;
  }

  getPagination(): Pagination {
    return this.meta.pagination || { hasNext: false, nextOffset: 0 };
  }

  getFilename: T extends Blob ? () => string : never = (() => {
    const disposition: string = this.axios.headers["content-disposition"] ?? "";
    const match = disposition.match(/filename="?([^";\r\n]+)"?/);
    return match?.[1]?.trim();
  }) as any;

  setToState(setState: React.Dispatch<React.SetStateAction<T>>) {
    setState(this.data);
  }

  duplicate() {
    return new ResponseSuccess<T>(this.axios, this.data as ZodType);
  }
}
