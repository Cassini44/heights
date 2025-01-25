
import express from 'express';
import auth from '../controllers/auth.js';
import createAccount from '../controllers/createAccount.js'
import payment_intent from'../models/payments_model/payment_intent.js';
import stripe_webhook from './stripe_webhook.js';
import path from 'path'

// public/

/* -------------------------------------------------------------------------- */
const router = express.Router();


/* ------Account login stuff ---- */
router.post('/login' , auth.login)


router.get('/login-page', (req, res) => { 
    res.sendFile(path.join(process.cwd(), 'shared', 'login.html'));
});


router.get('/logout' , auth.logout)

router.post('/create-student-account',createAccount.newStudent)

/* ------Payment Stuff------------ */
router.post('/create-payment-intent',payment_intent)



















/* -------------------------------------------------------------------------- */
export default router