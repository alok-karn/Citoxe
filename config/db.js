import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'alok9988',
  database: 'logindb',
  port: 3300,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('MySQL Connected...');
  }
});

module.exports(db);
