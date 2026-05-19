const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const { generateRoomId } = require("../services/gameLogic");

// [POST] /api/rooms/create - Tạo phòng mới
router.post("/create", async (req, res) => {
  try {
    const { hostPlayerId, username, avatarId } = req.body;
    if (!hostPlayerId || !username || !avatarId) {
      return res.status(400).json({ success: false, error: "Thiếu thông tin người chơi" });
    }

    const roomId = generateRoomId();

    const roomRef = db.ref(`rooms/${roomId}`);
    await roomRef.set({
      meta: {
        roomId,
        hostPlayerId,
        phase: "waiting",
        createdAt: Date.now(),
        maxPlayers: 12
      },
      settings: {
        spyCount: 1,
        mrWhiteEnabled: false,
        ticketConfig: {
          enabled: false,
          selectedTicketIds: [],
          triggerMode: "fixed",
          fixedInterval: "3-5",
          randomChancePercent: 20
        },
        turnTimerSeconds: 60
      },
      players: {
        [hostPlayerId]: {
          username,
          avatarId,
          role: null,
          keyword: null,
          isAlive: true,
          isOnline: true,
          isReady: false,
          joinedAt: Date.now(),
          lastSeen: Date.now()
        }
      },
      topics: {
        submitted: {},
        pool: [],
        usedTopicIds: [],
        currentTopicId: null,
        currentKeywords: {
          word1: "",
          word2: ""
        },
        shuffleRound: 0
      },
      gameState: {
        currentTurnPlayerId: null,
        turnOrder: [],
        turnIndex: 0,
        turnCount: 0,
        timerStartedAt: null,
        activeTicket: {
          ticketId: null,
          name: null,
          description: null,
          imageUrl: null
        }
      },
      votes: {
        round: 1,
        ballots: {},
        eliminatedPlayerId: null,
        mrWhiteGuess: null
      }
    });

    res.status(200).json({ success: true, roomId });
  } catch (error) {
    console.error("Lỗi tạo phòng:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// [POST] /api/rooms/join - Tham gia phòng
router.post("/join", async (req, res) => {
  try {
    const { roomId, playerId, username, avatarId } = req.body;
    if (!roomId || !playerId || !username || !avatarId) {
      return res.status(400).json({ success: false, error: "Thiếu thông tin" });
    }

    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once("value");
    
    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, error: "Phòng không tồn tại" });
    }

    const roomData = snapshot.val();
    if (roomData.meta.phase !== "waiting") {
      // Cho phép reconnect nếu đã ở trong phòng
      if (!roomData.players || !roomData.players[playerId]) {
        // Vào muộn -> Khán giả
        await db.ref(`rooms/${roomId}/players/${playerId}`).set({
          username,
          avatarId,
          role: "spectator",
          keyword: null,
          isAlive: false,
          isOnline: true,
          isReady: false,
          joinedAt: Date.now(),
          lastSeen: Date.now()
        });
        return res.status(200).json({ success: true, roomId });
      }
    }

    // Nếu phòng đầy
    const playerCount = roomData.players ? Object.keys(roomData.players).length : 0;
    if (playerCount >= roomData.meta.maxPlayers && (!roomData.players || !roomData.players[playerId])) {
      return res.status(403).json({ success: false, error: "Phòng đã đầy!" });
    }

    // Thêm hoặc cập nhật player
    await db.ref(`rooms/${roomId}/players/${playerId}`).set({
      username,
      avatarId,
      role: roomData.players?.[playerId]?.role || null, // Giữ nguyên role nếu reconnect
      keyword: roomData.players?.[playerId]?.keyword || null,
      isAlive: roomData.players?.[playerId]?.isAlive !== false,
      isOnline: true,
      isReady: roomData.players?.[playerId]?.isReady || false,
      joinedAt: roomData.players?.[playerId]?.joinedAt || Date.now(),
      lastSeen: Date.now()
    });

    res.status(200).json({ success: true, roomId });
  } catch (error) {
    console.error("Lỗi tham gia phòng:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// [POST] /api/rooms/ready - Đổi trạng thái sẵn sàng
router.post("/ready", async (req, res) => {
  try {
    const { roomId, playerId, isReady } = req.body;
    await db.ref(`rooms/${roomId}/players/${playerId}/isReady`).set(isReady);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// [POST] /api/rooms/leave - Rời phòng, chuyển host nếu cần
router.post("/leave", async (req, res) => {
  try {
    const { roomId, playerId } = req.body;
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) return res.status(200).json({ success: true }); // Phòng đã hết thì coi như đã thoát

    const roomData = snapshot.val();
    const isHost = roomData.meta.hostPlayerId === playerId;

    // Xóa player khỏi danh sách
    await db.ref(`rooms/${roomId}/players/${playerId}`).remove();

    // Nếu là host, trao quyền cho người khác còn trong phòng
    if (isHost) {
      const remainingPlayersSnap = await db.ref(`rooms/${roomId}/players`).once("value");
      const remaining = remainingPlayersSnap.val();

      if (!remaining || Object.keys(remaining).length === 0) {
        // Không còn ai → xóa phòng
        await roomRef.remove();
      } else {
        // Trao host cho người đầu tiên còn lại (ưu tiên người online)
        const remainingIds = Object.keys(remaining);
        const newHostId = remainingIds.find(id => remaining[id].isOnline) || remainingIds[0];
        await db.ref(`rooms/${roomId}/meta/hostPlayerId`).set(newHostId);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Leave room error:", error);
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// [POST] /api/rooms/settings - Lưu cài đặt phòng
router.post("/settings", async (req, res) => {
  try {
    const { roomId, playerId, settings } = req.body;
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) return res.status(404).json({ success: false, error: "Phòng không tồn tại" });
    const roomData = snapshot.val();
    if (roomData.meta.hostPlayerId !== playerId) {
      return res.status(403).json({ success: false, error: "Chỉ host mới được thay đổi cài đặt" });
    }
    await db.ref(`rooms/${roomId}/settings`).update(settings);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// [POST] /api/rooms/submit-topics - Gửi chủ đề đã chọn
router.post("/submit-topics", async (req, res) => {
  try {
    const { roomId, playerId, topics } = req.body;
    if (!topics || topics.length === 0 || topics.length > 2) {
      return res.status(400).json({ success: false, error: "Chọn 1-2 chủ đề" });
    }
    await db.ref(`rooms/${roomId}/topics/submitted/${playerId}`).set({
      topic1: topics[0] || null,
      topic2: topics[1] || null
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// [POST] /api/rooms/start-game - Bắt đầu ván chơi
router.post("/start-game", async (req, res) => {
  try {
    const { roomId, playerId } = req.body;
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) return res.status(404).json({ success: false, error: "Phòng không tồn tại" });
    const roomData = snapshot.val();
    if (roomData.meta.hostPlayerId !== playerId) {
      return res.status(403).json({ success: false, error: "Chỉ host mới được bắt đầu" });
    }
    const playerIds = Object.keys(roomData.players || {});
    if (playerIds.length < 1) {
      return res.status(400).json({ success: false, error: "Cần ít nhất 1 người chơi" });
    }
    // Assign roles
    const { assignRoles, shuffleArray } = require("../services/gameLogic");
    const settings = roomData.settings || {};
    const roles = assignRoles(playerIds, settings.spyCount || 1, settings.mrWhiteEnabled || false);

    // Collect topics from submitted
    const submitted = roomData.topics?.submitted || {};
    const topicSet = new Set();
    Object.values(submitted).forEach(s => {
      if (s.topic1) topicSet.add(s.topic1);
      if (s.topic2) topicSet.add(s.topic2);
    });
    let pool = [...topicSet];
    if (pool.length === 0) pool = ["topic_1"]; // fallback
    pool = shuffleArray(pool);

    const currentTopicId = pool[0];
    // Get words from topicDatabase
    const topicSnap = await db.ref(`topicDatabase/${currentTopicId}`).once("value");
    const topicData = topicSnap.val();
    let word1 = "???", word2 = "???";
    if (topicData && topicData.words && topicData.words.length >= 2) {
      const shuffledWords = shuffleArray(topicData.words);
      word1 = shuffledWords[0];
      word2 = shuffledWords[1];
    }

    // Assign keywords to players based on role
    const shuffledPlayerIds = shuffleArray(playerIds);
    const half = Math.ceil(shuffledPlayerIds.length / 2);
    const updates = {};
    shuffledPlayerIds.forEach((pid) => {
      updates[`players/${pid}/role`] = roles[pid];
      if (roles[pid] === "mrWhite") {
        updates[`players/${pid}/keyword`] = null;
      } else if (roles[pid] === "spy") {
        updates[`players/${pid}/keyword`] = word2;
      } else {
        updates[`players/${pid}/keyword`] = word1;
      }
    });

    const turnOrder = shuffleArray(playerIds);
    updates["meta/phase"] = "playing";
    updates["topics/pool"] = pool;
    updates["topics/currentTopicId"] = currentTopicId;
    updates["topics/currentKeywords"] = { word1, word2 };
    updates["topics/usedTopicIds"] = [currentTopicId];
    updates["gameState/turnOrder"] = turnOrder;
    updates["gameState/currentTurnPlayerId"] = turnOrder[0];
    updates["gameState/turnIndex"] = 0;
    updates["gameState/turnCount"] = 1;
    updates["gameState/timerStartedAt"] = Date.now();
    updates["votes/round"] = 1;
    updates["votes/ballots"] = null;
    updates["votes/eliminatedPlayerId"] = null;
    updates["votes/votingEndTime"] = null;
    updates["endGameVotes"] = null;

    await roomRef.update(updates);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Start game error:", error);
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// [POST] /api/rooms/next-turn - Chuyển lượt
router.post("/next-turn", async (req, res) => {
  try {
    const { roomId, playerId } = req.body;
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once("value");
    if (!snapshot.exists()) return res.status(404).json({ success: false, error: "Phòng không tồn tại" });
    const roomData = snapshot.val();
    const gs = roomData.gameState;
    if (gs.currentTurnPlayerId !== playerId) {
      return res.status(403).json({ success: false, error: "Không phải lượt của bạn" });
    }
    
    // Tìm người tiếp theo còn sống
    let nextIndex = gs.turnIndex;
    let nextPlayerId = null;
    let found = false;
    let loopedCount = 0;
    
    while(loopedCount < gs.turnOrder.length) {
        nextIndex = (nextIndex + 1) % gs.turnOrder.length;
        const pId = gs.turnOrder[nextIndex];
        loopedCount++;
        
        // Nếu đã quay lại từ đầu vòng (nextIndex <= gs.turnIndex ban đầu) 
        // hoặc đã duyệt qua hết -> hết vòng
        if (roomData.players[pId]?.isAlive) {
            nextPlayerId = pId;
            // Nếu tìm thấy người chơi nhưng index của họ lại nhỏ hơn index hiện tại
            // Tức là đã quay lại vòng mới
            if (nextIndex <= gs.turnIndex) {
                found = "new_round";
            } else {
                found = "same_round";
            }
            break;
        }
    }

    if (found === "new_round" || !found) {
        // Chuyển sang Voting phase
        await roomRef.update({
            "meta/phase": "voting",
            "votes/votingEndTime": Date.now() + 60000,
            "votes/ballots": null
        });
    } else {
        await roomRef.update({
          "gameState/turnIndex": nextIndex,
          "gameState/currentTurnPlayerId": nextPlayerId,
          "gameState/turnCount": gs.turnCount + 1,
          "gameState/timerStartedAt": Date.now()
        });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
});

// [POST] /api/rooms/submit-vote - Submit vote
router.post("/submit-vote", async (req, res) => {
    try {
        const { roomId, playerId, targetId } = req.body;
        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once("value");
        if (!snapshot.exists()) return res.status(404).json({ success: false, error: "Phòng không tồn tại" });
        const roomData = snapshot.val();
        
        if (roomData.meta.phase !== "voting") return res.status(400).json({ success: false, error: "Không trong giai đoạn bầu chọn" });
        if (!roomData.players[playerId]?.isAlive) return res.status(403).json({ success: false, error: "Bạn đã chết hoặc là khán giả" });

        await roomRef.child(`votes/ballots/${playerId}`).set(targetId);
        
        // Check if everyone alive has voted
        const alivePlayers = Object.keys(roomData.players).filter(id => roomData.players[id].isAlive);
        const ballotsSnap = await roomRef.child("votes/ballots").once("value");
        const ballots = ballotsSnap.val() || {};
        ballots[playerId] = targetId; // include current vote
        
        if (Object.keys(ballots).length >= alivePlayers.length) {
            // Tally votes
            const counts = {};
            Object.values(ballots).forEach(tid => {
                counts[tid] = (counts[tid] || 0) + 1;
            });
            let maxVotes = 0;
            let eliminatedId = null;
            let isTie = false;
            
            Object.keys(counts).forEach(tid => {
                if (counts[tid] > maxVotes) {
                    maxVotes = counts[tid];
                    eliminatedId = tid;
                    isTie = false;
                } else if (counts[tid] === maxVotes) {
                    isTie = true;
                }
            });

            const updates = {
                "meta/phase": "result",
                "votes/eliminatedPlayerId": isTie ? null : eliminatedId
            };
            
            if (!isTie && eliminatedId) {
                updates[`players/${eliminatedId}/isAlive`] = false;
            }

            await roomRef.update(updates);
            
            // Check win condition
            const newPlayersSnap = await roomRef.child("players").once("value");
            const newPlayers = newPlayersSnap.val();
            const newAlive = Object.keys(newPlayers).filter(id => newPlayers[id].isAlive);
            
            let aliveSpies = 0;
            let aliveCitizens = 0;
            newAlive.forEach(id => {
                if (newPlayers[id].role === "spy") aliveSpies++;
                else aliveCitizens++;
            });

            let winner = null;
            if (aliveSpies === 0) winner = "citizens";
            else if (aliveCitizens === 0) winner = "spies";
            else if (newAlive.length <= 2 && aliveSpies > 0) winner = "spies"; // Changed back to spies based on user feedback 1: "đổi là gián thắng"

            if (winner) {
                await roomRef.update({
                    "gameState/winner": winner,
                    "meta/phase": "result"
                });
            }
        }
        
        res.status(200).json({ success: true });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, error: "Lỗi server" });
    }
});

// [POST] /api/rooms/next-round
router.post("/next-round", async (req, res) => {
    try {
        const { roomId, playerId } = req.body;
        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once("value");
        const roomData = snapshot.val();
        
        if (roomData.meta.hostPlayerId !== playerId) return res.status(403).json({ success: false });
        if (roomData.gameState?.winner) return res.status(400).json({ success: false, error: "Game đã kết thúc" });

        const gs = roomData.gameState;
        
        // Find next alive player from turn 0
        let nextPlayerId = null;
        let nextIndex = 0;
        for (let i = 0; i < gs.turnOrder.length; i++) {
            if (roomData.players[gs.turnOrder[i]]?.isAlive) {
                nextPlayerId = gs.turnOrder[i];
                nextIndex = i;
                break;
            }
        }

        await roomRef.update({
            "meta/phase": "playing",
            "gameState/turnIndex": nextIndex,
            "gameState/currentTurnPlayerId": nextPlayerId,
            "gameState/turnCount": 1,
            "gameState/timerStartedAt": Date.now(),
            "votes/round": (roomData.votes?.round || 1) + 1,
            "votes/ballots": null,
            "votes/eliminatedPlayerId": null
        });
        
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

// [POST] /api/rooms/end-game
router.post("/end-game", async (req, res) => {
    try {
        const { roomId, playerId } = req.body;
        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once("value");
        const roomData = snapshot.val();
        
        if (roomData.meta.hostPlayerId !== playerId) return res.status(403).json({ success: false });

        const updates = {
            "meta/phase": "waiting",
            "gameState/winner": null,
            "endGameVotes": null
        };
        
        Object.keys(roomData.players || {}).forEach(pid => {
            updates[`players/${pid}/isAlive`] = true;
            updates[`players/${pid}/role`] = null;
            updates[`players/${pid}/keyword`] = null;
            updates[`players/${pid}/isReady`] = false;
        });

        await roomRef.update(updates);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

// [POST] /api/rooms/kick - Host kick player
router.post("/kick", async (req, res) => {
    try {
        const { roomId, playerId, targetId } = req.body;
        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once("value");
        const roomData = snapshot.val();
        
        if (!roomData) return res.status(404).json({ success: false, error: "Phòng không tồn tại" });
        if (roomData.meta.hostPlayerId !== playerId) return res.status(403).json({ success: false, error: "Chỉ host mới có thể kick" });
        if (targetId === playerId) return res.status(400).json({ success: false, error: "Không thể tự kick mình" });
        if (roomData.meta.phase !== "waiting") return res.status(400).json({ success: false, error: "Chỉ kick được ở phòng chờ" });
        
        await db.ref(`rooms/${roomId}/players/${targetId}`).remove();
        res.status(200).json({ success: true });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false });
    }
});

// [POST] /api/rooms/submit-endgame-vote
router.post("/submit-endgame-vote", async (req, res) => {
    try {
        const { roomId, playerId, vote } = req.body;
        await db.ref(`rooms/${roomId}/endGameVotes/${playerId}`).set(vote);
        res.status(200).json({ success: true });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
