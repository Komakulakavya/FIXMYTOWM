const express = require('express');
const multer = require('multer');
const path = require('path');
const Issue = require('../models/Issue');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 🧩 Multer config for storing uploaded photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

/**
 * 📌 Report a new issue (with optional photo upload)
 * Accepts: category, description, address, contact, latitude, longitude, photos[]
 */
router.post('/', authMiddleware, upload.array('photos', 5), async (req, res) => {
  try {
    const { category, description, address, contact, latitude, longitude } = req.body; // New: Get latitude and longitude
    const photos = req.files.map(file => `/uploads/${file.filename}`);

    const issue = new Issue({
      category,
      description,
      reporterId: req.user.id,
      address,
      contact,
      photos,
      location: { // New: Add the location object
        latitude: parseFloat(latitude), // Convert to a number
        longitude: parseFloat(longitude), // Convert to a number
      },
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error('Issue creation error:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * 📌 Get issues reported by the logged-in user
 */
router.get('/my-issues', authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find({ reporterId: req.user.id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({ message: 'Error fetching issues' });
  }
});

/**
 * 📌 Get all issues (public)
 */
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reporterId', 'username')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error('Error fetching all issues:', error);
    res.status(500).json({ message: 'Error fetching issues' });
  }
});

/**
 * 📌 Update issue status (e.g., In Progress, Resolved)
 */
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update issue status' });
  }
});

/**
 * 📌 Filter issues by status/category + sorting
 */
router.get('/filter', authMiddleware, async (req, res) => {
  try {
    const { status, category, sortBy } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const sortOptions = {};
    if (sortBy === 'newest') sortOptions.createdAt = -1;
    else if (sortBy === 'oldest') sortOptions.createdAt = 1;

    const issues = await Issue.find(query)
      .populate('reporterId', 'username')
      .sort(sortOptions);

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering issues' });
  }
});

/**
 * 📌 Get issues assigned to current volunteer
 */
router.get('/assigned', authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find({ assignedVolunteer: req.user.id })
      .populate('reporterId', 'username')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assigned issues' });
  }
});

/**
 * 📌 Assign a volunteer to an issue
 */
router.put('/:id/assign', authMiddleware, async (req, res) => {
  const { volunteerId } = req.body;
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedVolunteer: volunteerId },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign volunteer' });
  }
});

module.exports = router;