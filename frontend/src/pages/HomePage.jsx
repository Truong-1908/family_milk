import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = ({ onStart }) => {
    return (
        <div className="container flex-grow-1 d-flex align-items-center justify-content-center text-center py-5 min-vh-100">
            <div>
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="badge bg-white text-primary px-4 py-2 rounded-pill mb-4 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                >
                    <span className="status-dot bg-success rounded-circle" style={{ width: 8, height: 8 }}></span>
                    Công Nghệ Blockchain 4.0
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="display-2 fw-bold mb-4 text-dark lh-tight"
                    style={{ letterSpacing: "-2px" }}
                >
                    Truy Xuất Nguồn Gốc
                    <br />
                    <span className="text-gradient">Sữa An Toàn Tuyệt Đối</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted fs-5 mb-5 mx-auto"
                    style={{ maxWidth: "650px", lineHeight: "1.8" }}
                >
                    Hệ thống minh bạch hóa quy trình sản xuất từ nông trại đến bàn ăn.
                    Đảm bảo chất lượng và niềm tin cho mọi gia đình Việt.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="d-flex gap-3 justify-content-center flex-wrap"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary-gradient btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center"
                        onClick={onStart}
                    >
                        Tra Cứu Ngay <ArrowRight size={20} className="ms-2" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-white btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm text-primary"
                    >
                        Tìm Hiểu Thêm
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;
