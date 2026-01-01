const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Đang deploy Smart Contract lên mạng...");

  // 1. Lấy contract factory
  const MilkProduct = await hre.ethers.getContractFactory("MilkProduct");

  // 2. Deploy contract
  const milkProduct = await MilkProduct.deploy();
  await milkProduct.waitForDeployment();

  const contractAddress = await milkProduct.getAddress();
  console.log("✅ Smart Contract đã được deploy tại địa chỉ:", contractAddress);

  // 3. Tự động lưu địa chỉ và ABI sang Backend để dùng luôn
  const artifact = await hre.artifacts.readArtifact("MilkProduct");

  const backendConfig = {
    address: contractAddress,
    abi: artifact.abi,
  };

  // Đường dẫn tới thư mục backend (nơi chứa file abi.json)
  const backendPath = path.join(
    __dirname,
    "../../backend/contract-config.json"
  );

  // Ghi file
  fs.writeFileSync(backendPath, JSON.stringify(backendConfig, null, 2));
  console.log(`🎉 Đã lưu cấu hình Contract vào: ${backendPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
