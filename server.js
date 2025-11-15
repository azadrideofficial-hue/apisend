const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

mongoose.connect("mongodb+srv://azadrideofficial_db_user:1id9rGQ5H9f6NVxc@azadride.aanyvmc.mongodb.net/?appName=azadride")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { collection: "messages" });

const Message = mongoose.model("Message", MessageSchema);

// POST API - save message
app.post("/add", async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();

    // 🔥 Send real-time event to all connected dashboards
    io.emit("new_message", msg);

    res.json({ message: "Ride created & sent!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving data" });
  }
});

// GET API - fetch all messages
app.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("Dashboard connected");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
