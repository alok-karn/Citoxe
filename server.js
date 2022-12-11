const config = require('./config/config');
// uncaught exception handling
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception. Shutting Down');
  process.exit(1);
});

const app = require('./app');

app.get('/', (req, res) => {
  res.status(200).json({ status: true });
});

app.listen(config.port, () =>
  console.log(`Server is running on PORT ${config.port}`)
);
