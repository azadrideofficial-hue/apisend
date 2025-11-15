const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your real MongoDB Atlas URL
mongoose.connect("mongodb+srv://azadrideofficial_db_user:1id9rGQ5H9f6NVxc@azadride.aanyvmc.mongodb.net/?appName=azadride")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 👇 YOUR COLLECTION NAME = "messages"
const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,   // You can add any fields you want
}, {
  collection: "messages"   // 👈 FORCE collection name
});

const Message = mongoose.model("Message", MessageSchema);

// API endpoint to save a message
app.post("/add", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const msg = new Message({ name, email, message });
    await msg.save();

    res.json({ message: "Message saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving message" });
  }
});

// Get all messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});


// Test route
app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
