const express = require('express');
const { getAllMentorships, createMentorship } = require('../controllers/mentorship.controller');

const router = express.Router();

router.get('/', getAllMentorships);
router.post('/', createMentorship);

module.exports = router;
