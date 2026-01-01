// Giả lập AI trả lời (Bạn có thể nâng cấp lên Google Gemini API thật ở đây sau này)
const getAnswer = (productName, question) => {
  const q = question.toLowerCase();
  const name = productName || "Sản phẩm";

  // Logic trả lời dựa trên từ khóa
  if (q.includes("giá")) {
    return `Giá bán lẻ tham khảo của **${name}** dao động tùy theo đại lý và chương trình khuyến mãi hiện tại.`;
  }
  if (q.includes("hạn sử dụng") || q.includes("hsd") || q.includes("date")) {
    return `Hạn sử dụng của **${name}** được in rõ dưới đáy lon và đã được lưu trữ bất biến trên Blockchain để đảm bảo an toàn.`;
  }
  if (q.includes("bảo quản")) {
    return `Bạn nên bảo quản **${name}** ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Sau khi mở nắp nên dùng hết trong ngày.`;
  }
  if (q.includes("thành phần") || q.includes("chất lượng")) {
    return `**${name}** được làm từ 100% sữa tươi nguyên chất và các nguyên liệu tự nhiên, đạt chuẩn ISO quốc tế.`;
  }
  if (q.includes("chính hãng") || q.includes("thật giả")) {
    return `Bạn có thể hoàn toàn yên tâm. Đây là sản phẩm **${name}** CHÍNH HÃNG đã được xác thực qua hệ thống Blockchain của chúng tôi.`;
  }

  // Câu trả lời mặc định
  return `Cảm ơn bạn đã quan tâm đến **${name}**. Nếu cần thêm thông tin chi tiết, vui lòng liên hệ hotline 1900 1500.`;
};

module.exports = { getAnswer };
