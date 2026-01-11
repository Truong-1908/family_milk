// frontend/create_mock_data.js
import * as XLSX from 'xlsx'; // Nếu dùng module type, hoặc dùng require bên dưới
import fs from 'fs';

// Vì file này chạy bằng Node thuần, ta dùng require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX_LIB = require("xlsx");

const categories = [
    { name: "Sữa Tươi", code: "ST", brands: ["Vinamilk", "TH True Milk", "Dalat Milk", "Dutch Lady", "Long Thành"] },
    { name: "Sữa Bột Cho Bé", code: "SB", brands: ["Meiji", "Aptamil", "Similac", "NAN", "Enfamil"] },
    { name: "Sữa Người Lớn", code: "SNL", brands: ["Ensure Gold", "Glucerna", "Anlene", "Varna", "Sure Prevent"] },
    { name: "Sữa Hạt", code: "SH", brands: ["TH True Nut", "Fami", "137 Degrees", "Vinamilk Đậu Nành", "Veyo"] },
    { name: "Sữa Chua", code: "SC", brands: ["Sữa Chua Vinamilk", "Sữa Chua TH", "Sữa Chua Hy Lạp", "Sữa Chua Nha Đam", "Probi"] }
];

const flavors = ["Ít Đường", "Có Đường", "Không Đường", "Hương Dâu", "Hương Socola", "Nguyên Bản"];

// Hàm random số
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Hàm tạo ngày ngẫu nhiên (từ nay đến 2 năm tới)
const randomDate = () => {
    const start = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 2);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    
    // Format DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const products = [];

// Tạo 20 sản phẩm cho mỗi danh mục (Tổng 100)
categories.forEach((cat) => {
    for (let i = 1; i <= 20; i++) {
        const brand = cat.brands[randomInt(0, cat.brands.length - 1)];
        const flavor = flavors[randomInt(0, flavors.length - 1)];
        
        // Logic tên sản phẩm cho tự nhiên
        let productName = `${brand} - ${cat.name}`;
        if (cat.name === "Sữa Tươi" || cat.name === "Sữa Hạt" || cat.name === "Sữa Chua") {
            productName = `${brand} ${flavor} (Lốc 4)`;
        } else {
            productName = `${brand} lon thiếc ${randomInt(400, 900)}g`;
        }

        products.push({
            "Mã sản phẩm": `${cat.code}_${randomInt(10000, 99999)}`,
            "Tên sản phẩm": productName,
            "Danh mục": cat.name,
            "Số lô": `BATCH_${randomInt(100, 999)}`,
            "Hạn sử dụng": randomDate(),
            "Link ảnh": "https://vinamilk.com.vn/static/uploads/2021/05/Sua-tuoi-tiet-trung-Vinamilk-100-tach-beo-khong-duong-1.jpg", // Ảnh minh họa chung
            "Mô tả": `Sản phẩm chính hãng từ ${brand}. Giàu dinh dưỡng, tốt cho sức khỏe.`
        });
    }
});

// Tạo workbook và sheet
const worksheet = XLSX_LIB.utils.json_to_sheet(products);
const workbook = XLSX_LIB.utils.book_new();
XLSX_LIB.utils.book_append_sheet(workbook, worksheet, "DanhSachSanPham");

// Xuất file
XLSX_LIB.writeFile(workbook, "Du_Lieu_Mau_Sua_100_SP.xlsx");

console.log("✅ Đã tạo file 'Du_Lieu_Mau_Sua_100_SP.xlsx' thành công với 100 sản phẩm!");
console.log("👉 Bạn hãy dùng file này để nhập vào hệ thống nhé.");