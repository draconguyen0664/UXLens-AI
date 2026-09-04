export const productTypes = {
  general: "General product",
  hrm: "HRM / Employee",
  ecommerce: "E-commerce",
  saas: "SaaS / Analytics",
  fintech: "Fintech",
  healthcare: "Healthcare",
  education: "Education",
} as const;

export const screenTypes: Record<string, string> = { landing: "Landing page", dashboard: "Dashboard", checkout: "Checkout", onboarding: "Onboarding", form: "Form", other: "Screen" };

export function getDemoAudit(productType: string, screenType: string) {
  const product = productTypes[productType as keyof typeof productTypes] ?? productTypes.general;
  const screen = screenTypes[screenType] ?? screenTypes.other;
  return {
    title: `${product} ${screen} audit`,
    issues: [
      { severity: "critical", category: "accessibility", location: `${screen} · trạng thái và hành động chính`, title: "Thông tin trạng thái phụ thuộc quá nhiều vào màu sắc", problem: "Một số trạng thái dùng màu nhạt và thiếu nhãn hoặc ký hiệu hỗ trợ.", why: "Người dùng thị lực yếu hoặc mù màu có thể không nhận biết được trạng thái quan trọng.", recommendation: "Tăng tương phản và kết hợp màu với icon, nhãn chữ hoặc pattern rõ ràng." },
      { severity: "major", category: "usability", location: `${screen} · khu vực hành động`, title: "Hành động quan trọng chưa được ưu tiên", problem: "Các hành động chính và phụ có trọng lượng thị giác gần tương đương.", why: `Người dùng ${product} phải cân nhắc lâu hơn trước khi chọn bước tiếp theo.`, recommendation: "Giữ một primary action rõ ràng, giảm nhấn các secondary actions và đặt CTA gần dữ liệu liên quan." },
      { severity: "minor", category: "visualHierarchy", location: `${screen} · vùng nội dung trung tâm`, title: "Mật độ thông tin làm giảm hierarchy", problem: "Nhiều card và số liệu có cùng kích thước, màu sắc và độ nổi bật.", why: "Người dùng khó xác định thông tin nào cần đọc trước và phải quét nhiều khu vực.", recommendation: "Nhóm thông tin theo nhiệm vụ, tăng khoảng trắng và chỉ nhấn mạnh 1–2 chỉ số quan trọng nhất." },
      { severity: "minor", category: "consistency", location: `${screen} · cards và status`, title: "Quy ước màu và component chưa nhất quán", problem: "Cùng một kiểu trạng thái được thể hiện bằng nhiều màu hoặc pattern component khác nhau.", why: "Sự không nhất quán làm tăng thời gian học và giảm khả năng dự đoán giao diện.", recommendation: "Áp dụng một semantic color map và dùng chung component variant cho cùng loại trạng thái." },
      { severity: "minor", category: "uxWriting", location: `${screen} · navigation và buttons`, title: "Nhãn hành động còn chung chung", problem: "Một số nhãn chỉ mô tả thao tác như “Tiếp tục” hoặc chỉ dùng icon.", why: "Người dùng không biết rõ kết quả sẽ xảy ra sau khi tương tác.", recommendation: "Dùng động từ kèm đối tượng, thêm tooltip cho icon-only button và giữ thuật ngữ nhất quán." },
    ],
  };
}
