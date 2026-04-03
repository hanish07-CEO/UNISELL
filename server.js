const express = require('express');

const app = express();

// ROOT ROUTE (Railway health check)
app.get("/", (req, res) => {
  res.status(200).send("UniSell backend is LIVE 🚀");
});

// TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ message: "API working" });
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});