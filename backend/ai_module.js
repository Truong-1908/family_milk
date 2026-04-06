const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. Cấu hình Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAnswer = async (productName, question) => {
  try {
    // Sử dụng model 'gemini-2.5-flash' để hoạt động với hệ thống mới nhất
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Bạn là nhân viên tư vấn nhiệt tình và chuyên nghiệp của "MilkFamily" - Hệ thống cửa hàng bán sữa và xác thực nguồn gốc bằng công nghệ Blockchain.
    
    [NHIỆM VỤ CỦA BẠN]
    1. Tư vấn, giải đáp thắc mắc về các loại sữa, công dụng, cách bảo quản và cách sử dụng.
    2. Hướng dẫn khách hàng về tính năng "Xác thực nguồn gốc thật/giả" bằng Blockchain trên hệ thống.
    3. Hỗ trợ giải quyết các nhu cầu mua sắm liên quan đến cửa hàng MilkFamily.
    4. TỪ CHỐI TRẢ LỜI các câu hỏi không liên quan đến sữa, cửa hàng, sức khỏe dinh dưỡng hoặc xác thực sản phẩm. Trả lời khéo léo để khách hàng quay lại chủ đề chính.
    
    Hãy giữ thái độ thân thiện, lịch sự và luôn xưng "mình" hoặc "em" với khách hàng "bạn" / "anh/chị". Hãy sử dụng một chút emoji để câu văn sinh động.
    
    [Trạng thái hiện tại]
    Sản phẩm khách hàng đang xem hoặc quét: ${productName || "Không có thông tin"}

    [Câu hỏi của khách]
    "${question}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Xin lỗi, hiện tại tôi đang bị quá tải. Bạn hãy thử lại sau chút xíu nhé! 😅 (Lỗi kết nối AI: ${error.message})`;
  }
};

module.exports = { getAnswer };
