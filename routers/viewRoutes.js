const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.get('/me', authController.protect, viewsController.getAccount);

// router.use(authController.isLoggedIn);

router.get('/', viewsController.getHomepage);
router.get('/login', viewsController.getLoginForm);
router.get('/register', viewsController.getRegisterForm);
router.get('/shop', viewsController.getShopPage);
router.get('/cart', viewsController.getCartPage);


module.exports = router;
