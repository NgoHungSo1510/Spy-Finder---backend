/**
 * Hàm sinh mã phòng ngẫu nhiên (ví dụ: 4 chữ số)
 */
function generateRoomId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Hàm xáo trộn mảng (Fisher-Yates)
 */
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * Logic chia vai trò ngẫu nhiên
 * @param {string[]} playerIds Danh sách người chơi
 * @param {number} spyCount Số lượng Spy
 * @param {boolean} mrWhiteEnabled Có Mr.White không
 */
function assignRoles(playerIds, spyCount, mrWhiteEnabled) {
  let roles = [];
  
  for (let i = 0; i < spyCount; i++) roles.push("spy");
  if (mrWhiteEnabled) roles.push("mrWhite");
  
  while (roles.length < playerIds.length) {
    roles.push("civilian");
  }

  roles = shuffleArray(roles);
  
  const assignments = {};
  playerIds.forEach((id, index) => {
    assignments[id] = roles[index];
  });
  
  return assignments;
}

module.exports = {
  generateRoomId,
  shuffleArray,
  assignRoles
};
