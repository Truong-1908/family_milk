import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Dọn dẹp thẻ div trước khi khởi tạo để tránh lỗi trùng lặp
    const container = document.getElementById("reader");
    if (container) container.innerHTML = "";

    // Khởi tạo Scanner có Giao diện (để bạn chọn được Camera)
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.0,
        rememberLastUsedCamera: true, // Nhớ camera lần cuối đã chọn
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (txt) => {
        // Khi quét thành công -> Tắt cam -> Trả kết quả
        scanner.clear().catch(console.error);
        const uid = txt.includes("uid=") ? txt.split("uid=")[1] : txt;
        onScan(uid);
      },
      (err) => {
        // Bỏ qua lỗi trong quá trình quét
      }
    );

    // Cleanup: Tắt camera khi đóng popup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Lỗi dọn dẹp camera: ", error);
        });
      }
    };
  }, []);

  return (
    <div
      // [ĐÃ SỬA]: align-items-start (đẩy lên đầu), pt-5 (tạo khoảng cách với mép trên)
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-start justify-content-center pt-5"
      style={{
        zIndex: 9999, // Đảm bảo nổi lên trên cùng mọi thứ
        backdropFilter: "blur(5px)", // Làm mờ nền phía sau cho đẹp
      }}
    >
      <div
        // [ĐÃ SỬA]: Thêm mt-4 để cách lề trên thêm một chút cho thoáng
        className="bg-white p-4 rounded-4 position-relative mt-4 shadow-lg"
        style={{ maxWidth: "500px", width: "90%" }}
      >
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={onClose}
          style={{ zIndex: 10 }}
        ></button>
        <h5 className="mb-3 text-center fw-bold text-primary">Quét Mã QR</h5>

        <div id="reader"></div>

        <div className="text-center mt-2 small text-muted">
          Đặt mã QR vào khung hình để quét
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
