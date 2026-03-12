const express = require('express');
const router = express.Router();
const { getAllMentorships, createMentorship } = require('../controllers/mentorship.controller');

router.get('/', getAllMentorships);
router.post('/', createMentorship);

module.exports = router;
