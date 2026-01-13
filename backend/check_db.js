const connectDB = require("./database");
const { Product } = require("./models");

const checkData = async () => {
    try {
        await connectDB();
        const count = await Product.countDocuments();
        console.log(`✅ Tổng số sản phẩm trong DB: ${count}`);

        const products = await Product.find().limit(5);
        console.log("5 sản phẩm đầu tiên:", JSON.stringify(products, null, 2));

        process.exit(0);
    } catch (e) {
        console.error("Lỗi:", e);
        process.exit(1);
    }
};

checkData();
