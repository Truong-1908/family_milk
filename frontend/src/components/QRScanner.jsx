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
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
      style={{ zIndex: 2000 }}
    >
      <div
        className="bg-white p-4 rounded-4 position-relative"
        style={{ maxWidth: "500px", width: "90%" }}
      >
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={onClose}
          style={{ zIndex: 10 }}
        ></button>
        <h5 className="mb-3 text-center fw-bold text-primary">Quét Mã QR</h5>

        <div id="reader"></div>
      </div>
    </div>
  );
};

export default QRScanner;
