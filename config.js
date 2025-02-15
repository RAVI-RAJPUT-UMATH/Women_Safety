// Twilio Configuration
// ⚠️ SECURITY WARNING: Do NOT hardcode sensitive credentials in your source code.
// Use environment variables instead to keep your Twilio credentials secure.

require('dotenv').config();

const twilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Twilio Account SID
    authToken: process.env.TWILIO_AUTH_TOKEN || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Twilio Auth Token
    twilioNumber: '+16812434625', // Twilio Phone Number
    phoneNumber: '1090', // Emergency number
    twimlAppSid: process.env.TWIML_APP_SID || '' // Twiml App SID (optional)
};

module.exports = twilioConfig;
