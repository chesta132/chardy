export abstract class ValidationMessage {
  private static readonly INVALID_LEN = (operator: string) => (len: number, string?: boolean) =>
    `Data harus berisi ${operator} ${len} ${string === false ? "item" : "karakter"}`;
  private static readonly INVALID_TYPE = (type: string) => `Silakan masukkan ${type} yang valid`;

  static readonly INVALID_EMAIL = this.INVALID_TYPE("email");
  static readonly INVALID_STRING = this.INVALID_TYPE("teks");
  static readonly INVALID_DATE = this.INVALID_TYPE("tanggal");
  static readonly INVALID_NUMBER = this.INVALID_TYPE("nomor");
  static readonly INVALID_BOOLEAN = this.INVALID_TYPE("boolean (true/false)");
  static readonly INVALID_FILE = this.INVALID_TYPE("file");

  static readonly INVALID_MIN_LEN = this.INVALID_LEN("minimal");
  static readonly INVALID_MAX_LEN = this.INVALID_LEN("maksimal");
  static readonly INVALID_BODY_TYPE = (expected: string) => `Body data harus berbentuk ${expected}`;
}
