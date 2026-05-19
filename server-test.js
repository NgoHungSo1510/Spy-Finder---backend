require("dotenv").config();
const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
