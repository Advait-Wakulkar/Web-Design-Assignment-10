const express = require('express');
const Job = require('../models/Job');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// Add a new job (only accessible by logged-in users)
router.post('/', protect, async (req, res) => {
    const { title, description, lastUpdated, applyLink } = req.body;

    try {
        const newJob = new Job({ title, description, lastUpdated, applyLink });
        await newJob.save();
        res.status(201).json({ msg: 'Job added successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Error adding job', error: err.message });
    }
});

// Get all jobs (publicly accessible)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching jobs', error: err.message });
    }
});

module.exports = router;
