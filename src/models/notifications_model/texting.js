import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

function sentText() {
  client.messages.create({
    body: 'Hello from Node.js!',
    from: '+1 844 756 0380',
    to: '+14406675864',
  })
  .then((message) => console.log(`Message sent with SID: ${message.sid}`))
  .catch((error) => console.error(`Failed to send message: ${error.message}`));
}

export default sentText;