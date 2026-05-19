require("dotenv").config();
const admin = require("firebase-admin");
const path = require("path");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error("❌ Lỗi khi parse FIREBASE_SERVICE_ACCOUNT từ Env Variable:", err);
    serviceAccount = {};
  }
} else {
  try {
    serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
  } catch (error) {
    console.error("⚠️ CHƯA TÌM THẤY file serviceAccountKey.json và FIREBASE_SERVICE_ACCOUNT!");
    serviceAccount = {};
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spy-finder-d42a3-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

module.exports = { admin, db };
