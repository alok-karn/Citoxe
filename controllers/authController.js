const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/config');
const MySqlHelper = require('../config/mysql-db-pool');

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const createSendToken = (id, statusCode, res) => {
  const token = signToken(id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + config.jwtCookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (config.node_env === 'production') cookieOptions.secure = true;
  res.cookie('jwt', cookieOptions);

  res.status(statusCode).json({
    status: true,
    token,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm)
      return res.status(400).json({
        status: false,
        message: 'Please enter your name, email, password and confirm password',
      });

    if (password !== passwordConfirm)
      return res.status(400).json({
        status: false,
        message: 'Passwords do not match',
      });

    const users = await MySqlHelper.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    if (users.length > 0)
      return res.status(401).json({
        status: false,
        message: 'This email address is already registered',
      });

    let hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await MySqlHelper.query('INSERT INTO users SET ?', {
      name: name,
      email: email,
      password: hashedPassword,
    });

    createSendToken(newUser.insertId, 201, res);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        status: false,
        message: 'Please provide an email and password',
      });

    const users = await MySqlHelper.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const pwd = users && users.length > 0 ? users[0].password : '';
    if (!users || !(await bcrypt.compare(password, pwd)))
      return res.status(401).json({
        status: false,
        message: 'Invalid User Credentials',
      });

    createSendToken(users[0].id, 200, res);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return res.status(401).json({
      status: false,
      message: 'Access denied. Please login to get access',
    });

  const decoded = await promisify(jwt.verify)(token, config.jwtSecret);

  const freshUser = await MySqlHelper.query(
    'SELECT * FROM users WHERE id = ?',
    [decoded.id]
  );

  if (freshUser && freshUser.length === 0)
    return res.status(401).json({
      status: false,
      message: 'The user belonging to this token no longer exists',
    });

  // if (freshUser.changedPasswordAfter(decoded.iat))
  //   return next(
  //     new AppError('You recently changed password. Please login again')
  //   );

  req.user = freshUser[0];
  next();
  } catch ( ) {
    return res.status(500).json({
      status: false,
      message: 'Access denied. Invalid token',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      res.status(403).json({
        status: false,
        message: 'You do not have permission to perform this action',
      });

    next();
  };
};
