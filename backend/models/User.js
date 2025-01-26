const mongoose = require("mongoose");

// Define user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String }, // Stores the URL of the uploaded profile image
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
