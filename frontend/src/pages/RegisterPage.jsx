import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        onRegister(formData);
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
            <div className="glass-panel p-5 rounded-5 w-100 animate-in position-relative" style={{ maxWidth: '500px' }}>
                <button className="btn btn-sm btn-light position-absolute top-0 start-0 m-4 rounded-pill" onClick={onSwitchToLogin}>
                    <ArrowLeft size={16} className="me-1" /> Quay lại
                </button>

                <div className="text-center mb-4 mt-3">
                    <h2 className="fw-bold mb-2">Tạo Tài Khoản</h2>
                    <p className="text-muted">Trở thành thành viên của MilkFamily</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control border-0 bg-light rounded-4 ps-4"
                            placeholder="Fullname"
                            value={formData.fullname}
                            onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                            required
                        />
                        <label className="text-muted ps-4">Họ và tên</label>
                        <User size={18} className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                    </div>

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
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control border-0 bg-light rounded-4 ps-4"
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <label className="text-muted ps-4">Email</label>
                        <Mail size={18} className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                    </div>

                    <div className="form-floating mb-3">
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

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control border-0 bg-light rounded-4 ps-4"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                        <label className="text-muted ps-4">Xác nhận mật khẩu</label>
                    </div>

                    <button className="btn btn-primary-gradient w-100 py-3 rounded-pill fw-bold fs-6 shadow-md mb-4">
                        ĐĂNG KÝ NGAY <ArrowRight size={18} className="ms-2" />
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-muted mb-0">
                        Đã có tài khoản?{' '}
                        <button className="btn btn-link text-primary fw-bold text-decoration-none p-0" onClick={onSwitchToLogin}>
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
