const { db } = require("./firebase");

const AVATARS = {
  "avatar_1": { name: "Mèo Xanh", color: "#4ECDC4", imageUrl: "🐱" },
  "avatar_2": { name: "Cún Cam", color: "#FFB347", imageUrl: "🐶" },
  "avatar_3": { name: "Thỏ Hồng", color: "#FF6B6B", imageUrl: "🐰" },
  "avatar_4": { name: "Gấu Nâu", color: "#A87A51", imageUrl: "🐻" },
  "avatar_5": { name: "Cáo Đỏ", color: "#FF4500", imageUrl: "🦊" },
  "avatar_6": { name: "Hổ Vàng", color: "#FFD700", imageUrl: "🐯" },
  "avatar_7": { name: "Khỉ Tím", color: "#9B59B6", imageUrl: "🐒" },
  "avatar_8": { name: "Ếch Xanh", color: "#2ECC71", imageUrl: "🐸" }
};

const TOPICS = {
  "topic_1": { name: "Đồ Ăn", imageUrl: "🍔", words: ["Phở", "Bánh mì", "Pizza", "Sushi", "Hamburger", "Gà rán", "Kem", "Trà sữa"] },
  "topic_2": { name: "Động Vật", imageUrl: "🦁", words: ["Sư tử", "Cọp", "Voi", "Chó", "Mèo", "Chim", "Cá sấu", "Hươu cao cổ"] },
  "topic_3": { name: "Nghề Nghiệp", imageUrl: "👨‍⚕️", words: ["Bác sĩ", "Kỹ sư", "Giáo viên", "Công an", "Lập trình viên", "Đầu bếp", "Ca sĩ", "Diễn viên"] },
  "topic_4": { name: "Quốc Gia", imageUrl: "🏳️‍🌈", words: ["Việt Nam", "Mỹ", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Pháp", "Anh", "Đức"] },
};

const TICKETS = {
  "ticket_1": { name: "Thẻ Nói Thật", description: "Bạn phải trả lời thật 1 câu hỏi từ người bên phải", imageUrl: "🃏" },
  "ticket_2": { name: "Thẻ Đổi Chiều", description: "Vòng mô tả sẽ quay ngược chiều kim đồng hồ", imageUrl: "🔄" },
  "ticket_3": { name: "Thẻ Cấm Khẩu", description: "Bạn bị cấm nói trong lượt này, chỉ được dùng cử chỉ", imageUrl: "🤐" }
};

async function pushInitialData() {
  try {
    console.log("Đang push Avatar...");
    await db.ref("avatarDatabase").set(AVATARS);
    
    console.log("Đang push Topics...");
    await db.ref("topicDatabase").set(TOPICS);
    
    console.log("Đang push Tickets...");
    await db.ref("ticketDatabase").set(TICKETS);

    console.log("✅ Dữ liệu đã được push thành công lên Firebase!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi push dữ liệu:", error);
    process.exit(1);
  }
}

pushInitialData();
