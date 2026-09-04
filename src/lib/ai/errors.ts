export class AiTimeoutError extends Error {
  constructor() { super("AI phân tích quá thời gian. Vui lòng thử lại với ít ảnh hơn."); this.name = "AiTimeoutError"; }
}
export class AiMalformedResponseError extends Error {
  constructor() { super("AI trả về dữ liệu không đúng cấu trúc sau nhiều lần thử."); this.name = "AiMalformedResponseError"; }
}
export class AiProviderError extends Error {
  constructor(message = "AI provider không thể xử lý yêu cầu") { super(message); this.name = "AiProviderError"; }
}
