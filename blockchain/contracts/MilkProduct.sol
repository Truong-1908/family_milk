// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MilkProduct {
    // Cấu trúc dữ liệu của một sản phẩm trên Blockchain
    struct Product {
        string uid;          // Mã định danh (VD: MF_001)
        string name;         // Tên sản phẩm
        string batchNumber;  // Số lô sản xuất
        uint256 expiryDate;  // Hạn sử dụng (Unix timestamp)
        address manufacturer; // Địa chỉ ví người tạo (Nhà máy)
        bool exists;         // Cờ đánh dấu tồn tại
    }

    // Lưu trữ danh sách sản phẩm (Key là UID)
    mapping(string => Product) public products;
    
    // Sự kiện được phát ra khi có sản phẩm mới
    event ProductCreated(string uid, string name, address indexed manufacturer);

    // Hàm tạo sản phẩm mới
    function createProduct(
        string memory _uid, 
        string memory _name, 
        string memory _batchNumber, 
        uint256 _expiryDate
    ) public {
        // Kiểm tra xem UID đã tồn tại chưa
        require(!products[_uid].exists, "Product UID already exists");
        
        // Lưu thông tin vào Blockchain
        products[_uid] = Product({
            uid: _uid,
            name: _name,
            batchNumber: _batchNumber,
            expiryDate: _expiryDate,
            manufacturer: msg.sender,
            exists: true
        });

        // Phát sự kiện
        emit ProductCreated(_uid, _name, msg.sender);
    }

    // Hàm xác thực sản phẩm (Backend gọi hàm này để kiểm tra)
    function verifyProduct(string memory _uid) public view returns (
        string memory name, 
        string memory batchNumber, 
        uint256 expiryDate, 
        address manufacturer,
        bool exists
    ) {
        require(products[_uid].exists, "Product not found");
        Product memory p = products[_uid];
        return (p.name, p.batchNumber, p.expiryDate, p.manufacturer, true);
    }
}