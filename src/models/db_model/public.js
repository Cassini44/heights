
import {pool,db} from './config.js';

/* -------------------------------------------------------- */



// test => { }



const public_sql = {

  /* ------------------------------------------ */

  

  async getUser(username) {
    
    const results = await db.secure_query(`SELECT PASSWORD,USER_ID,FIRST_NAME,LOWER(USER_TYPE) AS USER_TYPE FROM USERS WHERE USERNAME = ?`, [username]);

    if(results.isEmpty()){
      return false
    }else{
      return results.asObjSingleRow();
    }
  },

  /* ------------------------------------------ */

}












/* -------------------------------------------------------------------------- */
export default public_sql