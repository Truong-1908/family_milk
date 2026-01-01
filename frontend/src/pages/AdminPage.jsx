import React, { useState, useEffect } from "react";
// import { api } from '../services/api'; // Tạm thời comment để tránh lỗi import khi chưa có file api
import {
  LogOut,
  History,
  RefreshCcw,
  Eye,
  EyeOff,
  Plus,
  List,
} from "lucide-react";

// Định nghĩa API trực tiếp tại đây để file hoạt động độc lập
const API_URL = "http://127.0.0.1:8000";

const api = {
  getProducts: async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      return await res.json();
    } catch (e) {
      console.error("Lỗi lấy danh sách sản phẩm:", e);
      return [];
    }
  },
  createProduct: async (productData) => {
    try {
      const res = await fetch(`${API_URL}/create_product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      return await res.json();
    } catch (e) {
      return { status: "error", message: "Lỗi kết nối Server" };
    }
  },
  getHistory: async () => {
    try {
      const res = await fetch(`${API_URL}/scan_history`);
      return await res.json();
    } catch (e) {
      return [];
    }
  },
};

export default function AdminPage({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hiddenList, setHiddenList] = useState(
    JSON.parse(localStorage.getItem("hidden_products") || "[]")
  );

  const loadData = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Xử lý dữ liệu
    data.expiry_date_unix = Math.floor(new Date(data.p_date).getTime() / 1000);
    // Link QR trỏ về frontend
    data.qr_url = `${window.location.origin}/?uid=${data.uid}`;

    const res = await api.createProduct(data);
    if (res.status === "success") {
      alert("✅ Tạo sản phẩm thành công!");
      loadData();
      e.target.reset();
    } else {
      alert("❌ Lỗi: " + res.message);
    }
  };

  const toggleHide = (uid) => {
    const newList = hiddenList.includes(uid)
      ? hiddenList.filter((id) => id !== uid)
      : [...hiddenList, uid];
    setHiddenList(newList);
    localStorage.setItem("hidden_products", JSON.stringify(newList));
  };

  const loadHistory = async () => {
    const data = await api.getHistory();
    setHistory(data);
    setShowHistory(true);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-primary mb-0">Quản Trị Hệ Thống</h2>
          <p className="text-muted m-0">Milk Family Factory Dashboard</p>
        </div>
        <button
          className="btn btn-outline-danger rounded-pill px-4 fw-bold"
          onClick={onLogout}
        >
          <LogOut size={18} className="me-2" /> Đăng Xuất
        </button>
      </div>

      <div className="row g-4">
        {/* Form Tạo */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
              <Plus size={20} className="me-2 text-primary" /> Tạo Sản Phẩm Mới
            </h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Mã Định Danh (UID)
                </label>
                <input
                  name="uid"
                  className="form-control rounded-3"
                  placeholder="Ví dụ: MF_001"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Tên Sản Phẩm
                </label>
                <input
                  name="name"
                  className="form-control rounded-3"
                  placeholder="Ví dụ: Sữa Tươi 100%"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Số Lô (Batch)
                </label>
                <input
                  name="batch_number"
                  className="form-control rounded-3"
                  placeholder="Ví dụ: Lô A1"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Hạn Sử Dụng
                </label>
                <input
                  name="p_date"
                  type="date"
                  className="form-control rounded-3"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Link Ảnh (URL)
                </label>
                <input
                  name="product_image"
                  className="form-control rounded-3"
                  placeholder="https://..."
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">
                  Mô Tả Chi Tiết
                </label>
                <textarea
                  name="description"
                  className="form-control rounded-3"
                  rows="3"
                  placeholder="Thông tin sản phẩm..."
                ></textarea>
              </div>
              <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold">
                LƯU DATABASE
              </button>
            </form>
          </div>
        </div>

        {/* Danh Sách */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0 d-flex align-items-center">
                <List size={20} className="me-2 text-primary" /> Danh Sách Sản
                Phẩm
              </h5>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-info text-white btn-sm rounded-pill px-3"
                  onClick={loadHistory}
                >
                  <History size={16} className="me-1" /> Lịch Sử Quét
                </button>
                <button
                  className="btn btn-light border btn-sm rounded-pill px-3"
                  onClick={loadData}
                >
                  <RefreshCcw size={16} className="me-1" /> Làm mới
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 ps-3">Mã ID</th>
                    <th className="py-3">Tên Sản Phẩm</th>
                    <th className="py-3 text-center">Lượt Quét</th>
                    <th className="py-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colspan="4" className="text-center py-4 text-muted">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr
                        key={p.uid}
                        style={{
                          opacity: hiddenList.includes(p.uid) ? 0.5 : 1,
                        }}
                      >
                        <td className="ps-3">
                          <span className="badge bg-light text-primary border">
                            {p.uid}
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">{p.name}</div>
                          <small className="text-muted">{p.batch_number}</small>
                        </td>
                        <td className="text-center fw-bold text-secondary">
                          {p.scan_count || 0}
                        </td>
                        <td className="text-center">
                          <button
                            className={`btn btn-sm btn-icon ${
                              hiddenList.includes(p.uid)
                                ? "btn-secondary"
                                : "btn-outline-primary"
                            } rounded-circle p-2`}
                            onClick={() => toggleHide(p.uid)}
                            title={
                              hiddenList.includes(p.uid)
                                ? "Hiện sản phẩm"
                                : "Ẩn sản phẩm"
                            }
                          >
                            {hiddenList.includes(p.uid) ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lịch Sử */}
      {showHistory && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title fw-bold">Lịch Sử Quét Sản Phẩm</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowHistory(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="table-responsive" style={{ maxHeight: "60vh" }}>
                  <table className="table table-striped mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Thời Gian</th>
                        <th>Mã Sản Phẩm</th>
                        <th>Vị Trí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => (
                        <tr key={i}>
                          <td className="ps-4">{h.time}</td>
                          <td>
                            <span className="badge bg-secondary">{h.uid}</span>
                          </td>
                          <td>{h.location}</td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center py-4">
                            Chưa có lịch sử nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
