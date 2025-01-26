const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/dashboarddb", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware to parse JSON
app.use(express.json());

// Serve uploaded files as static resources
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use upload routes for handling image uploads
app.use("/api", uploadRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
