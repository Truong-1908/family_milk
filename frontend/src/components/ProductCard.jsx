import React from "react";

export default function ProductCard({ product, onClick }) {
  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div
        className="card h-100 border-0 shadow-sm text-center p-3"
        onClick={onClick}
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "1px solid #f0f0f0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,191,255,0.15)";
          e.currentTarget.style.borderColor = "#00bfff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
          e.currentTarget.style.borderColor = "#f0f0f0";
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center mb-3"
          style={{ height: "140px", overflow: "hidden" }}
        >
          <img
            src={product.product_image}
            alt={product.name}
            className="img-fluid"
            style={{
              maxHeight: "100%",
              objectFit: "contain",
              transition: "transform 0.3s",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://vinamilk.com.vn/static/uploads/2021/05/Sua-tuoi-tiet-trung-Vinamilk-100-tach-beo-khong-duong-1.jpg";
            }}
          />
        </div>

        <div className="card-body p-0 d-flex flex-column">
          <h6
            className="card-title fw-bold text-dark text-truncate mb-2"
            title={product.name}
            style={{ fontSize: "0.95rem" }}
          >
            {product.name}
          </h6>

          <div className="mt-auto">
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 mb-2">
              {product.uid}
            </span>
            <small
              className="d-block text-muted"
              style={{ fontSize: "0.8rem" }}
            >
              Lô: {product.batch_number}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
