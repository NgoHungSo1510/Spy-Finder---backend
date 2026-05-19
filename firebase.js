const admin = require("firebase-admin");
const path = require("path");

// Yêu cầu bạn tải file serviceAccountKey.json từ Firebase Console (Project Settings > Service Accounts > Generate new private key)
// và đặt vào thư mục backend/
let serviceAccount;
try {
  serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
} catch (error) {
  console.error("⚠️ CHƯA TÌM THẤY file serviceAccountKey.json!");
  console.error("Vui lòng tải từ Firebase Console và đặt vào thư mục backend/");
  // Tạo 1 object rỗng để không bị crash khi compile, nhưng khi dùng sẽ báo lỗi.
  serviceAccount = {};
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spy-finder-d42a3-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

module.exports = { admin, db };
