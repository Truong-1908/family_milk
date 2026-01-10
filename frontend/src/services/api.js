const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Tự động nhận diện URL Backend

export const api = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    const res = await fetch(`${API_URL}/create_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  // Xác thực sản phẩm (Tra cứu)
  verifyProduct: async (uid) => {
    const res = await fetch(`${API_URL}/verify/${uid}`);
    return res.json();
  },

  // Ghi lại lịch sử quét
  recordScan: async (uid, location) => {
    await fetch(`${API_URL}/record_scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, location }),
    });
  },

  // Lấy lịch sử quét (Cho Admin)
  getHistory: async () => {
    const res = await fetch(`${API_URL}/scan_history`);
    return res.json();
  },

  // Chat với AI
  askAI: async (productName, question) => {
    const res = await fetch(`${API_URL}/ask_ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_name: productName, question }),
    });
    return res.json();
  },

  // Đăng ký
  register: async (userData) => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // Đăng nhập
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  // Lấy danh sách users (Admin)
  getUsers: async () => {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },
};
