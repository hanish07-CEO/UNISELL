require('dotenv').config();
const express = require('express');

const app = express();

// VERY IMPORTANT → root route FIRST
app.get("/", (req, res) => {
  res.status(200).send("UniSell backend is LIVE 🚀");
});

// Simple health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Test API route
app.get("/test", (req, res) => {
  res.json({ message: "API working" });
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});