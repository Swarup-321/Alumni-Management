const express = require('express');
const router = express.Router();
const { getAllEvents, createEvent, registerEvent } = require('../controllers/events.controller');

router.get('/', getAllEvents);
router.post('/', createEvent);
router.post('/register', registerEvent);

module.exports = router;
