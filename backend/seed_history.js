const mongoose = require("mongoose");
const connectDB = require("./database");
const { Product, User, History } = require("./models");

const seedHistory = async () => {
    try {
        await connectDB();
        console.log("✅ Đã kết nối Database...");

        // Lấy một user từ database
        const user = await User.findOne({ username: "khachhang" });
        if (!user) {
            console.log("❌ Không tìm thấy user 'khachhang'. Hãy chạy seed.js trước!");
            process.exit(1);
        }

        console.log(`📌 Tạo lịch sử cho user: ${user.fullname} (ID: ${user._id})`);

        // Lấy các sản phẩm từ database
        const products = await Product.find().limit(3);
        if (products.length === 0) {
            console.log("❌ Không tìm thấy sản phẩm. Hãy chạy seed.js trước!");
            process.exit(1);
        }

        // Tạo 5 bản ghi lịch sử
        const historyRecords = [];
        for (let i = 0; i < 5; i++) {
            const product = products[i % products.length];
            const now = new Date();
            now.setHours(now.getHours() - i); // Mỗi bản ghi cách nhau 1 giờ
            
            historyRecords.push({
                uid: product.uid,
                location: i === 0 ? "Quán cà phê" : i === 1 ? "Siêu thị" : i === 2 ? "Nhà hàng" : i === 3 ? "Kho bảo quản" : "Cửa hàng",
                time: now.toLocaleString("vi-VN"),
                status: i % 2 === 0 ? "valid" : "valid", // Toàn bộ hợp lệ
                user: user._id, // Liên kết với user
                timestamp: now,
            });
        }

        await History.insertMany(historyRecords);
        console.log(`✅ Đã tạo ${historyRecords.length} bản ghi lịch sử cho user: ${user.username}`);
        console.log(`   User ID: ${user._id}`);
        console.log(`   Hãy dùng ID này để test getMyHistory`);

        process.exit(0);
    } catch (e) {
        console.error("❌ Lỗi:", e);
        process.exit(1);
    }
};

seedHistory();
