const { db } = require("./firebase");

const AVATARS = {
  "avatar_1": { name: "Mèo Xanh", color: "#4ECDC4", imageUrl: "🐱" },
  "avatar_2": { name: "Cún Cam", color: "#FFB347", imageUrl: "🐶" },
  "avatar_3": { name: "Thỏ Hồng", color: "#FF6B6B", imageUrl: "🐰" },
  "avatar_4": { name: "Gấu Nâu", color: "#A87A51", imageUrl: "🐻" },
  "avatar_5": { name: "Cáo Đỏ", color: "#FF4500", imageUrl: "🦊" },
  "avatar_6": { name: "Hổ Vàng", color: "#FFD700", imageUrl: "🐯" },
  "avatar_7": { name: "Khỉ Tím", color: "#9B59B6", imageUrl: "🐒" },
  "avatar_8": { name: "Ếch Xanh", color: "#2ECC71", imageUrl: "🐸" },
  "avatar_9": { name: "Người Máy Bạc", color: "#BDC3C7", imageUrl: "🤖" },
  "avatar_10": { name: "Alien Độc Lạ", color: "#34495E", imageUrl: "👽" },
  "avatar_11": { name: "Phù Thủy Tím", color: "#8E44AD", imageUrl: "🧙" },
  "avatar_12": { name: "Siêu Nhân Đỏ", color: "#E74C3C", imageUrl: "🦸" },
  "avatar_13": { name: "Bóng Ma Vui Vẻ", color: "#ECF0F1", imageUrl: "👻" },
  "avatar_14": { name: "Nấm Lùn Ka-wa-ii", color: "#E67E22", imageUrl: "🍄" },
  "avatar_15": { name: "Sushi Bé Nhỏ", color: "#FF7675", imageUrl: "🍣" },
  "avatar_16": { name: "Cà Phê Tỉnh Táo", color: "#6F4E37", imageUrl: "☕" },
  "avatar_17": { name: "Sao Vàng Lấp Lánh", color: "#F1C40F", imageUrl: "⭐" },
  "avatar_18": { name: "Xương Rồng Gai", color: "#27AE60", imageUrl: "🌵" },
  "avatar_19": { name: "Cục Đá Suy Tư", color: "#95A5A6", imageUrl: "🗿" },
  "avatar_20": { name: "Phượng Hoàng Lửa", color: "#FF7F50", imageUrl: "🔥" }
};

const TOPICS = {
  "topic_1": {
    name: "Đồ Ăn",
    imageUrl: "🍔",
    words: ["Phở", "Bánh mì", "Pizza", "Sushi", "Hamburger", "Gà rán", "Mì Ý", "Lẩu", "Đồ nướng", "Cơm tấm", "Bún chả", "Gỏi cuốn", "Cháo gà", "Súp", "Bánh bao", "Xôi", "Salad", "Khoai tây chiên"]
  },
  "topic_2": {
    name: "Động Vật",
    imageUrl: "🦁",
    words: ["Sư tử", "Cọp", "Voi", "Chó", "Mèo", "Chim", "Cá sấu", "Hươu cao cổ", "Gấu", "Khỉ", "Thỏ", "Ngựa", "Cừu", "Heo", "Chuột", "Cá heo", "Sói", "Cáo", "Rắn", "Rùa"]
  },
  "topic_3": {
    name: "Nghề Nghiệp",
    imageUrl: "👨‍⚕️",
    words: ["Bác sĩ", "Kỹ sư", "Giáo viên", "Công an", "Lập trình viên", "Đầu bếp", "Ca sĩ", "Diễn viên", "Luật sư", "Kiến trúc sư", "Họa sĩ", "Nhà văn", "Phi công", "Kế toán", "Bác sĩ thú y", "Nhà báo", "Người mẫu", "Dược sĩ", "Nha sĩ", "Thợ may"]
  },
  "topic_4": {
    name: "Quốc Gia",
    imageUrl: "🏳️‍🌈",
    words: ["Việt Nam", "Mỹ", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Pháp", "Anh", "Đức", "Nga", "Ý", "Tây Ban Nha", "Úc", "Canada", "Thái Lan", "Singapore", "Malaysia", "Ấn Độ", "Brazil", "Ai Cập", "Hà Lan"]
  },
  "topic_5": { name: "Đồ Uống", imageUrl: "🥤", words: ["Cà phê", "Trà sữa", "Nước ép", "Sinh tố", "Bia", "Rượu", "Coca Cola", "Pepsi", "Nước khoáng", "Sữa tươi", "Yogurt", "Trà xanh", "Nước dừa", "Nước mía", "Soda", "Champagne", "Sữa đậu nành", "Milo", "Nước tăng lực", "Cacao"] },
  "topic_6": { name: "Trái Cây", imageUrl: "🍎", words: ["Táo", "Chuối", "Cam", "Xoài", "Dưa hấu", "Sầu riêng", "Mít", "Chôm chôm", "Măng cụt", "Nhãn", "Vải", "Ổi", "Bưởi", "Dâu tây", "Nho", "Đu đủ", "Bơ", "Khế", "Chanh", "Dứa"] },
  "topic_7": { name: "Thiết Bị Điện Tử", imageUrl: "📱", words: ["Điện thoại", "Máy tính bảng", "Laptop", "Tivi", "Tủ lạnh", "Máy giặt", "Điều hòa", "Loa", "Tai nghe", "Chuột", "Bàn phím", "Sạc dự phòng", "Máy ảnh", "Đồng hồ thông minh", "Quạt điện", "Lò vi sóng", "Nồi cơm điện", "Máy hút bụi", "Máy sấy tóc", "Bếp từ"] },
  "topic_8": { name: "Phương Tiện Giao Thông", imageUrl: "🚗", words: ["Ô tô", "Xe máy", "Xe đạp", "Tàu hỏa", "Máy bay", "Tàu thủy", "Xe buýt", "Xe taxi", "Xích lô", "Xe cần cẩu", "Xe cứu thương", "Xe cảnh sát", "Tàu ngầm", "Khinh khí cầu", "Xe điện", "Xe tải", "Du thuyền", "Cano", "Xe rác", "Tàu điện ngầm"] },
  "topic_9": { name: "Thời Trang & Trang Phục", imageUrl: "👕", words: ["Áo thun", "Áo sơ mi", "Quần jean", "Quần short", "Váy dài", "Đầm ngắn", "Áo khoác", "Áo len", "Áo vest", "Đồ lót", "Đồ bơi", "Áo dài", "Quần tây", "Áo hoodie", "Áo gió", "Áo len cổ lọ", "Chân váy", "Quần baggy", "Quần jogger", "Bộ pijama"] },
  "topic_10": { name: "Thể Thao", imageUrl: "⚽", words: ["Bóng đá", "Bóng rổ", "Cầu lông", "Bóng bàn", "Tennis", "Bóng chuyền", "Bơi lội", "Chạy bộ", "Bắn cung", "Đấu kiếm", "Cử tạ", "Boxing", "Bóng bầu dục", "Bóng chày", "Golf", "Trượt băng", "Leo núi", "Đạp xe", "Võ thuật", "Nhảy cao"] },
  "topic_11": { name: "Nhạc Cụ", imageUrl: "🎸", words: ["Đàn guitar", "Đàn piano", "Đàn organ", "Đàn violin", "Trống", "Sáo", "Kèn trumpet", "Kèn saxophone", "Đàn ukulele", "Đàn tranh", "Đàn bầu", "Trống lắc", "Đàn cello", "Đàn harp", "Accordion", "Kèn harmonica", "Sáo trúc", "Đàn tì bà", "Cồng chiêng", "Xập xèng"] },
  "topic_12": { name: "Đồ Dùng Học Tập", imageUrl: "✏️", words: ["Bút bi", "Bút chì", "Gôm tẩy", "Thước kẻ", "Vở bài tập", "Sách giáo khoa", "Hộp bút", "Cặp sách", "Bút màu", "Bút dạ quang", "Giấy kiểm tra", "Máy tính bỏ túi", "Keo dán", "Kéo thủ công", "Băng dính", "La bàn", "Bản đồ", "Bảng con", "Phấn viết", "Giấy note"] },
  "topic_13": { name: "Đồ Dùng Nhà Bếp", imageUrl: "🍳", words: ["Chảo chống dính", "Xoong nồi", "Dao thái", "Thớt gỗ", "Chén bát", "Đũa", "Muỗng", "Nĩa", "Vá múc canh", "Rổ nhựa", "Kéo bếp", "Ấm đun nước", "Hộp đựng thức ăn", "Găng tay lò nướng", "Tạp dề", "Chày cối", "Đồ khui bia", "Cây đánh trứng", "Bếp ga", "Bình giữ nhiệt"] },
  "topic_14": { name: "Đồ Gia Dụng", imageUrl: "🧺", words: ["Bàn ủi", "Cây lau nhà", "Chổi quét nhà", "Thùng rác", "Móc phơi đồ", "Kẹp phơi quần áo", "Thảm chùi chân", "Nước lau sàn", "Bột giặt", "Nước xả vải", "Khăn lau tay", "Rèm cửa", "Ổ cắm điện", "Bóng đèn", "Đèn pin", "Đèn ngủ", "Đồng hồ treo tường", "Bình hoa", "Gương soi", "Tranh treo tường"] },
  "topic_15": { name: "Thú Cưng & Gia Súc", imageUrl: "🐶", words: ["Chó", "Mèo", "Chuột hamster", "Thỏ", "Sóc", "Chim yến phụng", "Cá vàng", "Rùa", "Gà", "Vịt", "Ngan", "Ngỗng", "Heo", "Bò", "Trâu", "Dê", "Cừu", "Ngựa", "Lừa", "Bồ câu"] },
  "topic_16": { name: "Sinh Vật Biển", imageUrl: "🐙", words: ["Cá mập", "Cá voi", "Cá heo", "Mực ống", "Bạch tuộc", "Tôm hùm", "Cua biển", "Ghẹ", "Nghêu", "Sò huyết", "Ốc hương", "Sao biển", "Sứa", "Hải quỳ", "Rùa biển", "Cá ngựa", "Cá ngừ", "Cá hồi", "Cá đuối", "Hải sâm"] },
  "topic_17": { name: "Côn Trùng", imageUrl: "🐜", words: ["Kiến", "Gián", "Muỗi", "Ruồi", "Ong", "Bướm", "Chuồn chuồn", "Bọ cánh cứng", "Bọ ngựa", "Châu chấu", "Dế mèn", "Sâu róm", "Đom đóm", "Ve sầu", "Bọ rùa", "Bọ hung", "Rết", "Nhện", "Bọ cạp", "Mối"] },
  "topic_18": { name: "Các Loài Hoa", imageUrl: "🌸", words: ["Hoa hồng", "Hoa cúc", "Hoa lan", "Hoa ly", "Hoa hướng dương", "Hoa mười giờ", "Hoa mai", "Hoa đào", "Hoa sen", "Hoa súng", "Hoa cẩm tú cầu", "Hoa oải hương", "Hoa tulip", "Hoa nhài", "Hoa vạn thọ", "Hoa đồng tiền", "Hoa bồ công anh", "Hoa giấy", "Hoa quỳnh", "Hoa phượng"] },
  "topic_19": { name: "Các Phòng Trong Nhà", imageUrl: "🚪", words: ["Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm", "Phòng vệ sinh", "Phòng thờ", "Phòng làm việc", "Phòng đọc sách", "Ban công", "Sân thượng", "Sân trước", "Gara ô tô", "Nhà kho", "Phòng giặt đồ", "Cầu thang", "Hành lang", "Phòng ăn", "Tầng hầm", "Gác mái", "Hiên nhà"] },
  "topic_20": { name: "Nội Thất", imageUrl: "🪑", words: ["Sofa", "Bàn trà", "Tủ quần áo", "Giường ngủ", "Bàn trang điểm", "Kệ sách", "Kệ tivi", "Bàn ăn", "Ghế làm việc", "Ghế lười", "Tủ giày", "Tủ bếp", "Đệm lò xo", "Gối ôm", "Chăn bông", "Màn khung", "Tủ đầu giường", "Giá treo đồ", "Quầy bar", "Ghế bành"] },
  "topic_21": { name: "Địa Điểm Công Cộng", imageUrl: "🏢", words: ["Công viên", "Siêu thị", "Trường học", "Bệnh viện", "Chợ", "Nhà sách", "Rạp chiếu phim", "Nhà ga", "Sân bay", "Bến xe", "Bưu điện", "Ngân hàng", "Nhà thờ", "Chùa", "Bảo tàng", "Thư viện", "Sân vận động", "Hồ bơi", "Quán cà phê", "Nhà hàng"] },
  "topic_22": { name: "Các Loại Rau Củ", imageUrl: "🥦", words: ["Rau muống", "Rau cải", "Bắp cải", "Súp lơ", "Cà rốt", "Khoai tây", "Khoai lang", "Cà chua", "Dưa leo", "Bí đao", "Bí đỏ", "Khổ qua", "Mướp", "Bầu", "Cà tím", "Đậu cô ve", "Hành tây", "Tỏi", "Gừng", "Ớt"] },
  "topic_23": { name: "Món Ăn Việt Nam", imageUrl: "🍲", words: ["Phở bò", "Bánh mì", "Cơm tấm", "Bún chả", "Bún bò Huế", "Bánh xèo", "Gỏi cuốn", "Chả giò", "Cơm chiên", "Canh chua", "Cá kho tộ", "Thịt kho hột vịt", "Bánh cuốn", "Bún riêu", "Hủ tiếu", "Bánh canh", "Bánh tét", "Bánh chưng", "Mì Quảng", "Nộm hoa chuối"] },
  "topic_24": { name: "Đồ Ăn Vặt", imageUrl: "🍿", words: ["Bánh tráng trộn", "Cá viên chiên", "Khoai tây chiên", "Bắp xào", "Nem chua rán", "Phô mai que", "Khô bò", "Khô gà", "Cơm cháy chà bông", "Bánh tráng nướng", "Ốc luộc", "Chân gà sả tắc", "Trứng vịt lộn", "Bắp rang bơ", "Hạt hướng dương", "Hạt điều", "Đậu phộng tỏi ớt", "Khoai lang kén", "Tokbokki", "Xúc xích nướng"] },
  "topic_25": { name: "Bánh Kẹo & Đồ Ngọc", imageUrl: "🍬", words: ["Kẹo mút", "Kẹo cao su", "Kẹo dẻo", "Socola", "Bánh quy", "Bánh bông lan", "Bánh ngọt", "Bánh ống quế", "Bánh ChocoPie", "Pudding", "Thạch rau câu", "Kem cây", "Kem ly", "Bánh donut", "Bánh tart trứng", "Bánh trung thu", "Kẹo bông gòn", "Bánh crepe", "Bánh muffin", "Kẹo dừa"] },
  "topic_26": { name: "Gia Vị", imageUrl: "🧂", words: ["Muối", "Đường", "Bột ngọt", "Hạt nêm", "Nước mắm", "Nước tương", "Tương ớt", "Tương cà", "Dầu hào", "Giấm", "Tiêu", "Ngũ vị hương", "Mật ong", "Mắm tôm", "Sa tế", "Dầu ăn", "Mì chính", "Bột nghệ", "Bột quế", "Mù tạt"] },
  "topic_27": { name: "Thời Tiết & Hiện Tượng", imageUrl: "☀️", words: ["Nắng", "Mưa", "Gió", "Mây", "Sương mù", "Bão", "Sấm sét", "Tuyết", "Cầu vồng", "Lốc xoáy", "Hạn hán", "Lũ lụt", "Sóng thần", "Động đất", "Băng giá", "Nắng gắt", "Mưa phùn", "Mưa rào", "Áp thấp nhiệt đới", "Triều cường"] },
  "topic_28": { name: "Bộ Phận Cơ Thể", imageUrl: "💪", words: ["Đầu", "Tóc", "Mắt", "Mũi", "Miệng", "Tai", "Cổ", "Vai", "Tay", "Chân", "Ngực", "Bụng", "Lưng", "Ngón tay", "Ngón chân", "Đầu gối", "Khuỷu tay", "Răng", "Lưỡi", "Lông mày"] },
  "topic_29": { name: "Cảm Xúc & Tâm Trạng", imageUrl: "🎭", words: ["Vui vẻ", "Buồn bã", "Tức giận", "Lo lắng", "Sợ hãi", "Hạnh phúc", "Ngạc nhiên", "Hồi hộp", "Chán nản", "Tuyệt vọng", "Ghen tị", "Xấu hổ", "Tự hào", "Bình yên", "Căng thẳng", "Hào hứng", "Tiếc nuối", "Cô đơn", "Thất vọng", "Áy náy"] },
  "topic_30": { name: "Trò Chơi", imageUrl: "🎮", words: ["Ma sói", "Uno", "Mèo nổ", "Cờ vua", "Cờ tướng", "Cờ tỷ phú", "Liên Quân", "PUBG", "Minecraft", "Đá banh", "Trốn tìm", "Oẳn tù tì", "Kéo co", "Nhảy dây", "Bắn bi", "Rồng rắn lên mây", "Ô ăn quan", "Lego", "Đua xe", "Xếp hình"] },
  "topic_31": { name: "Sở Thích & Giải Trí", imageUrl: "🎨", words: ["Vẽ tranh", "Nghe nhạc", "Đọc sách", "Xem phim", "Chụp ảnh", "Nấu ăn", "Làm bánh", "Trồng cây", "Nuôi cá", "Đi phượt", "Du lịch", "Shopping", "Chơi game", "Hát karaoke", "Nhảy múa", "Tập gym", "Yoga", "Thêu thùa", "Sưu tầm tem", "Lướt web"] },
  "topic_32": { name: "Phim Ảnh & Truyền Hình", imageUrl: "🎬", words: ["Phim hành động", "Phim kinh dị", "Phim hài", "Phim tình cảm", "Phim hoạt hình", "Phim viễn tưởng", "Phim cổ trang", "Phim tài liệu", "Phim trinh thám", "Phim kiếm hiệp", "Phim truyền hình", "Show thực tế", "Tin tức", "Phim ma", "Phim võ thuật", "Phim siêu anh hùng", "Phim thanh xuân", "Phim gia đình", "Sitcom", "Phim ca nhạc"] },
  "topic_33": { name: "Truyện Tranh & Hoạt Hình", imageUrl: "🧸", words: ["Doraemon", "Conan", "Naruto", "One Piece", "Dragon Ball", "Shin cậu bé bút chì", "Trạng Tí", "Chuột Mickey", "Vịt Donald", "Tom và Jerry", "Pokémon", "Sailor Moon", "Elsa", "Spiderman", "Batman", "Iron Man", "Shrek", "Minions", "Ben 10", "Scooby Doo"] },
  "topic_34": { name: "Đồ Chơi Trẻ Em", imageUrl: "🪀", words: ["Búp bê", "Xe ô tô đồ chơi", "Siêu nhân", "Lego", "Gấu bông", "Chong chóng", "Thả diều", "Đất nặn", "Nhà banh", "Bập bênh", "Xích đu", "Slime", "Cờ cá ngựa", "Con quay", "Súng nước", "Bóng bay", "Xếp hình gỗ", "Trống lắc", "Thẻ bài", "Mô hình lắp ráp"] },
  "topic_35": { name: "Mỹ Phẩm & Làm Đẹp", imageUrl: "💄", words: ["Son môi", "Kem nền", "Phấn phủ", "Mascara", "Kẻ mắt", "Chì kẻ mày", "Má hồng", "Kem chống nắng", "Nước hoa", "Sữa rửa mặt", "Toner", "Serum", "Kem dưỡng da", "Mặt nạ", "Tẩy trang", "Xịt khoáng", "Kem che khuyết điểm", "Sơn móng tay", "Kem dưỡng thể", "Tẩy tế bào chết"] },
  "topic_36": { name: "Nghề Nghiệp Mở Rộng", imageUrl: "👷", words: ["Nông dân", "Ngư dân", "Tài xế", "Phi công", "Tiếp viên hàng không", "Họa sĩ", "Nhà văn", "Nhà báo", "Kiến trúc sư", "Luật sư", "Thợ cắt tóc", "Thợ may", "Thợ sửa xe", "Bảo vệ", "Lao công", "Nhân viên bán hàng", "Kế toán", "Giám đốc", "Thợ điện", "Nhiếp ảnh gia"] },
  "topic_37": { name: "Các Ngày Lễ Tết", imageUrl: "🎆", words: ["Tết Nguyên Đán", "Tết Trung Thu", "Giáng Sinh", "Halloween", "Lễ Tình Nhân", "Quốc tế Phụ nữ", "Ngày Nhà giáo", "Quốc khánh", "Giỗ Tổ Hùng Vương", "Cá tháng Tư", "Tết Dương Lịch", "Ngày của Mẹ", "Ngày của Cha", "Quốc tế Thiếu nhi", "Tết Đoan Ngọ", "Tết Thanh Minh", "Lễ Vu Lan", "Ngày Thầy thuốc", "Ngày Báo chí", "Lễ Phục Sinh"] },
  "topic_38": { name: "Vũ Trụ & Thiên Văn", imageUrl: "🚀", words: ["Mặt trời", "Mặt trăng", "Trái đất", "Sao Hỏa", "Sao Kim", "Sao Mộc", "Sao Thổ", "Sao Thủy", "Sao Hải Vương", "Sao Thiên Vương", "Tên lửa", "Phi thuyền", "Hố đen", "Thiên thạch", "Sao chổi", "Dải Ngân Hà", "Vệ tinh nhân tạo", "Trạm vũ trụ", "Kính thiên văn", "Chòm sao"] },
  "topic_39": { name: "Địa Hình & Thiên Nhiên", imageUrl: "🏔️", words: ["Núi", "Đồi", "Thung lũng", "Sông", "Suối", "Biển", "Đại dương", "Hồ", "Thác nước", "Hang động", "Sa mạc", "Rừng rậm", "Đảo", "Bán đảo", "Vịnh", "Cao nguyên", "Đồng bằng", "Đầm lầy", "Bờ biển", "Ghềnh đá"] },
  "topic_40": { name: "Vật Liệu Xây Dựng", imageUrl: "🧱", words: ["Xi măng", "Gạch ống", "Cát", "Đá xây dựng", "Sắt thép", "Bê tông", "Gỗ", "Kính", "Thạch cao", "Sơn tường", "Ngói", "Tôn lợp nhà", "Ống nước nhựa", "Dây điện", "Gạch men", "Đá hoa cương", "Silicone", "Nhôm", "Đinh vít", "Lưới thép"] },
  "topic_41": { name: "Dụng Cụ Sửa Chữa", imageUrl: "🛠️", words: ["Búa", "Tua vít", "Kìm", "Cờ lê", "Mỏ lết", "Khoan máy", "Cưa tay", "Thước cuộn", "Băng keo điện", "Dao rọc giấy", "Kéo cắt sắt", "Thang nhôm", "Ống điếu", "Ốc vít", "Đinh", "Đèn thử điện", "Kính bảo hộ", "Hộp đựng đồ nghề", "Mỏ hàn", "Giấy nhám"] },
  "topic_42": { name: "Thể Loại Âm Nhạc", imageUrl: "🎵", words: ["Nhạc Pop", "Nhạc Rock", "Nhạc Rap", "Nhạc Jazz", "Nhạc Classical", "Nhạc EDM", "Nhạc Hip Hop", "Nhạc Bolero", "Nhạc Trữ tình", "Nhạc Cải lương", "Nhạc Đờn ca tài tử", "Nhạc Rock n Roll", "Nhạc Reggae", "Nhạc Indie", "Nhạc Acoustic", "Nhạc Remix", "Nhạc Thiếu nhi", "Nhạc Cách mạng", "Nhạc Dân ca", "Nhạc Funk"] },
  "topic_43": { name: "Đồ Dùng Phòng Tắm", imageUrl: "🧼", words: ["Bàn chải đánh răng", "Kem đánh răng", "Xà phòng", "Sữa tắm", "Dầu gội", "Dầu xả", "Khăn tắm", "Khăn lau mặt", "Gương phòng tắm", "Bồn cầu", "Bồn rửa mặt", "Vòi hoa sen", "Bồn tắm", "Thảm nhà tắm", "Giấy vệ sinh", "Dao cạo râu", "Lược chải tóc", "Nước súc miệng", "Kệ đựng đồ", "Dép đi trong nhà"] },
  "topic_44": { name: "Các Loại Hạt Dinh Dưỡng", imageUrl: "🥜", words: ["Hạt điều", "Hạt đậu phộng", "Hạt hạnh nhân", "Hạt óc chó", "Hạt dẻ", "Hạt hướng dương", "Hạt bí", "Hạt dưa", "Hạt macca", "Hạt chia", "Hạt sen", "Hạt mè", "Hạt đậu xanh", "Hạt đậu nành", "Hạt đậu đỏ", "Hạt đậu đen", "Hạt bắp", "Hạt dẻ cười", "Hạt thông", "Hạt lanh"] },
  "topic_45": { name: "Sách Báo & Văn Học", imageUrl: "📖", words: ["Tiểu thuyết", "Truyện ngắn", "Thơ", "Tạp chí", "Báo giấy", "Sách kỹ năng", "Sách kinh doanh", "Sách giáo khoa", "Từ điển", "Sách ngoại ngữ", "Truyện trinh thám", "Truyện kinh dị", "Sách lịch sử", "Truyện ngụ ngôn", "Truyện cổ tích", "Sách hạt giống tâm hồn", "Báo điện tử", "Sách nói", "Truyện cười", "Ký sự"] },
  "topic_46": { name: "Vật Dụng Cá Nhân", imageUrl: "🎒", words: ["Ví tiền", "Điện thoại", "Chìa khóa", "Balo", "Đồng hồ đeo tay", "Kính mát", "Khẩu trang", "Khăn giấy", "Dù che mưa", "Bình nước", "Tai nghe", "Lược", "Son dưỡng", "Cắt móng tay", "Bật lửa", "Sổ tay", "Bút viết", "Thẻ ngân hàng", "Căn cước công dân", "Kính cận"] },
  "topic_47": { name: "Quốc Gia Mở Rộng", imageUrl: "🗺️", words: ["Thái Lan", "Singapore", "Malaysia", "Indonesia", "Philippines", "Ấn Độ", "Úc", "Canada", "Nga", "Ý", "Tây Ban Nha", "Bồ Đào Nha", "Brazil", "Argentina", "Ai Cập", "Nam Phi", "Thụy Sĩ", "Hà Lan", "New Zealand", "Thụy Điển"] },
  "topic_48": { name: "Thành Phố Lớn", imageUrl: "🏙️", words: ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Tokyo", "Seoul", "Bắc Kinh", "New York", "London", "Paris", "Bangkok", "Singapore", "Sydney", "Moscow", "Berlin", "Rome", "Washington DC", "Los Angeles", "Hong Kong"] },
  "topic_49": { name: "Kỳ Quan & Địa Danh", imageUrl: "🗽", words: ["Vịnh Hạ Long", "Phong Nha Kẻ Bàng", "Cố đô Huế", "Phố cổ Hội An", "Tháp Eiffel", "Vạn Lý Trường Thành", "Kim Tự Tháp", "Tượng Nữ Thần Tự Do", "Đấu trường La Mã", "Núi Phú Sĩ", "Tháp nghiêng Pisa", "Nhà hát Sydney", "Thác Niagara", "Grand Canyon", "Đền Taj Mahal", "Bích họa Angkor Wat", "Núi Fansipan", "Hồ Hoàn Kiếm", "Dinh Độc Lập", "Địa đạo Củ Chi"] },
  "topic_50": { name: "Loài Chim", imageUrl: "🦅", words: ["Đại bàng", "Chim sẻ", "Chim bồ câu", "Chim cú mèo", "Chim vẹt", "Chim gõ kiến", "Chim công", "Chim phượng hoàng", "Chim thiên nga", "Chim hải âu", "Chim đà điểu", "Chim cánh cụt", "Chim yến", "Chim hút mật", "Chim bói cá", "Chim hoàng yến", "Chim họa mi", "Chim khướu", "Chim quạ", "Chim ưng"] },
  "topic_51": { name: "Loại Bánh Tráng Miệng & Ăn Sáng", imageUrl: "🥐", words: ["Bánh mì", "Bánh bao", "Bánh giò", "Bánh chưng", "Bánh tét", "Bánh xèo", "Bánh cuốn", "Bánh khọt", "Bánh bèo", "Bánh bông lan", "Bánh quy", "Bánh Trung Thu", "Bánh su kem", "Bánh crepe", "Bánh gối", "Bánh rán", "Bánh đúc", "Bánh đa", "Bánh tráng", "Bánh tiêu"] },
  "topic_52": { name: "Các Môn Học", imageUrl: "📚", words: ["Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "Tin học", "Giáo dục công dân", "Thể dục", "Âm nhạc", "Mỹ thuật", "Công nghệ", "Giáo dục quốc phòng", "Kinh tế pháp luật", "Triết học", "Ngoại ngữ hai", "Khoa học tự nhiên", "Kỹ năng sống"] },
  "topic_53": { name: "Việc Nhà Hàng Ngày", imageUrl: "🧹", words: ["Quét nhà", "Lau nhà", "Rửa chén", "Nấu cơm", "Giặt quần áo", "Phơi đồ", "Gấp quần áo", "Ủi đồ", "Đổ rác", "Lau bụi", "Dọn phòng ngủ", "Tưới cây", "Đi chợ", "Lau kính", "Cọ rửa bồn cầu", "Chăm sóc thú cưng", "Dọn tủ lạnh", "Thay ga giường", "Lau bếp", "Quét mạng nhện"] },
  "topic_54": { name: "Kim Loại & Đá Quý", imageUrl: "💎", words: ["Vàng", "Bạc", "Đồng", "Sắt", "Nhôm", "Kẽm", "Chì", "Inox", "Kim cương", "Hồng ngọc", "Ngọc bích", "Thạch anh", "Ngọc trai", "Phỉ thúy", "Mã não", "Thủy tinh", "Titan", "Platin", "Đá sapphire", "Đá lục bảo"] }

};

const TICKETS = {
  "ticket_1": {
    name: "Thẻ Tàng Hình",
    description: "Bạn được bỏ qua lượt mô tả này (giúp Gián điệp giấu bài hoặc Dân tránh bị nghi ngờ)",
    imageUrl: "🫥"
  },
  "ticket_2": {
    name: "Thẻ Ép Cung",
    description: "Bắt người chơi tiếp theo phải đưa ra hẳn 2 thông tin mô tả trong lượt của họ",
    imageUrl: "🧐"
  },
  "ticket_3": {
    name: "Thẻ Thám Tử",
    description: "Được chỉ định 1 người và hỏi họ 1 câu hỏi Có/Không về từ họ đang giữ (Họ phải trả lời thật)",
    imageUrl: "🕵️"
  },
  "ticket_4": {
    name: "Thẻ Copycat",
    description: "Bạn không cần tự nghĩ, được phép dùng lại y hệt ý mô tả của một người đi trước",
    imageUrl: "🦜"
  },
  "ticket_5": {
    name: "Thẻ Phao Cứu Sinh",
    description: "Hệ thống sẽ cho bạn biết 1 đặc điểm chung của cả 2 từ (Cực kỳ hữu ích nếu bạn nghi mình là Gián điệp)",
    imageUrl: "🛟"
  },
  "ticket_6": {
    name: "Thẻ Chiếu Tướng",
    description: "Chỉ định một người bất kỳ phải mô tả từ của họ ngay lập tức trước khi vòng chơi tiếp tục",
    imageUrl: "👉"
  },
  "ticket_7": {
    name: "Thẻ Thu Hẹp",
    description: "Bắt người ở lượt tiếp theo chỉ được dùng đúng 1 từ duy nhất (danh từ hoặc tính từ) để mô tả",
    imageUrl: "🤐"
  },
  "ticket_8": {
    name: "Thẻ Hộ Thân",
    description: "Nếu vòng này bạn bị cả nhóm bỏ phiếu (vote) là Gián điệp, bạn được thêm 1 lượt giải thích để vote lại",
    imageUrl: "🛡️"
  }
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
