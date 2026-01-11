// frontend/src/components/UpdateExcel.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { api } from "../services/api";

const UpdateExcel = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  const processData = async (excelData) => {
    if (!window.confirm(`Bạn có chắc muốn nhập ${excelData.length} sản phẩm?`))
      return;

    setLoading(true);
    try {
      // Map dữ liệu Excel sang format Backend cần
      const formattedData = excelData.map((item) => ({
        uid: item["Mã sản phẩm"] || item.uid,
        name: item["Tên sản phẩm"] || item.name,
        category: item["Danh mục"] || item.category,
        batch_number: item["Số lô"] || item.batch_number,
        expiry_date_unix: convertDateToUnix(item["Hạn sử dụng"]),
        product_image: item["Link ảnh"] || "",
        description: item["Mô tả"] || "",
      }));

      // Gọi API
      const res = await api.createProductsBulk(formattedData);

      if (res.status === "success") {
        alert(`✅ Đã nhập thành công!`);
        if (onSuccess) onSuccess(); // Load lại dữ liệu ở trang cha
        setFileName(""); // Reset
      } else {
        alert("❌ Lỗi: " + (res.message || "Không xác định"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("❌ Có lỗi xảy ra khi xử lý file!");
    } finally {
      setLoading(false);
    }
  };

  const convertDateToUnix = (excelDate) => {
    if (!excelDate) return Math.floor(Date.now() / 1000);

    // Trường hợp Excel trả về số serial (VD: 45280)
    if (typeof excelDate === "number") {
      const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
      return Math.floor(date.getTime() / 1000);
    }

    // Trường hợp chuỗi DD/MM/YYYY
    if (typeof excelDate === "string") {
      const parts = excelDate.split("/");
      if (parts.length === 3) {
        const date = new Date(parts[2], parts[1] - 1, parts[0]);
        return Math.floor(date.getTime() / 1000);
      }
    }
    return Math.floor(Date.now() / 1000);
  };

  return (
    <div className="border border-dashed border-2 rounded-4 p-4 text-center bg-light mb-4">
      <div className="mb-3">
        <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle d-inline-block mb-2">
          <FileSpreadsheet size={32} />
        </div>
        <h5 className="fw-bold text-success">Nhập Hàng Từ Excel</h5>
        <p className="text-muted small mb-0">Hỗ trợ file .xlsx, .xls</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center text-success gap-2">
          <Loader className="animate-spin" /> Đang xử lý Blockchain...
        </div>
      ) : (
        <div className="position-relative d-inline-block">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
            style={{ cursor: "pointer" }}
            key={fileName || "reset"}
          />
          <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm">
            <Upload size={18} className="me-2" />
            {fileName ? "Đã chọn: " + fileName : "Chọn File Excel"}
          </button>
        </div>
      )}

      <div className="mt-3 text-muted small fst-italic">
        * File cần có các cột: Mã sản phẩm, Tên sản phẩm, Số lô, Hạn sử dụng...
      </div>
    </div>
  );
};

export default UpdateExcel;
