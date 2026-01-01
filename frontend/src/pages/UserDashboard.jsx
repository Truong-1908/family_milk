import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Package, ArrowRight, QrCode } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import Chatbot from '../components/Chatbot';
import { api } from '../services/api';

const UserDashboard = ({ onBack }) => {
    const [view, setView] = useState("list");
    const [products, setProducts] = useState([]);
    const [detail, setDetail] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [checkUid, setCheckUid] = useState("");
    const hiddenList = JSON.parse(
        localStorage.getItem("hidden_products") || "[]"
    );

    useEffect(() => {
        api
            .getProducts()
            .then((data) =>
                setProducts(data.filter((p) => !hiddenList.includes(p.uid)))
            );
    }, []);

    const verify = async (uid) => {
        const target = uid || checkUid;
        if (!target) return alert("Nhập mã!");
        if (hiddenList.includes(target)) return alert("Sản phẩm bị ẩn!");

        try {
            const data = await api.verifyProduct(target);
            if (data.is_valid) {
                setDetail({ ...data, uid: target });
                setView("detail");
                api.recordScan(target, "Web Client");
            } else alert("Không tìm thấy!");
        } catch (e) {
            alert("Lỗi kết nối");
        }
    };

    if (view === "detail" && detail) {
        return (
            <div className="container py-5 animate-in">
                <button
                    className="btn btn-light rounded-pill border mb-4 fw-bold px-3 shadow-sm"
                    onClick={() => setView("list")}
                >
                    <ArrowLeft size={18} className="me-2" /> Quay lại
                </button>

                <div className="glass-panel border-0 rounded-5 overflow-hidden mx-auto" style={{ maxWidth: "1000px" }}>
                    <div className="row g-0">
                        <div className="col-md-5 bg-white p-5 text-center border-end d-flex flex-column align-items-center justify-content-center">
                            <img
                                src={detail.product_image || "https://placehold.co/400"}
                                className="img-fluid mb-4 rounded-3"
                                style={{ maxHeight: "300px", objectFit: "contain" }}
                                alt={detail.name}
                                onError={(e) => {
                                    e.target.src = "https://vinamilk.com.vn/static/uploads/2021/05/Sua-tuoi-tiet-trung-Vinamilk-100-tach-beo-khong-duong-1.jpg";
                                }}
                            />
                            <div className="bg-white p-2 rounded-3 border shadow-sm d-inline-block">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${window.location.origin}/?uid=${detail.uid}`}
                                    width="100"
                                    alt="QR"
                                />
                            </div>
                        </div>
                        <div className="col-md-7 p-5">
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 text-success fw-bold mb-3 border border-success border-opacity-25">
                                <CheckCircle size={18} /> SẢN PHẨM CHÍNH HÃNG
                            </div>
                            <h2 className="fw-bold text-dark mb-2 display-6">{detail.name}</h2>
                            <p className="text-muted mb-4 d-flex align-items-center">
                                Mã định danh: <span className="fw-bold text-primary ms-2 bg-primary bg-opacity-10 px-2 py-1 rounded">{detail.uid}</span>
                            </p>

                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <small className="text-muted fw-bold d-block mb-1">SỐ LÔ SẢN XUẤT</small>
                                        <span className="fs-5 fw-bold text-dark">{detail.batch_number}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <small className="text-muted fw-bold d-block mb-1">HẠN SỬ DỤNG</small>
                                        <span className="fs-5 fw-bold text-danger">{detail.expiry_date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center">
                                    <Package size={18} className="me-2 text-primary" />
                                    Thông tin chi tiết:
                                </h6>
                                <p className="text-muted lh-base">
                                    {detail.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                                </p>
                            </div>

                            <hr className="my-4 border-light" />
                            <Chatbot productName={detail.name} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 animate-in">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-gradient mb-3 display-5">Tra Cứu Nguồn Gốc</h2>
                <p className="text-muted fs-5">Truy xuất thông tin sản phẩm minh bạch trên Blockchain</p>
            </div>

            <div className="glass-panel p-4 mx-auto text-center mb-5 rounded-pill shadow-lg" style={{ maxWidth: "700px" }}>
                <div className="d-flex gap-2 justify-content-center p-1">
                    <input
                        className="form-control rounded-pill border-0 ps-4 py-3 bg-light fs-5"
                        placeholder="Nhập mã sản phẩm (VD: MF_001)..."
                        value={checkUid}
                        onChange={(e) => setCheckUid(e.target.value)}
                    />
                    <button
                        className="btn btn-primary-gradient rounded-pill px-5 fw-bold"
                        onClick={() => verify()}
                    >
                        KIỂM TRA
                    </button>
                    <button
                        className="btn btn-dark rounded-pill px-4"
                        onClick={() => setShowScanner(true)}
                        title="Quét mã QR"
                    >
                        <QrCode size={20} />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-end mb-4 px-2">
                    <h4 className="fw-bold text-dark m-0">Sản Phẩm Nổi Bật</h4>
                    <span className="text-muted small heading-font">Danh sách sản phẩm hiện có</span>
                </div>

                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div className="col-6 col-md-4 col-lg-3" key={p.uid}>
                                <div
                                    className="glass-panel h-100 border-0 p-3 rounded-4 position-relative card-hover-effect"
                                    onClick={() => verify(p.uid)}
                                    style={{ cursor: "pointer", transition: "transform 0.3s ease" }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div className="position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2 shadow-sm z-1">
                                        <ArrowRight size={16} className="text-primary" />
                                    </div>
                                    <div className="bg-white rounded-3 p-3 mb-3 d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                                        <img
                                            src={p.product_image}
                                            className="img-fluid"
                                            style={{ maxHeight: "100%", objectFit: "contain" }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://vinamilk.com.vn/static/uploads/2021/05/Sua-tuoi-tiet-trung-Vinamilk-100-tach-beo-khong-duong-1.jpg";
                                            }}
                                        />
                                    </div>
                                    <h6 className="fw-bold text-dark text-truncate mb-1 px-1">{p.name}</h6>
                                    <small className="d-block text-muted px-1">Lô: {p.batch_number}</small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-muted py-5">
                            <Package size={48} className="mb-3 opacity-50" />
                            <p>Chưa có dữ liệu sản phẩm.</p>
                        </div>
                    )}
                </div>
            </div>
            {showScanner && (
                <QRScanner
                    onScan={(uid) => {
                        setShowScanner(false);
                        verify(uid);
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default UserDashboard;
