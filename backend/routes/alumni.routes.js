const express = require('express');
const router = express.Router();
const { getAllAlumni, getAlumniById, createAlumni } = require('../controllers/alumni.controller');
const { getDashboardStats } = require('../controllers/dashboard.controller');

router.get('/stats/dashboard', getDashboardStats);
router.get('/', getAllAlumni);
router.get('/:id', getAlumniById);
router.post('/', createAlumni);

module.exports = router;
