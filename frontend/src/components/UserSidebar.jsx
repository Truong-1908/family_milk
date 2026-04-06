import { motion, AnimatePresence } from "framer-motion";
import { User, History, LogOut, X } from "lucide-react";

export default function UserSidebar({
  open,
  onClose,
  onProfile,
  onHistory,
  onLogout,
  user,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          {/* SIDEBAR – ÉP DỌC BẰNG BOOTSTRAP + CSS */}
          <motion.div
            className="position-fixed top-0 start-0 h-100 bg-white shadow-lg d-flex flex-column"
            style={{
              width: "280px",          
              zIndex: 1050,
            }}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
          >
            {/* HEADER */}
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Tài khoản</h5>
              <X style={{ cursor: "pointer" }} onClick={onClose} />
            </div>

            {/* USER INFO */}
            <div className="p-4 text-center border-bottom">
              <User size={40} className="mb-2" />
              {/* NOTE: Tên lấy trực tiếp từ database */}
              <div className="fw-semibold">
                {user?.fullname || "Chưa cập nhật"}
              </div>

              {/* NOTE: Email lấy từ database */}
              <small className="text-muted">
                {user?.email}
              </small>
            </div>

            {/* MENU – DỌC */}
            <div className="p-3 d-flex flex-column gap-2">
              <button className="btn btn-light text-start" onClick={onProfile}>
                <User size={18} className="me-2" />
                Thông tin cá nhân
              </button>

              <button className="btn btn-light text-start" onClick={onHistory}>
                <History size={18} className="me-2" />
                Lịch sử tra cứu
              </button>
            </div>

            {/* LOGOUT */}
            <div className="mt-auto p-3">
              <button className="btn btn-danger w-100" onClick={onLogout}>
                <LogOut size={18} className="me-2" />
                Đăng xuất
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
