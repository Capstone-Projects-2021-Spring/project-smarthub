import fs from 'fs';
const secureEnv = require('secure-env');
process.env = secureEnv({secret: 'SmartHub'});
const envVars = process.env;

const accountSid = envVars.TWILIO_ACCOUNT_SID;
const authToken = envVars.TWILIO_AUTH_TOKEN;

const fromSMS = '+15702430225';
//const fromWA = 'whatsapp:+14155238886';
const client = require('twilio')(accountSid, authToken);

// Send text sms
module.exports.sendSMS = function(content: any){
    client.messages
    .create({
        body: content.messageBody,
        from: fromSMS ,
        to: '+1' + content.phoneNumber,
        mediaUrl: content.mediaContent,
    })
    .then((response: any)=> {
        console.log(response);
    })
    .catch((error: any) => {
        console.log(error);
    })
}