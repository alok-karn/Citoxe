const express = require('express');

const authController = require('../controllers/authController');
const productsControllers = require('../controllers/productsControllers');

const router = express.Router();

router.route('/').get(productsControllers.getAllProducts);
router.route('/:id').get(productsControllers.getProduct);

router.use(authController.protect);
router.route('/').post(productsControllers.createProduct);

router
  .route('/:id')
  .patch(productsControllers.updateProduct)
  .delete(productsControllers.deleteProduct);

module.exports = router;
