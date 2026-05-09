import { ApiRequest, Handler } from "@/libs/route/types";
import { ContactPayload } from "@/payloads/contact";
import { ContactService } from "@/services/api/contact";

export abstract class ContactController {
  static readonly sendMessage: Handler<ApiRequest<ContactPayload.SendMessageBody>, null> = async (req, { reply }) => {
    const res = await ContactService.sendMessage(req.body);
    reply.success(res).ok();
  };
}
