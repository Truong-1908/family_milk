const mongoose = require("mongoose");

// Thay 'milk_family_db' bằng tên database bạn muốn
const MONGO_URI = "mongodb://localhost:27017/milk_qr_blockchain_db";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ [Database] Đã kết nối MongoDB thành công!");
  } catch (err) {
    console.error("❌ [Database] Lỗi kết nối:", err.message);
    // Dừng server nếu không kết nối được DB để tránh lỗi dây chuyền
    process.exit(1);
  }
};

module.exports = connectDB;
