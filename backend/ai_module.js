const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. Cấu hình Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Load Knowledge Base (Dữ liệu nền)
let contextData = "";
try {
  const dataPath = path.join(__dirname, 'training_data.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  // Chuyển JSON thành text để nhồi vào prompt
  const json = JSON.parse(rawData);
  contextData = json.map(item =>
    `- Keywords: ${item.keywords.join(", ")}\n  Answer: ${item.answer}`
  ).join("\n\n");
} catch (e) {
  console.error("Lỗi load training data:", e);
}

// 3. Hàm gọi Gemini
const getAnswer = async (productName, question) => {
  try {
    // Sử dụng model 'gemini-flash-latest' vì nó miễn phí và nhanh
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
    Bạn là trợ lý ảo của hệ thống "MilkFamily" - Hệ thống bán sữa và xác thực sản phẩm bằng Blockchain.
    
    Hãy trả lời câu hỏi của khách hàng dựa trên "Cơ sở dữ liệu" dưới đây.
    Nếu câu hỏi không liên quan hoặc không có trong dữ liệu, hãy trả lời khéo léo và gợi ý liên hệ hotline 1900 1500.
    
    Thông tin sản phẩm khách đang xem: ${productName || "Không rõ"}

    --- CƠ SỞ DỮ LIỆU ---
    ${contextData}
    ---------------------

    Câu hỏi của khách: "${question}"
    
    Hãy trả lời ngắn gọn, thân thiện, có emoji và tập trung vào sản phẩm sữa.
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
