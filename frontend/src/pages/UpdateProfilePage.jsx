import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../services/api";

export default function UpdateProfilePage({ user, onBack, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.updateProfile(formData);
      if (res.status === "success") {
        setMessage("Cập nhật thông tin thành công!");
        if (onUpdateSuccess) {
          onUpdateSuccess(res.user); // Giả sử API trả về user mới
        }
      } else {
        setMessage(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      setMessage("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      {/* BACK BUTTON */}
      <button
        className="btn btn-link mb-3 d-flex align-items-center gap-2 text-primary fw-semibold"
        onClick={onBack}
      >
        <ArrowLeft size={18} /> Quay lại
      </button>

      {/* HEADER */}
      <div
        className="p-4 rounded-4 mb-4"
        style={{
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          borderLeft: "6px solid #0d6efd",
        }}
      >
        <h3 className="mb-0 text-primary fw-bold">Cập nhật thông tin cá nhân</h3>
      </div>

      {/* FORM */}
      <div
        className="p-4 rounded-4"
        style={{
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Họ tên</label>
            <input
              type="text"
              className="form-control"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <div className={`alert ${message.includes("thành công") ? "alert-success" : "alert-danger"} mb-3`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2 fw-semibold"
            disabled={loading}
          >
            <Save size={16} />
            {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}