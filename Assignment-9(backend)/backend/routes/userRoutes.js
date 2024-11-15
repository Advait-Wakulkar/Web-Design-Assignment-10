const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// Setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload profile picture
router.put('/upload-image', protect, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.imagePath = req.file.path;
        await user.save();

        res.status(200).json({ msg: 'Profile picture updated successfully', imagePath: req.file.path });
    } catch (err) {
        res.status(500).json({ msg: 'Error uploading image', error: err.message });
    }
});

module.exports = router;
