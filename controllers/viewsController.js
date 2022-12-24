const MySqlHelper = require('../config/mysql-db-pool');

exports.getHomepage = async (req, res, next) => {
  const allProducts = await MySqlHelper.query('SELECT * FROM plants');

  res
    .status(200)
    .render('homepage', { title: 'All Plants', products: allProducts });
};

// exports.getPlant = async (req, res, next) => {
// 	const slug = req.params.slug;
// 	const tour = await Tour.findOne({ slug }).populate({ path: 'reviews', fields: 'review rating user' });

// 	if (!tour) {
// 		return next(new AppError('There is no tour with that name', 404));
// 	}

// 	res.status(200).render('tour', { title: `${tour.name}`, tour });
// }

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Login to your Account' });
};

exports.getRegisterForm = (req, res) => {
  res.status(200).render('register', { title: 'Register for a new Account' });
};