import express from 'express';
import auth from '../controllers/auth.js';
import render from '../controllers/render.js'
import dataAccess from '../controllers/dataAccess.js'






/* -------------------------------------------------------------------------- */
const router = express.Router();
router.use(auth.authenticateToken); //! Everything in this route will require authentication token






router.use('/data/:usertype/:query_id',(req,res) => {
    const { usertype, query_id } = req.params;
    console.log(req.params)
    // Authentication and role validation
    if (req.user.USER_TYPE !== usertype) {
        return res.status(403).send(`${req.USER_TYPE}`);
    }

    // Validate querytype
    if (!dataAccess[usertype] || !dataAccess[usertype][query_id]) {
        return res.status(404).send("Invalid query type or user type");
    }
    dataAccess[usertype][query_id](req, res);
})






router.get('*',render)



/* -------------------------------------------------------------------------- */
export default router