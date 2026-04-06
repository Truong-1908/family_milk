const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Đường dẫn tới file cấu hình (được tạo ra sau khi deploy contract bằng Hardhat)
// File này chứa địa chỉ contract và ABI
const CONFIG_PATH = path.join(__dirname, "contract-config.json");

let contract = null;
let provider = null;
let signer = null; // Ví Admin dùng để ghi dữ liệu (ký giao dịch)

const initBlockchain = async () => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.log(
        "⚠️ [Blockchain] Chưa thấy file config. Hãy chạy script deploy contract trước."
      );
      // Trả về false hoặc null để biết là chưa kết nối được
      return false;
    }

    // Đọc file config
    const configRaw = fs.readFileSync(CONFIG_PATH, "utf8");
    const config = JSON.parse(configRaw);

    // Kết nối tới Ganache (Mặc định cổng 7545) hoặc Testnet Online thông qua biến môi trường
    const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:7545";
    provider = new ethers.JsonRpcProvider(rpcUrl);

    // Kiểm tra kết nối tới mạng
    const network = await provider.getNetwork();
    console.log(
      `🔗 [Blockchain] Đã kết nối tới mạng Chain ID: ${network.chainId}`
    );

    // Lấy ví đầu tiên trong Ganache để làm Admin (người có quyền tạo sản phẩm)
    // Trong thực tế, bạn sẽ dùng Private Key từ biến môi trường (.env)
    signer = await provider.getSigner();
    const adminAddress = await signer.getAddress();
    console.log(`👤 [Blockchain] Admin Address: ${adminAddress}`);

    // Khởi tạo đối tượng Contract để gọi hàm
    contract = new ethers.Contract(config.address, config.abi, signer);
    console.log(
      `✅ [Blockchain] Đã kết nối Contract tại địa chỉ: ${config.address}`
    );
    return true;
  } catch (error) {
    console.error("❌ [Blockchain] Lỗi kết nối:", error.message);
    console.log("⚠️  Hệ thống sẽ chạy ở chế độ Offline (Chỉ dùng Database).");
    return false;
  }
};

// Hàm ghi thông tin sản phẩm lên Blockchain (Dành cho Admin)
// Hàm này gọi smart contract để lưu trữ hash và thông tin cơ bản
const createOnChain = async (uid, name, batch, expiry) => {
  // Kiểm tra contract đã khởi tạo chưa
  if (!contract) {
    console.log(
      "⚠️ [Blockchain] Contract chưa sẵn sàng, bỏ qua ghi Blockchain."
    );
    return "N/A (Blockchain Offline)";
  }

  try {
    console.log(`⏳ Đang ghi lên Blockchain sản phẩm: ${uid}...`);

    // Gọi hàm createProduct trong Smart Contract
    // Lưu ý: Tên hàm phải khớp chính xác với trong file .sol
    const tx = await contract.createProduct(uid, name, batch, expiry);

    console.log(`Tx sent: ${tx.hash}. Waiting for confirmation...`);

    // Chờ giao dịch được xác nhận (đào xong)
    const receipt = await tx.wait();

    console.log(`🎉 Ghi thành công! Block Number: ${receipt.blockNumber}`);
    return tx.hash;
  } catch (error) {
    console.error("❌ Lỗi ghi Blockchain:", error.message);
    // Có thể trả về lỗi hoặc null tùy logic xử lý
    return "Error";
  }
};

// Hàm đọc và xác thực từ Blockchain (Dành cho User)
// Hàm này gọi smart contract để lấy thông tin xác thực
const verifyOnChain = async (uid) => {
  if (!contract) return null;
  try {
    // Gọi hàm verifyProduct trong Smart Contract
    // Hàm này là view function nên không tốn gas
    const data = await contract.verifyProduct(uid);

    // Dữ liệu trả về từ Solidity là một mảng hoặc object tùy version ethers
    // Với ethers v6, nó trả về Result object giống mảng
    return {
      name: data[0],
      batch_number: data[1],
      expiry_unix: Number(data[2]), // Chuyển BigInt sang Number (nếu expiry là uint256)
      manufacturer: data[3],
      source: "Blockchain",
    };
  } catch (error) {
    // Lỗi thường gặp: Sản phẩm không tồn tại hoặc sai UID, hoặc lỗi mạng
    // console.error("Verify Error:", error.message);
    return null;
  }
};

module.exports = { initBlockchain, createOnChain, verifyOnChain };
