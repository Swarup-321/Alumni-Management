const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  registerEvent,
  deleteEvent
} = require('../controllers/events.controller');

router.get('/', getAllEvents);
router.post('/', createEvent);
router.post('/register', registerEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
