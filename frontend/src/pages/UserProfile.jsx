import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Lock, LogOut } from "lucide-react";
import { api } from "../services/api";

export default function UserProfile({ user, onBack, onLogout, onUpdateProfile, onChangePassword, onViewHistory }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log("UserProfile: Fetching activities...");
        const data = await api.getMyHistory();
        console.log("UserProfile: Activities data:", data);
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

  if (!user) return null;

  return (
    <div className="container py-4" style={{ background: "#f4f6f9" }}>

      {/* BACK */}
      <button
        className="btn btn-link mb-3 d-flex align-items-center gap-2 text-primary fw-semibold"
        onClick={onBack}
      >
        <ArrowLeft size={18} /> Quay lại
      </button>

      {/* HEADER CARD */}
      <div
        className="p-4 rounded-4 mb-4"
        style={{
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          borderLeft: "6px solid #0d6efd",
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            {/* AVATAR */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 64,
                height: 64,
                background: "#e7f1ff",
                color: "#0d6efd",
              }}
            >
              <User size={32} />
            </div>

            {/* USER INFO */}
          <div>
            <div className="fw-bold fs-5 text-dark">
              {user.fullname || "Chưa cập nhật"}
            </div>
          </div>
        </div>
          {/* UPDATE BUTTON */}
          <button 
            className="btn btn-primary fw-semibold rounded-pill px-4"
            onClick={onUpdateProfile}
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="row g-4">
        {/* LEFT */}
        <div className="col-md-6">
          <div
            className="p-4 rounded-4 h-100"
            style={{
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h5 className="mb-3 text-primary fw-bold">
              Thông tin cá nhân
            </h5>

            <p>
              <strong>Họ tên:</strong>{" "}
              {user.fullname || (
                <span className="text-muted">Chưa cập nhật</span>
              )}
            </p>
            <p>
              <strong>Tên đăng nhập:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-6">
          <div
            className="p-4 rounded-4 h-100"
            style={{
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h5 className="mb-3 text-primary fw-bold">
              Hoạt động gần đây
            </h5>
            {activities.length > 0 ? (
              <>
                <ul className="list-unstyled">
                  {activities.slice(0, 5).map((activity, index) => (
                    <li key={index} className="mb-2">
                      <small className="text-muted">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')} - 
                        Quét sản phẩm: {activity.product_name || 'N/A'}
                      </small>
                    </li>
                  ))}
                </ul>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={onViewHistory}
                >
                  Xem tất cả lịch sử
                </button>
              </>
            ) : (
              <p className="text-muted mb-0">
                Chưa có dữ liệu hoạt động.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button 
          className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold"
          onClick={onChangePassword}
        >
          <Lock size={16} /> Đổi mật khẩu
        </button>
        <button
          className="btn btn-outline-danger d-flex align-items-center gap-2 fw-semibold"
          onClick={onLogout}
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}
