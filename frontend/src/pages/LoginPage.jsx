import React, { useState } from 'react';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const LoginPage = ({ onLogin, onSwitchToRegister, onBack }) => {
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(role, formData);
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
            <div className="glass-panel p-5 rounded-5 w-100 animate-in position-relative" style={{ maxWidth: '500px' }}>
                <button className="btn btn-sm btn-light position-absolute top-0 start-0 m-4 rounded-pill" onClick={onBack}>
                    <ArrowLeft size={16} className="me-1" /> Trở về
                </button>

                <div className="text-center mb-5 mt-3">
                    <h2 className="fw-bold mb-2">Đăng Nhập</h2>
                    <p className="text-muted">Chào mừng bạn quay trở lại MilkFamily</p>

                    <div className="d-flex justify-content-center gap-2 mt-4 p-1 bg-light rounded-pill d-inline-flex border">
                        <button
                            className={`btn rounded-pill px-4 fw-bold ${role === 'user' ? 'btn-white shadow-sm text-primary' : 'text-muted'}`}
                            onClick={() => setRole('user')}
                        >
                            Khách Hàng
                        </button>
                        <button
                            className={`btn rounded-pill px-4 fw-bold ${role === 'admin' ? 'btn-white shadow-sm text-primary' : 'text-muted'}`}
                            onClick={() => setRole('admin')}
                        >
                            Quản Trị
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control border-0 bg-light rounded-4 ps-4"
                            placeholder="Username"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                        <label className="text-muted ps-4">Tên đăng nhập</label>
                        <User size={18} className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control border-0 bg-light rounded-4 ps-4"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <label className="text-muted ps-4">Mật khẩu</label>
                        <Lock size={18} className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                    </div>

                    <button className="btn btn-primary-gradient w-100 py-3 rounded-pill fw-bold fs-6 shadow-md mb-4">
                        ĐĂNG NHẬP <ArrowRight size={18} className="ms-2" />
                    </button>
                </form>

                {role === 'user' && (
                    <div className="text-center">
                        <p className="text-muted mb-0">
                            Chưa có tài khoản?{' '}
                            <button className="btn btn-link text-primary fw-bold text-decoration-none p-0" onClick={onSwitchToRegister}>
                                Đăng ký ngay
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;