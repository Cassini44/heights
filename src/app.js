/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 ~ Author : Nick Janosky (nyden1414@gmail.com)
 ~ Project: Heights Driving School Inc. Website 2024 Update
 ~ Todays Date: 9/8/2024

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import express from 'express';
import secure_routes from './routes/secure_routes.js'; // routes users must be logged into
import public_routes from './routes/public_routes.js'; // routes available to public
import stripe_webhook from './routes/stripe_webhook.js';
import listEndpoints from 'express-list-endpoints'
import logger from './utility/logger.js';
import chalk from 'chalk';
import path from 'path'
import cookieParser from 'cookie-parser';


global.debugVar = 0;
console.log(global.debugVar);

// Log errors
process.on('uncaughtException', (err) => {
   logger.error('Uncaught Exception:', err);
   process.exit(1);
 });
 
 process.on('unhandledRejection', (reason) => {
   logger.error('Unhandled Rejection:', reason);
   process.exit(1);
 });

/* -------------------------------------------------------------------------- */


const app = express();
app.set('views',path.join(process.cwd(), 'src','application','ui','pages'));
app.set('view engine', 'ejs');

/* -------------------------------------------------------------------------- */


//~must be before the express.json thing
app.post('/stripe-webhook',express.raw({ type: 'application/json'}),stripe_webhook)


/* -------------------------------------------------------------------------- */


app.use(express.json());
app.use(cookieParser());
app.use(express.static('shared'));
app.use('/assets',express.static(path.join(process.cwd(), 'src','application','assets')));
app.use('/loaded_scripts',express.static(path.join(process.cwd(), 'src','application','ui','scripts')));
app.use('/loaded_styles',express.static(path.join(process.cwd(), 'src','application','ui','styles')));


/* -------------------------------------------------------------------------- */

/*  */
app.use('/public', public_routes)
app.use('/secure', secure_routes)



//-------------------------------------------------------------------------------
app.get('/', (req, res) => {
   res.sendFile('/index.html'); 
});







// console.log(listEndpoints(app));
app.listen(8080, () => {

   // Log server events
   
   logger.info('Server started on port 8080');

});

