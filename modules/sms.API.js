const TeleSignSDK = require('telesignsdk');
const config = require('../config');

const { customerId, apiKey, rest_endpoint } = config.smsAPISecrets;
const timeout = 10 * 1000; // 10 secs

const client = new TeleSignSDK(customerId,
  apiKey,
  rest_endpoint,
  timeout // optional
  // userAgent
);


function sendOtp (phone, otp) {
  console.log('## MessagingClient.message ##');
  const phoneNumber = `002${'01013011173'}`;
  const message = `Your code is: ${otp}`;
  const messageType = 'ARN';
  function messageCallback (error, responseBody) {
    if (error === null) {
      console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                ` => code: ${responseBody['status']['code']}` +
                `, description: ${responseBody['status']['description']}  OTP ${otp}`);
    } else {
      console.error(`Unable to send message. ${ error}`);
    }
  }
  client.sms.message(messageCallback, phoneNumber, message, messageType);
}

module.exports = sendOtp;