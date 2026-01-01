const fs = require('fs');
const path = require('path');

// Load dữ liệu training
let knowledgeBase = [];
try {
  const dataPath = path.join(__dirname, 'training_data.json');
  const rawData = fs.readFileSync(dataPath);
  knowledgeBase = JSON.parse(rawData);
} catch (e) {
  console.error("Lỗi load training data:", e);
}

const getAnswer = (productName, question) => {
  const q = question.toLowerCase();
  const name = productName || "Sản phẩm";

  let bestMatch = null;
  let maxScore = 0;

  // Thuật toán chấm điểm câu hỏi (Keyword Scoring)
  for (const item of knowledgeBase) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) {
        score++;
      }
    }

    // Nếu điểm cao hơn điểm hiện tại thì chọn làm câu trả lời tốt nhất
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  // Nếu tìm thấy câu trả lời phù hợp (score > 0)
  if (bestMatch) {
    return bestMatch.answer.replace(/{product}/g, name);
  }

  // Câu trả lời mặc định nếu AI "bó tay"
  return `Cảm ơn bạn đã quan tâm đến **${name}**. Câu hỏi này hơi khó với tôi 😅. Bạn vui lòng liên hệ hotline 1900 1500 để được hỗ trợ nhé!`;
};

module.exports = { getAnswer };
