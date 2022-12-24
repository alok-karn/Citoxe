const MySqlHelper = require('../config/mysql-db-pool');

exports.getHomepage = async (req, res, next) => {
  const allProducts = await MySqlHelper.query('SELECT * FROM plants');

  res
    .status(200)
    .render('homepage', { title: 'Home Page', products: allProducts });
};


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Login to your Account' });
};

exports.getRegisterForm = (req, res) => {
  res.status(200).render('register', { title: 'Register for a new Account' });
};

exports.getShopPage = (req, res) => {
  res.status(200).render('shop', { title: 'Shop' });
}

exports.getCartPage = (req, res) => {
  res.status(200).render('cart', { title: 'Add to Cart' });
}