const express = require('express');
const router = express.Router();
const { getAllDonations, getDonationStats, createDonation } = require('../controllers/donations.controller');

router.get('/', getAllDonations);
router.get('/stats', getDonationStats);
router.post('/', createDonation);

module.exports = router;
