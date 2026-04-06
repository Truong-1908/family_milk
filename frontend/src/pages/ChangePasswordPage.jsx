import React, { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";

export default function ChangePasswordPage({ onBack }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage("Mật khẩu mới phải có ít nhất 8 ký tự");
      setLoading(false);
      return;
    }

    // Giả lập API call
    try {
      // const res = await api.changePassword(formData);
      // if (res.status === "success") {
      //   setMessage("Đổi mật khẩu thành công!");
      // } else {
      //   setMessage(res.message || "Có lỗi xảy ra");
      // }

      // Placeholder: alert thay vì API
      setTimeout(() => {
        alert("Chức năng đổi mật khẩu đang được phát triển. API chưa có sẵn.");
        setMessage("Đổi mật khẩu thành công! (giả lập)");
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage("Lỗi kết nối server");
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
        <h3 className="mb-0 text-primary fw-bold">Đổi mật khẩu</h3>
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
            <label className="form-label fw-semibold">Mật khẩu cũ</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            <Lock size={16} />
            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}