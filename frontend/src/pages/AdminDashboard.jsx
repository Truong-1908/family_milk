import React, { useState, useEffect } from 'react';
import { Package, Plus, List, LogOut, History, RefreshCcw, Eye, EyeOff, Users, Search, BarChart as BarIcon, PieChart as PieIcon, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('statistics'); // 'products' or 'users'
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
        // data.qr_url = `${window.location.origin}/?uid=${data.uid}`; 

        const res = await api.createProduct(data);
        if (res.status === "success") {
            alert("✅ Thành công!");
            loadData();
            e.target.reset();
        } else alert("❌ Lỗi: " + res.message);
    };

    // --- BATCH MANAGEMENT LOGIC ---
    const getDaysRemaining = (expiryStr) => {
        if (!expiryStr) return 999;
        const expiry = new Date(expiryStr).getTime();
        const now = Date.now();
        return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    };

    const getExpiryStatus = (expiryStr) => {
        const days = getDaysRemaining(expiryStr);
        if (days < 0) return { label: 'Đã hết hạn', color: 'danger', bg: 'danger' };
        if (days <= 30) return { label: 'Sắp hết hạn', color: 'warning', bg: 'warning' };
        return { label: 'An toàn', color: 'success', bg: 'success' };
    };

    const sortedProducts = [...products].sort((a, b) => {
        const daysA = getDaysRemaining(a.expiry_date);
        const daysB = getDaysRemaining(b.expiry_date);
        return daysA - daysB; // Ưu tiên hết hạn lên đầu
    });

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

    // --- CHART DATA PREPARATION ---
    const topProducts = [...products]
        .sort((a, b) => (b.scan_count || 0) - (a.scan_count || 0))
        .slice(0, 5)
        .map(p => ({ name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name, scans: p.scan_count || 0 }));

    const validCount = history.filter(h => !h.status || h.status === 'valid').length;
    const invalidCount = history.filter(h => h.status === 'invalid').length;

    // Nếu chưa load history thì tự load để hiện chart
    useEffect(() => {
        if (activeTab === 'statistics' && history.length === 0) {
            api.getHistory().then(setHistory);
        }
    }, [activeTab]);

    const piData = [
        { name: 'Hợp lệ', value: validCount, color: '#00C49F' },
        { name: 'Cảnh báo (Giả)', value: invalidCount, color: '#FF8042' }
    ];

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
                                className={`btn text-start p-3 rounded-3 fw-bold ${activeTab === 'statistics' ? 'btn-primary text-white shadow' : 'btn-light text-muted'}`}
                                onClick={() => setActiveTab('statistics')}
                            >
                                <BarIcon size={20} className="me-2" /> Thống Kê Tổng Quan
                            </button>
                            <button
                                className={`btn text-start p-3 rounded-3 fw-bold ${activeTab === 'products' ? 'btn-primary text-white shadow' : 'btn-light text-muted'}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <Package size={20} className="me-2" /> Quản Lý Sản Phẩm
                            </button>
                            <button
                                className={`btn text-start p-3 rounded-3 fw-bold ${activeTab === 'batches' ? 'btn-primary text-white shadow' : 'btn-light text-muted'}`}
                                onClick={() => setActiveTab('batches')}
                            >
                                <AlertTriangle size={20} className="me-2" /> Quản Lý Lô Hàng
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
                    {activeTab === 'statistics' && (
                        <div className="glass-panel p-4 rounded-4 animate-in">
                            <h4 className="fw-bold mb-4 text-primary">📊 Thống Kê Hệ Thống</h4>

                            <div className="row g-4 mb-4">
                                <div className="col-md-7">
                                    <div className="bg-white p-3 rounded-3 shadow-sm border h-100">
                                        <h6 className="fw-bold text-center mb-3">Top 5 Sản Phẩm Được Quét</h6>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <BarChart data={topProducts} layout="vertical" margin={{ left: 40 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis dataKey="name" type="category" width={100} fontSize={10} />
                                                    <Tooltip />
                                                    <Bar dataKey="scans" fill="#8884d8" name="Lượt quét" radius={[0, 4, 4, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="bg-white p-3 rounded-3 shadow-sm border h-100">
                                        <h6 className="fw-bold text-center mb-3">Tỷ Lệ Thật / Giả</h6>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={piData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {piData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-muted small">
                                * Dữ liệu được cập nhật theo thời gian thực từ hoạt động quét QR của người dùng.
                            </div>
                        </div>
                    )}
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

                    {activeTab === 'batches' && (
                        <div className="glass-panel p-4 rounded-4 animate-in">
                            <h4 className="fw-bold mb-4 text-primary"><AlertTriangle size={20} className="me-1" /> Quản Lý Lô Hàng & Hạn Sử Dụng</h4>
                            <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning-emphasis d-flex align-items-center">
                                <AlertTriangle className="me-2" />
                                <div>
                                    <strong>Lưu ý:</strong> Các sản phẩm có hạn sử dụng dưới 30 ngày sẽ được cảnh báo màu vàng.
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table fs-6 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="rounded-start">Mã Lô</th>
                                            <th>Sản Phẩm</th>
                                            <th>Hạn Sử Dụng</th>
                                            <th>Còn Lại</th>
                                            <th className="rounded-end text-center">Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedProducts.map((p) => {
                                            const status = getExpiryStatus(p.expiry_date);
                                            const days = getDaysRemaining(p.expiry_date);
                                            return (
                                                <tr key={p.uid} className={days <= 30 ? "bg-warning bg-opacity-10" : ""}>
                                                    <td className="fw-bold font-monospace">{p.batch_number}</td>
                                                    <td>
                                                        <div className="fw-bold text-dark">{p.name}</div>
                                                        <small className="text-muted">{p.uid}</small>
                                                    </td>
                                                    <td>{p.expiry_date}</td>
                                                    <td className="fw-bold">{days} ngày</td>
                                                    <td className="text-center">
                                                        <span className={`badge bg-${status.bg} text-white px-3 py-2 rounded-pill`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
