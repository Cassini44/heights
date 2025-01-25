
import dotenv from 'dotenv';
import Stripe from 'stripe';


// textShadow: 
/* -------------------------------------------------------------------------- */
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = "whsec_20cd848427aeb602e117ac8c8d3b104347e32535eac2aff477a23a4c5994cd72";


function stripe_webhook (request, response) {
    console.log('running')
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log(err)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log('WOW')
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}

export default stripe_webhook



