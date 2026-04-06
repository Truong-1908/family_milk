import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Calendar, Package, CheckCircle, XCircle } from "lucide-react";
import { api } from "../services/api";

export default function UserHistory({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError("Vui lòng đăng nhập để xem lịch sử tra cứu");
        setLoading(false);
        return;
      }
      try {
        console.log("\u0110ang t\u1ea3i l\u1ecbch s\u1eed...");
        const data = await api.getMyHistory();
        console.log("Nh\u1eadn \u0111\u01b0\u1ee3c d\u1eef li\u1ec7u l\u1ecbch s\u1eed:", data);
        
        if (!data || data.length === 0) {
          console.log("Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u l\u1ecbch s\u1eed");
          setHistory([]);
          setLoading(false);
          return;
        }
        
        // Fetch product names for each history item
        const historyWithProducts = await Promise.all(
          data.map(async (item) => {
            try {
              const productData = await api.verifyProduct(item.uid);
              return {
                ...item,
                product_name: productData.is_valid ? productData.name : 'N/A',
                is_valid: productData.is_valid
              };
            } catch (err) {
              return {
                ...item,
                product_name: 'N/A',
                is_valid: false
              };
            }
          })
        );
        console.log("L\u1ecbch s\u1eed k\u00e8m s\u1ea3n ph\u1ea9m:", historyWithProducts);
        setHistory(historyWithProducts);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Không thể tải lịch sử tra cứu");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <div className="d-flex align-items-center gap-3">
          <Search size={32} className="text-primary" />
          <div>
            <h3 className="mb-0 text-primary fw-bold">Lịch sử tra cứu</h3>
            <p className="mb-0 text-muted">Danh sách các lần quét và tra cứu sản phẩm của bạn</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="p-4 rounded-4"
        style={{
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">\u0110ang t\u1ea3i...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải lịch sử...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <strong>Lỗi:</strong> {error}
          </div>
          
        ) : history.length === 0 ? (
          <div className="text-center py-5">
            <Package size={48} className="text-muted mb-3" />
            <h5 className="text-muted">Chưa có lịch sử tra cứu</h5>
            <p className="text-muted">Bạn chưa thực hiện tra cứu sản phẩm nào.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">#</th>
                  <th className="fw-semibold">
                    <Calendar size={16} className="me-2" />
                    Thời gian
                  </th>
                  <th className="fw-semibold">
                    <Package size={16} className="me-2" />
                    Sản phẩm
                  </th>
                  <th className="fw-semibold">UID</th>
                  <th className="fw-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    <td>{formatDate(item.timestamp)}</td>
                    <td>
                      <strong>{item.product_name || 'N/A'}</strong>
                    </td>
                    <td>
                      <code className="small">{item.uid || 'N/A'}</code>
                    </td>
                    <td>
                      {item.is_valid ? (
                        <span className="badge bg-success d-flex align-items-center gap-1">
                          <CheckCircle size={12} />
                          Hợp lệ
                        </span>
                      ) : (
                        <span className="badge bg-danger d-flex align-items-center gap-1">
                          <XCircle size={12} />
                          Không hợp lệ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}