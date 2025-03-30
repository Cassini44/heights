import { db } from "../models/db_model/config.js";
import bcrypt from 'bcrypt';

// Method to hash a password
async function hashPassword(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, 10, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
}
    
    



    
const createAccount =  {

    async newStudent(req,res) {

        
        const {
            class: className, // "class" is a reserved keyword, so renaming is necessary
            delivery_method,
            email,
            phone,
            password,
            sms_auth,
            first_name,
            last_name,
            dob,
            gender,
            address_1,
            address_2,
            city,
            state,
            zip,
            payment_choice
        } = req.body;


        const users_data = {
            ADDRESS_1: address_1,
            ADDRESS_2: address_2,
            BIRTH_DATE: dob,
            CITY: city,
            EMAIL: email,
            FIRST_NAME:first_name,
            GENDER:gender,
            LAST_NAME:last_name,
            PASSWORD: await hashPassword(password),
            PHONE_NUMBER: phone,
            STATE: state,
            USER_TYPE:'STUDENT',
            USERNAME:email,
            ZIP_CODE: zip
        }

       
        db.transaction(async (trns) => {

            var insert_id = await db.insertRow('USERS',users_data,trns)


        },async (error) => {

            res.status(500).json({
                message: 'An error occurred while processing your request.',
                error: error.message, // Or hide this in production for security.
              });


        })



        
    },
    async newInstructor(req,res){

    },
    async newOffice(req,res) {
    },


    async getDropdowns(req,res) {

        var {COURSES,DEL_METHODS} = (await db.multi_query(`
            SELECT  * FROM COURSES WHERE IS_ACTIVE = 1;
            SELECT * FROM COURSE_DELIVERY_METHODS WHERE IS_ACTIVE = 1;
            `,['COURSES','DEL_METHODS']
        ))


        res.json({COURSES,DEL_METHODS})
        



       
    }




}

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

export  {createAccount,public_sql}