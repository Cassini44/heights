import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import public_sql from '../models/db_model/public.js';
import logger from '../utility/logger.js';

// Configure dotenv after imports
dotenv.config();
const SECRET_KEY = process.env.LOGIN_SECRET_KEY;
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */





function generateToken(user, secretKey)  {
    const { USER_ID, FIRST_NAME, USER_TYPE } = user;
    return jwt.sign(
        { USER_ID, FIRST_NAME, USER_TYPE },
        secretKey,
        { expiresIn: '10h' }  // Token will expire in 1 hour
    );
}

const auth = {


    


    // Middleware to authenticate the JWT token
    authenticateToken(req, res, next) {
        console.log('Checking token...');
        global.debugVar += 1;
        console.log(global.debugVar);

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        // Extract token from the HTTP-only cookie
        const token = req.cookies.jwtToken;  // JWT stored in cookie

        // If no token found, return 401 Unauthorized
        if (!token) {
            console.log('No')
            return res.redirect('/login.html');  // Unauthorized
        }


        // Verify the token
        jwt.verify(token, process.env.LOGIN_SECRET_KEY, (err, user) => {
            if (err) {
                res.redirect('/login.html');
                return
                // Forbidden if token is invalid
            }

            // If token is valid, attach user info to req object
            req.user = user;
            console.log(user)
            

            // Pass control to the next middleware or route handler
            next();
        });
    },


    async resetPassword(req, res) {
        
    },
    
    async login(req, res) {
        const { username, password } = req.body;

        var query = await public_sql.getUser(username)
        
        if (!query) {return res.status(401).json({ message: 'Invalid credentials' });}

        console.log(query)

        var {PASSWORD:HASH,USER_ID,USER_TYPE,FIRST_NAME} = query

        const match = await bcrypt.compare(password, HASH);
        if (!match) {return res.status(401).json({ message: 'Invalid credentials' });}

        /* ------------------PASSWORD MATCHED--------------------------------- */

        
        const token = generateToken({ USER_ID, FIRST_NAME, USER_TYPE }, SECRET_KEY);



        
        
        res.cookie('jwtToken', token, {
            httpOnly: true,     // Prevent client-side access via JavaScript
            secure: false,      // Set to true if using HTTPS in production
            maxAge: 60 * 60 * 1000  // Token expires in 1 hour
        });




        

        res.redirect('/secure/home')
        // res.render(USER_TYPE)
    },



    logout (req, res) {
        res.clearCookie('jwtToken');

        // logger.info(res)
        console.dir(res, { depth: null, colors: true });
    
    // Redirect back to the login page
        res.redirect('/login.html');
    }


};


   

/* =============================================================================== */



export default auth