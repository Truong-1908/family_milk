const mongoose = require("mongoose");
const connectDB = require("./database");
const { Product, User, History } = require("./models");
const QRCode = require("qrcode");
const bcrypt = require("bcryptjs");
const { initBlockchain, createOnChain } = require("./blockchain"); // [MỚI] Import Blockchain Logic

// Dữ liệu mẫu
const SAMPLE_PRODUCTS = [
    {
        uid: "VN_MILK_001",
        name: "Sữa Tươi Vinamilk 100%",
        batch_number: "L001-2024",
        expiry_date: "01/01/2026",
        expiry_unix: 1767225600, // 01/01/2026
        description: "Sữa tươi tiệt trùng Vinamilk 100% Sữa Tươi - Thơm ngon thuần khiết từ thiên nhiên.",
        product_image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lstn2g0q04v266",
        tx_hash: "0x8f0d651B69c3a37887e2213D5b93AcP534608c5B5c545325881477174256247F" // [DEMO] Hash giả lập
    },
    {
        uid: "TH_TRUE_002",
        name: "Sữa TH True Milk Ít Đường",
        batch_number: "TH99-2025",
        expiry_date: "15/12/2025",
        expiry_unix: 1765843200,
        description: "Sữa tươi sạch TH true MILK - Thật sự thiên nhiên.",
        product_image: "https://product.hstatic.net/200000411281/product/th-true-milk-it-duong-1000ml_2b1e4256672343a49298448f21780496.jpg"
    },
    {
        uid: "DL_MILK_003",
        name: "Sữa Thanh Trùng Đà Lạt Milk",
        batch_number: "DL-X88",
        expiry_date: "20/10/2025",
        expiry_unix: 1761004800,
        description: "Sữa tươi thanh trùng Đà Lạt Milk được chế biến từ 100% sữa bò tươi.",
        product_image: "https://cdn.tgdd.vn/Products/Images/2386/79468/sua-tuoi-thanh-trung-dalat-milk-khong-duong-950ml-1-org.jpg"
    }
];

const SAMPLE_USERS = [
    {
        fullname: "Quản Trị Viên",
        username: "admin",
        password: "123",
        role: "admin",
        email: "admin@family.milk"
    },
    {
        fullname: "Khách Hàng Mẫu",
        username: "khachhang",
        password: "123",
        role: "user",
        email: "customer@gmail.com"
    }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log("✅ Đã kết nối Database...");

        // Xóa dữ liệu cũ
        await Product.deleteMany({});
        await User.deleteMany({});
        await History.deleteMany({});
        console.log("🗑️  Đã xóa sạch dữ liệu cũ.");

        // Khởi tạo kết nối Blockchain
        const isBlockchainReady = await initBlockchain();

        // Tạo Products mới (kèm ghi Blockchain nếu có)
        for (const p of SAMPLE_PRODUCTS) {
            let txHash = p.tx_hash || "N/A"; // Mặc định là N/A hoặc hash giả nếu có sẵn

            // Nếu Blockchain sẵn sàng, ghi thật luôn!
            if (isBlockchainReady) {
                const realHash = await createOnChain(p.uid, p.name, p.batch_number, p.expiry_unix);
                if (realHash && realHash !== "Error") {
                    txHash = realHash;
                    console.log(`   -> ⛓️  Đã ghi Block: ${txHash}`);
                }
            }

            const qrUrl = `http://localhost:5173?uid=${p.uid}`;
            const qrBase64 = await QRCode.toDataURL(qrUrl); // Fix: dùng qrUrl

            await Product.create({
                ...p,
                qr_image: qrBase64,
                tx_hash: txHash, // Lưu hash thật
                created_at: new Date().toLocaleDateString("vi-VN"),
                scan_count: Math.floor(Math.random() * 50)
            });
            console.log(`+ Đã thêm sản phẩm: ${p.name}`);
        }

        // Tạo Users mới
        for (const u of SAMPLE_USERS) {
            const hashedPassword = await bcrypt.hash(u.password, 10); // Mã hóa password
            await User.create({ ...u, password: hashedPassword });
            console.log(`+ Đã thêm user: ${u.username} (${u.role})`);
        }

        console.log("\n🎉 KHỞI TẠO DỮ LIỆU MẪU THÀNH CÔNG!");
        console.log("👉 Giờ bạn có thể vào web để kiểm tra.");
        process.exit(0);

    } catch (e) {
        console.error("❌ Lỗi khi tạo dữ liệu:", e);
        process.exit(1);
    }
};

seedData();
