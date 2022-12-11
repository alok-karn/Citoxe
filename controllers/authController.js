const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/config');
const MySqlHelper = require('../config/mysql-db-pool');

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + config.jwtCookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (config.node_env === 'production') cookieOptions.secure = true;
  res.cookie('jwt', cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

    createSendToken(newUser, 201, res);
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

    createSendToken(users[0], 200, res);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};
