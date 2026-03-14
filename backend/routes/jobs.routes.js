const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  createJob,
  applyJob,
  deleteJob
} = require('../controllers/jobs.controller');

router.get('/', getAllJobs);
router.post('/', createJob);
router.post('/apply', applyJob);
router.delete('/:id', deleteJob);

module.exports = router;
