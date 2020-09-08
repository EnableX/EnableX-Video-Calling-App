const { MongoClient } = require('mongodb');
require('dotenv').config();
const logger = require('./logger');

let database;

MongoClient
  .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    logger.info('Connected to the database!');
    database = db.db(process.env.MONGO_DB);
  })
  .catch((err) => {
    logger.info('Cannot connect to the database!', err);
    process.exit();
  });

// register device (token) to the server
exports.saveCustomer = (
  phoneNumber, deviceToken, devicePlatform,
) => new Promise((resolve, reject) => {
  const myobj = { phone_number: phoneNumber, token: deviceToken, platform: devicePlatform };
  database
    .collection('customers')
    .insertOne(myobj, (err, result) => (err ? reject(err) : resolve(result)));
});

// get device token to the server
exports.getCustomerByNumber = (phoneNumber) => new Promise((resolve, reject) => {
  database
    .collection('customers')
    .find({ phone_number: phoneNumber })
    .limit(1)
    .toArray((err, result) => (err ? reject(err) : resolve(result)));
});
