const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User"); // Import the User model
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: "./uploads", // Store images in the "uploads" folder
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST route to upload profile image
router.post("/upload-profile-image", upload.single("profileImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    // Find the user and update their profile image URL
    const user = await User.findByIdAndUpdate(
      req.body.userId, // Assuming the user ID is sent in the request body
      { profileImage: imageUrl },
      { new: true }
    );
    
    // Return updated user data
    res.json({ imageUrl, user });
  } catch (err) {
    res.status(500).send({ error: "Error updating profile image" });
  }
});

module.exports = router;
