const express = require('express');
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  addWorkExperience,
  getWorkExperience,
  getAllSkills,
  addAlumniSkill,
  getAlumniSkills
} = require('../controllers/alumni.controller');
const { getDashboardStats } = require('../controllers/dashboard.controller');

router.get('/stats/dashboard', getDashboardStats);
router.get('/', getAllAlumni);
router.get('/:id', getAlumniById);
router.post('/', createAlumni);
router.put('/:id', updateAlumni);
router.delete('/:id', deleteAlumni);
router.post('/work-experience', addWorkExperience);
router.get('/work-experience/:profile_id', getWorkExperience);
router.get('/skills', getAllSkills);
router.post('/alumni-skills', addAlumniSkill);
router.get('/alumni-skills/:profile_id', getAlumniSkills);

module.exports = router;
