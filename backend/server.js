require("dotenv").config(); // Khởi tạo biến môi trường cho Deploy
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // [MỚI] Import bcryptjs
const jwt = require("jsonwebtoken"); // [MỚI] Import jsonwebtoken
const QRCode = require("qrcode"); // Thư viện tạo mã QR
const mongoose = require("mongoose");
const connectDB = require("./database");
const { Product, History, User } = require("./models");
const {
  initBlockchain,
  createOnChain,
  verifyOnChain,
} = require("./blockchain");
const { getAnswer } = require("./ai_module");

const app = express();
const PORT = process.env.PORT || 8000; // Thay đổi để hỗ trợ Hosting (Render)
const JWT_SECRET = process.env.JWT_SECRET || "family_milk_secret";

// [MỚI] Middleware xác thực JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

// --- MIDDLEWARE ---
app.use(cors()); // Cho phép Frontend (React) gọi API
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// --- KHỞI ĐỘNG DỊCH VỤ ---
connectDB(); // Kết nối MongoDB
initBlockchain(); // Kết nối Ganache

//  Kiểm tra mật khẩu mạnh
function validatePassword(password) {
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  if (!/[A-Za-z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ cái";
  }
  if (!/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 số";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt";
  }
  return null;
}

// Hàm tự động xác định Category từ UID
function getCategoryFromUID(uid) {
  uid = String(uid).toUpperCase();
  if (uid.startsWith("SNL")) return "Sữa Người Lớn";
  if (uid.startsWith("SB")) return "Sữa Bột Cho Bé";
  if (uid.startsWith("ST")) return "Sữa Tươi";
  if (uid.startsWith("SC")) return "Sữa Chua";
  if (uid.startsWith("SH")) return "Sữa Hạt";
  return null;
}

// --- CÁC API ENDPOINTS ---

// 1. Lấy danh sách sản phẩm (Cho cả Admin và User)
app.get("/products", async (req, res) => {
  try {
    // Lấy tất cả, sắp xếp mới nhất lên đầu (-1)
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Tạo sản phẩm mới (Dành cho Admin)
app.post("/create_product", async (req, res) => {
  try {
    const p = req.body;

    // Kiểm tra trùng mã ID
    if (await Product.findOne({ uid: p.uid })) {
      return res.json({ status: "error", message: "Mã ID này đã tồn tại!" });
    }

    // A. Ghi lên Blockchain (Lấy Hash giao dịch)
    const txHash = await createOnChain(
      p.uid,
      p.name,
      "N/A", // Đã ẩn quản lý lô
      p.expiry_date_unix
    );

    // B. Tạo mã QR (Dạng Base64 ảnh)
    // Link này trỏ về Frontend để khi quét sẽ mở trang web lên
    const clientURL = p.qr_url || `http://localhost:5173?uid=${p.uid}`;
    const qrBase64 = await QRCode.toDataURL(clientURL);

    // C. Lưu vào MongoDB (Lưu chi tiết)
    const newProduct = new Product({
      uid: p.uid,
      name: p.name,
      category: getCategoryFromUID(p.uid) || p.category || "Sữa Tươi",
      batch_number: "N/A",
      expiry_date: new Date(p.expiry_date_unix * 1000).toLocaleDateString(
        "vi-VN"
      ),
      expiry_unix: p.expiry_date_unix,
      created_at: new Date().toLocaleDateString("vi-VN"),

      tx_hash: txHash,
      qr_image: qrBase64,

      // Dùng ảnh mặc định nếu không nhập
      product_image:
        p.product_image ||
        "https://vinamilk.com.vn/static/uploads/2021/05/Sua-tuoi-tiet-trung-Vinamilk-100-tach-beo-khong-duong-1.jpg",
      description:
        p.description ||
        "Sản phẩm sữa tươi tiệt trùng, giàu dinh dưỡng, tốt cho sức khỏe.",
    });

    await newProduct.save();
    res.json({ status: "success", tx_hash: txHash });
  } catch (e) {
    console.error("Create Error:", e);
    res.status(500).json({ status: "error", message: e.message });
  }
});

// [MỚI] API Nhập hàng loạt từ CSV
app.post("/create_products_bulk", async (req, res) => {
  try {
    const products = req.body.products;
    console.log(`📦 Đang xử lý nhập hàng loạt: ${products.length} sản phẩm...`);
    const results = [];

    for (const p of products) {
      try {
        if (await Product.findOne({ uid: p.uid })) {
          results.push({ uid: p.uid, status: "skip", message: "Đã tồn tại" });
          continue;
        }

        // Ghi Blockchain
        const txHash = await createOnChain(
          p.uid,
          p.name,
          "N/A",
          p.expiry_date_unix
        );

        // Tạo QR
        const clientURL = `http://localhost:5173?uid=${p.uid}`;
        const qrBase64 = await QRCode.toDataURL(clientURL);

        // Lưu DB
        const newProduct = new Product({
          uid: p.uid,
          name: p.name,
          category: getCategoryFromUID(p.uid) || p.category || "Sữa Tươi",
          batch_number: "N/A",
          expiry_date:
            p.expiry_date ||
            new Date(p.expiry_date_unix * 1000).toLocaleDateString("vi-VN"),
          expiry_unix: p.expiry_date_unix,
          created_at: new Date().toLocaleDateString("vi-VN"),
          tx_hash: txHash,
          qr_image: qrBase64,
          product_image: p.product_image,
          description: p.description,
        });

        await newProduct.save();
        results.push({ uid: p.uid, status: "success" });
        console.log(`✅ Đã nhập: ${p.uid}`);
      } catch (err) {
        console.error(`❌ Lỗi ${p.uid}:`, err.message);
      }
    }
    res.json({ status: "success", results: results });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// [MỚI] Cập nhật sản phẩm
app.put("/products/:uid", async (req, res) => {
  try {
    const p = req.body;
    await Product.findOneAndUpdate(
      { uid: req.params.uid },
      {
        name: p.name,
        category: getCategoryFromUID(req.params.uid) || p.category || "Sữa Tươi",
        batch_number: "N/A",
        expiry_date: p.expiry_date || new Date(p.expiry_date_unix * 1000).toLocaleDateString("vi-VN"),
        expiry_unix: p.expiry_date_unix,
        product_image: p.product_image,
        description: p.description,
      }
    );
    res.json({ status: "success", message: "Đã cập nhật sản phẩm" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// [MỚI] Xóa sản phẩm
app.delete("/products/:uid", async (req, res) => {
  try {
    await Product.findOneAndDelete({ uid: req.params.uid });
    res.json({ status: "success", message: "Đã xóa sản phẩm" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// [MỚI] Middleware xác thực tùy chọn
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
      } catch (e) {
        // Bỏ qua lỗi
      }
    }
  }
  next();
}

// 3. Xác thực sản phẩm (Dành cho User khi quét mã hoặc nhập tên)
app.get("/verify/:uid", optionalAuthMiddleware, async (req, res) => {
  try {
    const query = req.params.uid; // Người dùng có thể gửi mã UID hoặc Tên sản phẩm

    // Tính toán số lần quét của user hiện tại (nếu có)
    let my_scan_count = 0;

    // Bước 1: Tìm trong Database
    // Logic: Tìm UID chính xác HOẶC Tên sản phẩm có chứa từ khóa (không phân biệt hoa thường)
    const p = await Product.findOne({
      $or: [{ uid: query }, { name: { $regex: query, $options: "i" } }],
    });

    let targetUid = query;
    if (p) {
      targetUid = p.uid;
    }

    if (req.user) {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        my_scan_count = await History.countDocuments({ uid: targetUid, user: userId });
    }

    if (p) {
      return res.json({
        is_valid: true,
        uid: p.uid,
        name: p.name,
        category: p.category,
        batch_number: p.batch_number,
        expiry_date: p.expiry_date,
        scan_count: p.scan_count || 0,
        my_scan_count: my_scan_count,
        product_image: p.product_image,
        description: p.description,
        tx_hash: p.tx_hash,
        source: "Database",
      });
    }

    // Bước 2: Nếu không thấy trong DB, thử tìm trên Blockchain (chỉ hỗ trợ UID)
    const bcData = await verifyOnChain(targetUid);
    if (bcData) {
      return res.json({
        is_valid: true,
        uid: targetUid,
        name: bcData.name,
        batch_number: bcData.batch_number,
        expiry_date: new Date(bcData.expiry_unix * 1000).toLocaleDateString(
          "vi-VN"
        ),
        product_image: "https://via.placeholder.com/300?text=No+Image",
        description: "Dữ liệu được khôi phục từ Blockchain.",
        scan_count: 0,
        my_scan_count: my_scan_count,
        source: "Blockchain",
      });
    }

    // Không tìm thấy
    res.json({ is_valid: false });
  } catch (e) {
    res.status(500).json({ is_valid: false });
  }
});

// 4. Ghi nhận lượt quét (Thống kê)
app.post("/record_scan", authMiddleware, async (req, res) => {
  try {
    const { uid, location, status } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log("Ghi nhận quét được gọi:", { uid, location, status, userId: req.user.id });

    // Chỉ tăng đếm nếu hợp lệ
    if (status !== "invalid") {
      await Product.updateOne({ uid: uid }, { $inc: { scan_count: 1 } });
    }

    // Lưu lịch sử chi tiết (cả đúng và sai)
    const now = new Date();
    const historyData = {
      uid: uid,
      location: location || "Không xác định",
      time: now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
      status: status || "valid",
      user: userId, // Liên kết với user đang đăng nhập (as ObjectId)
      timestamp: now,
    };
    const savedHistory = await History.create(historyData);
    console.log("Lịch sử được lưu:", savedHistory);

    res.json({ status: "success" });
  } catch (e) {
    console.error("Lỗi ghi nhận quét:", e);
    res.json({ status: "error", message: e.message });
  }
});

// 5. Lấy lịch sử quét (Cho Admin xem)
app.get("/scan_history", async (req, res) => {
  try {
    const data = await History.find().sort({ timestamp: -1 }).limit(50);
    res.json(data);
  } catch (e) {
    res.json([]);
  }
});

// 5.1. Lấy lịch sử quét của user đang đăng nhập
app.get("/my_scan_history", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log("Lấy lịch sử của người dùng:", req.user.id, "(ObjectId:", userId, ")");
    const data = await History.find({ user: userId })
      .sort({ timestamp: -1 })
      .populate('user', 'fullname username') // Lấy thông tin user
      .limit(100);
    console.log("Tìm thấy lịch sử:", data.length, "bản ghi");
    res.json(data);
  } catch (e) {
    console.error("Lỗi lấy lịch sử:", e);
    res.json([]);
  }
});

// 6. Hỏi đáp AI
app.post("/ask_ai", async (req, res) => {
  const { product_name, question } = req.body;
  const ans = await getAnswer(product_name, question);
  res.json({ answer: ans });
});

// 7. Đăng ký tài khoản
app.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // Hàm kiểm tra mật khẩu
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.json({
        status: "error",
        message: passwordError,
      });
    } 
    // Check trùng
    const exists = await User.findOne({ username });
    if (exists)
      return res.json({
        status: "error",
        message: "Tên đăng nhập đã tồn tại!",
      });
   
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();

    res.json({ status: "success", message: "Đăng ký thành công!" });
  } catch (e) {
    res.json({ status: "error", message: e.message });
  }
});

// 8. Đăng nhập
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user theo username
    const user = await User.findOne({ username });

    // tai khoan hoac mat khau sai
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({
        status: "error",
        message: "Sai tài khoản hoặc mật khẩu!",
      });
    }

    // tao token jwt
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // tra token về cho client
    res.json({
      status: "success",
      token, 
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.json({ status: "error", message: "Lỗi Server" });
  }
});


// 9. Lấy danh sách người dùng (Cho Admin)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 });
    res.json(users);
  } catch (e) {
    res.json([]);
  }
});

// [THÊM API NÀY] Dùng để Reset dữ liệu khi cần
app.get("/clear_database", async (req, res) => {
  try {
    // Xóa sạch Sản phẩm và Lịch sử quét
    await Product.deleteMany({});
    await History.deleteMany({});

    console.log("⚠️ Đã xóa sạch dữ liệu trong Database!");
    res.send(
      "<h1>✅ Đã xóa sạch Database! Giờ bạn có thể Import lại từ đầu.</h1>"
    );
  } catch (e) {
    res.status(500).send("Lỗi: " + e.message);
  }
});

// 10. Lấy thông tin user đang đăng nhập
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 11. Cập nhật thông tin user đang đăng nhập
app.put("/me", authMiddleware, async (req, res) => {
  try {
    const { fullname, email } = req.body;

    // kiểm tra dữ liệu
    if (!fullname || !email) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu thông tin cập nhật",
      });
    }

    // cập nhật
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullname,
        email,
      },
      { new: true, select: "-password" }
    );

    res.json({
      status: "success",
      message: "Cập nhật thành công",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "error",
      message: "Lỗi server",
    });
  }
});

// Chạy Server
app.listen(PORT, () => {
  console.log(`🚀 Server Node.js đang chạy tại: http://localhost:${PORT}`);
});

