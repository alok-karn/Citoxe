const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.get('/me', authController.protect, viewsController.getAccount);

// router.use(authController.isLoggedIn);

// router.get('/', viewsController.getOverview);
// router.get('/product/:title', viewsController.getTour);
router.get('/', viewsController.getLoginForm);

module.exports = router;
