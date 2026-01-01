import React from 'react';
import { ArrowRight } from 'lucide-react';

const HomePage = ({ onStart }) => {
    return (
        <div className="container flex-grow-1 d-flex align-items-center justify-content-center text-center py-5 min-vh-100">
            <div className="animate-in">
                <span className="badge bg-white text-primary px-4 py-2 rounded-pill mb-4 fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                    <span className="status-dot bg-success rounded-circle" style={{ width: 8, height: 8 }}></span>
                    Công Nghệ Blockchain 4.0
                </span>
                <h1
                    className="display-2 fw-bold mb-4 text-dark lh-tight"
                    style={{ letterSpacing: "-2px" }}
                >
                    Truy Xuất Nguồn Gốc
                    <br />
                    <span className="text-gradient">Sữa An Toàn Tuyệt Đối</span>
                </h1>
                <p
                    className="text-muted fs-5 mb-5 mx-auto"
                    style={{ maxWidth: "650px", lineHeight: "1.8" }}
                >
                    Hệ thống minh bạch hóa quy trình sản xuất từ nông trại đến bàn ăn.
                    Đảm bảo chất lượng và niềm tin cho mọi gia đình Việt.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button
                        className="btn btn-primary-gradient btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center"
                        onClick={onStart}
                    >
                        Tra Cứu Ngay <ArrowRight size={20} className="ms-2" />
                    </button>
                    <button className="btn btn-white btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm text-primary">
                        Tìm Hiểu Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
