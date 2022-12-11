const dotenv = require('dotenv');
const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtCookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  mysqlUsername: process.env.MY_SQL_USERNAME,
  mysqlPassword: process.env.MY_SQL_PASSWORD,
  mysqlDatabase: process.env.MY_SQL_DATABASE,
  mysqlPort: process.env.MY_SQL_PORT,
};
