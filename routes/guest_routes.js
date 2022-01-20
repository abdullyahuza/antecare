const express = require('express');

const guestController = require('../controllers/guest_controllers');

const router = express.Router();


//new guest route
router.post('/new-guest', guestController.new_guest);
router.post('/chat/guest/new-guest', guestController.new_guest);

router.post('/continue', guestController.log_guest);

router.get('/chat/:pid', guestController.log_guest)

router.post('/chat/:pid', guestController.log_guest)


module.exports = router;
