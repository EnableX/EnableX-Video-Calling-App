const admin = require('firebase-admin');
require('dotenv').config();
const logger = require('./logger');
// eslint-disable-next-line import/no-dynamic-require
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const payload = {
  data: {},
};

const options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
};

// send push notification to android devices using firebase
exports.sendToDevice = (
  deviceToken, fcmPayload,
) => {
  const {
    callId, messageText, localNumber, remoteNumber, roomId, roomToken,
  } = fcmPayload;

  payload.data.uuid = callId;
  payload.data.message = messageText;
  payload.data.localPhoneNumber = localNumber;
  payload.data.remotePhoneNumber = remoteNumber;
  payload.data.roomId = roomId;
  payload.data.roomToken = roomToken;
  admin.messaging().sendToDevice(deviceToken, payload, options)
    .then((response) => {
      logger.info('Successfully sent message:');
      logger.info(JSON.stringify(response));
    })
    .catch((error) => {
      logger.info('Error sending message:');
      logger.info(JSON.stringify(error));
    });
};
