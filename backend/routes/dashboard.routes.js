const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAlumniByYear,
  getAlumniByDepartment,
  getDonationsByMode,
  getUsersByRole,
  getTopDonors,
  getAlumniWhoDonated,
  getUsersNeverDonated,
  getDonationsThisMonth,
  getRecentAlumni,
  getDonationStats,
  searchAlumni
} = require('../controllers/dashboard.controller');

router.get('/stats', getDashboardStats);
router.get('/alumni-by-year', getAlumniByYear);
router.get('/alumni-by-department', getAlumniByDepartment);
router.get('/donations-by-mode', getDonationsByMode);
router.get('/users-by-role', getUsersByRole);
router.get('/top-donors', getTopDonors);
router.get('/alumni-donated', getAlumniWhoDonated);
router.get('/users-never-donated', getUsersNeverDonated);
router.get('/donations-this-month', getDonationsThisMonth);
router.get('/recent-alumni', getRecentAlumni);
router.get('/donation-stats', getDonationStats);
router.get('/search', searchAlumni);

module.exports = router;
