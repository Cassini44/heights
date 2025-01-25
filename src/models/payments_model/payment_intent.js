import dotenv from 'dotenv';
import Stripe from 'stripe';  // Default import for Stripe
import express from 'express';

dotenv.config();  // Configure dotenv after all imports

// Initialize Stripe using the secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  
const router = express.Router();  // Initialize express router



// Route to create a checkout session

const calculateOrderAmount = (items) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};



async function createPaymentIntent(req, res) {

  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    payment_method_types: ['card', 'afterpay_clearpay']
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
}


export default createPaymentIntent