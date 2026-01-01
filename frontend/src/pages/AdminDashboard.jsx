import React, { useState, useEffect } from 'react';
import { Package, Plus, List, LogOut, History, RefreshCcw, Eye, EyeOff, Users, Search } from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'users'
    const [products, setProducts] = useState([]);
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]); // Mock users
    const [showHistory, setShowHistory] = useState(false);
    const [hiddenList, setHiddenList] = useState(
        JSON.parse(localStorage.getItem("hidden_products") || "[]")
    );

    const loadData = async () => {
        const data = await api.getProducts();
        setProducts(data);
        // Real Users
        const usersData = await api.getUsers();
        setUsers(usersData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.expiry_date_unix = Math.floor(new Date(data.p_date).getTime() / 1000);
        // data.qr_url = `${window.location.origin}/?uid=${data.uid}`; // Backend might handle this or we generate it

        const res = await api.createProduct(data);
        if (res.status === "success") {
            alert("✅ Thành công!");
            loadData();
            e.target.reset();
        } else alert("❌ Lỗi: " + res.message);
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
        <div className="container py-4 animate-in">
            <div className="glass-panel rounded-4 p-4 mb-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                        <Package size={24} />
                    </div>
                    <div>
                        <h4 className="fw-bold mb-0">Quản Trị Hệ Thống</h4>
                        <p className="text-muted m-0 small">Xin chào, Admin</p>
                    </div>
                </div>
                <button
                    className="btn btn-outline-danger rounded-pill px-4 fw-bold"
                    onClick={onLogout}
                >
                    <LogOut size={18} className="me-2" /> Đăng Xuất
                </button>
            </div>

            <div className="row g-4">
                {/* Sidebar / Menu */}
                <div className="col-lg-3">
                    <div className="glass-panel p-3 rounded-4 h-100">
                        <div className="d-grid gap-2">
                            <button
                                className={`btn text-start p-3 rounded-3 fw-bold ${activeTab === 'products' ? 'btn-primary text-white shadow' : 'btn-light text-muted'}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <Package size={20} className="me-2" /> Quản Lý Sản Phẩm
                            </button>
                            <button
                                className={`btn text-start p-3 rounded-3 fw-bold ${activeTab === 'users' ? 'btn-primary text-white shadow' : 'btn-light text-muted'}`}
                                onClick={() => setActiveTab('users')}
                            >
                                <Users size={20} className="me-2" /> Quản Lý Người Dùng
                            </button>
                            <button
                                className="btn btn-light text-start p-3 rounded-3 fw-bold text-muted"
                                onClick={loadHistory}
                            >
                                <History size={20} className="me-2" /> Lịch Sử Quét QR
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-lg-9">
                    {activeTab === 'products' && (
                        <div className="glass-panel p-4 rounded-4 animate-in">
                            <div className="row g-4 mb-4">
                                <div className="col-md-5 border-end">
                                    <h5 className="fw-bold mb-3 text-primary"><Plus size={20} className="me-1" /> Thêm Sản Phẩm Mới</h5>
                                    <form onSubmit={handleCreate}>
                                        <div className="mb-2">
                                            <label className="small fw-bold text-muted">Mã ID</label>
                                            <input name="uid" className="form-control rounded-3" placeholder="VD: MF_001" required />
                                        </div>
                                        <div className="mb-2">
                                            <label className="small fw-bold text-muted">Tên Sản Phẩm</label>
                                            <input name="name" className="form-control rounded-3" required />
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <label className="small fw-bold text-muted">Số Lô</label>
                                                <input name="batch_number" className="form-control rounded-3" required />
                                            </div>
                                            <div className="col-6">
                                                <label className="small fw-bold text-muted">Hạn Dùng</label>
                                                <input name="p_date" type="date" className="form-control rounded-3" required />
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="small fw-bold text-muted">Hình Ảnh (URL)</label>
                                            <input name="product_image" className="form-control rounded-3" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="small fw-bold text-muted">Mô Tả</label>
                                            <textarea name="description" className="form-control rounded-3" rows="2"></textarea>
                                        </div>
                                        <button className="btn btn-primary w-100 rounded-pill fw-bold">LƯU DATABASE</button>
                                    </form>
                                </div>
                                <div className="col-md-7">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold m-0"><List size={20} className="me-1" /> Danh Sách</h5>
                                        <button className="btn btn-sm btn-light rounded-pill border" onClick={loadData}>
                                            <RefreshCcw size={16} />
                                        </button>
                                    </div>
                                    <div className="table-responsive" style={{ maxHeight: "500px" }}>
                                        <table className="table fs-6">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="rounded-start">ID</th>
                                                    <th>Tên</th>
                                                    <th className="text-center">Quét</th>
                                                    <th className="text-center rounded-end">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((p) => (
                                                    <tr key={p.uid} style={{ opacity: hiddenList.includes(p.uid) ? 0.5 : 1 }}>
                                                        <td><span className="badge bg-light text-dark border">{p.uid}</span></td>
                                                        <td className="fw-bold small">{p.name}</td>
                                                        <td className="text-center small">{p.scan_count || 0}</td>
                                                        <td className="text-center">
                                                            <button
                                                                className={`btn btn-sm border-0 ${hiddenList.includes(p.uid) ? "text-muted" : "text-primary"}`}
                                                                onClick={() => toggleHide(p.uid)}
                                                                title={hiddenList.includes(p.uid) ? "Hiện" : "Ẩn"}
                                                            >
                                                                {hiddenList.includes(p.uid) ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="glass-panel p-4 rounded-4 animate-in">
                            <h5 className="fw-bold mb-4 text-primary"><Users size={20} className="me-1" /> Quản Lý Người Dùng</h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="rounded-start ps-3">ID</th>
                                            <th>Họ Tên</th>
                                            <th>Đăng Nhập</th>
                                            <th>Email</th>
                                            <th className="rounded-end">Vai Trò</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td className="ps-3 text-muted">#{u._id}</td>
                                                <td className="fw-bold">{u.fullname}</td>
                                                <td>{u.username}</td>
                                                <td>{u.email}</td>
                                                <td><span className="badge bg-success bg-opacity-10 text-success">{u.role}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showHistory && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: 'blur(5px)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="glass-panel modal-content border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-gradient">Lịch Sử Quét QR</h5>
                                <button className="btn-close" onClick={() => setShowHistory(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive" style={{ maxHeight: "60vh" }}>
                                    <table className="table table-striped mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">Thời Gian</th>
                                                <th>Mã SP</th>
                                                <th>Vị Trí</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((h, i) => (
                                                <tr key={i}>
                                                    <td className="ps-4 small">{h.time}</td>
                                                    <td><span className="badge bg-secondary">{h.uid}</span></td>
                                                    <td>{h.location}</td>
                                                </tr>
                                            ))}
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
};

export default AdminDashboard;
