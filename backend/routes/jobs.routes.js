const express = require('express');
const router = express.Router();
const { getAllJobs, createJob, applyJob } = require('../controllers/jobs.controller');

router.get('/', getAllJobs);
router.post('/', createJob);
router.post('/apply', applyJob);

module.exports = router;
