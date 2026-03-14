const express = require('express');
const router = express.Router();
const {
  getAllDonations,
  getUserDonations,
  createDonation,
  deleteDonation
} = require('../controllers/donations.controller');

router.get('/', getAllDonations);
router.get('/user/:user_id', getUserDonations);
router.post('/', createDonation);
router.delete('/:id', deleteDonation);

module.exports = router;
