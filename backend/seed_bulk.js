const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx'); // Cần cài: npm install xlsx
const QRCode = require('qrcode');
const connectDB = require("./database");
const { Product } = require("./models");
const { initBlockchain, createOnChain } = require("./blockchain");

// Hàm chuyển đổi ngày dd/mm/yyyy sang Unix Timestamp
function parseDateToUnix(dateStr) {
    if (!dateStr) return Math.floor(Date.now() / 1000);
    // Nếu là số (Excel date serial number)
    if (typeof dateStr === 'number') {
        const date = new Date((dateStr - (25567 + 2)) * 86400 * 1000);
        return Math.floor(date.getTime() / 1000);
    }
    const parts = dateStr.toString().split('/');
    if (parts.length === 3) {
        return Math.floor(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime() / 1000);
    }
    return Math.floor(Date.now() / 1000);
}

const importData = async () => {
    try {
        await connectDB();
        await initBlockchain();

        const results = [];
        const csvPath = path.join(__dirname, 'products.csv');
        const xlsxPath = path.join(__dirname, 'products.xlsx');

        let dataToImport = [];

        if (fs.existsSync(xlsxPath)) {
            console.log("🚀 Phát hiện file Excel (.xlsx). Đang đọc...");
            const workbook = XLSX.readFile(xlsxPath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            dataToImport = XLSX.utils.sheet_to_json(sheet);
        } else if (fs.existsSync(csvPath)) {
            console.log("🚀 Phát hiện file CSV. Đang đọc...");
            await new Promise((resolve, reject) => {
                fs.createReadStream(csvPath)
                    .pipe(csv())
                    .on('data', (data) => dataToImport.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else {
            console.error("❌ Lỗi: Không tìm thấy file 'products.csv' hoặc 'products.xlsx'!");
            process.exit(1);
        }

        console.log(`📦 Tìm thấy ${dataToImport.length} sản phẩm. Bắt đầu nhập...`);

        for (const [index, p] of dataToImport.entries()) {
            console.log(`\n--- Sản phẩm ${index + 1}/${dataToImport.length}: ${p.uid} ---`);

            try {
                // 1. Check trùng
                const exists = await Product.findOne({ uid: p.uid });
                if (exists) {
                    console.log(`⚠️ Đã tồn tại trong DB -> Bỏ qua.`);
                    continue;
                }

                // 2. Parse dữ liệu
                const expiryUnix = parseDateToUnix(p.expiry_date);

                // 3. Blockchain
                console.log("⏳ Đang ghi lên Blockchain...");
                // Giả lập delay nhẹ để tránh spam quá nhanh
                await new Promise(r => setTimeout(r, 1000));

                const txHash = await createOnChain(
                    p.uid,
                    p.name,
                    p.batch_number,
                    expiryUnix
                );
                console.log(`✅ Blockchain OK. Hash: ${txHash}`);

                // 4. QR Code
                const clientURL = `http://localhost:5173?uid=${p.uid}`;
                const qrBase64 = await QRCode.toDataURL(clientURL);

                // 5. MongoDB
                const newProduct = new Product({
                    uid: p.uid,
                    name: p.name,
                    category: p.category || "Sữa Tươi",
                    batch_number: p.batch_number,
                    expiry_date: typeof p.expiry_date === 'string' ? p.expiry_date : new Date(expiryUnix * 1000).toLocaleDateString("vi-VN"),
                    expiry_unix: expiryUnix,
                    created_at: new Date().toLocaleDateString("vi-VN"),
                    tx_hash: txHash,
                    qr_image: qrBase64,
                    product_image: p.product_image,
                    description: p.description
                });

                await newProduct.save();
                console.log(`🎉 Đã lưu thành công!`);

            } catch (err) {
                console.error(`❌ Lỗi nhập sản phẩm ${p.uid}:`, err.message);
            }
        }

        console.log("\n🏁 === HOÀN TẤT NHẬP DỮ LIỆU ===");
        process.exit(0);

    } catch (e) {
        console.error("Lỗi script:", e);
        process.exit(1);
    }
};

importData();
