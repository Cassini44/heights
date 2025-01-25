import { db , pool} from "../models/db_model/config.js";
import express from 'express';



/*
req.user = {USER_ID: 1, FIRST_NAME: 'Nick', USER_TYPE: 'admin'


var delivery_methods =  (await db.secure_query(` SELECT 1  `)).asArray()
*/




export default  {


    admin : {

        async getAdminData(req,res) {

            var users_table = (await db.secure_query(`
                SELECT
                    USER_ID,
                    CREATION_DATE,
                    FIRST_NAME,
                    LAST_NAME,
                    PHONE_NUMBER,
                    USER_TYPE,
                    ADDRESS_1,
                    ADDRESS_2,
                    BIRTH_DATE,
                    CITY,
                    EMAIL,
                    GENDER,
                    IS_LEGACY,
                    PASSWORD_RESET_FLAG
                FROM USERS
                ORDER BY CREATION_DATE DESC 
                
            `)).asArray()

            var locations_table  = (await db.secure_query(`
                SELECT
                    LOCATION_NAME,
                    ADDRESS_1,
                    ADDRESS_2,
                    CITY,
                    COURSE_LOCATION_ID,
                    IS_ACTIVE,
                    STATE,
                    ZIP_CODE
                FROM LOCATIONS`
            )).asArray()

            var delivery_methods =  (await db.secure_query(`
                SELECT 
                    DM.COURSE_DELIVERY_METHOD_ID,
                    DM.COURSE_ID,
                    C.COURSE_NAME,
                    DM.CREATION_DATE,
                    DM.DELIVERY_METHOD,
                    DM.IS_ACTIVE
                FROM COURSE_DELIVERY_METHODS DM LEFT JOIN COURSES C ON DM.COURSE_ID = C.COURSE_ID
            `
            )).asArray()

            var class_locations =  (await db.secure_query(`
                SELECT * FROM COURSE_DELIVERY_CLASS_LOCATIONS
            `
            )).asArray()

            var courses = (await db.secure_query(`SELECT * FROM COURSES`)).asArray();

            res.json({
              data: {
                courses_table: courses,
                users_table,
                locations_table,
                class_locations,
                delivery_methods
              },
            });


        },


         /* -------------------------------------------------------------------------- */
        
        /**
             * Example route with types
             * @param {import('express').Request} req - The request object
             * @param {import('express').Response} res - The response object
             */
        async setLookupTable(req,res) {
            var input = req.body.data
           
            var upsert = await db.upsertRows('LOOKUP',input)

            res.json({data:req.body,user:req.user})

        
        },

        async setLocationTable(req,res) {
            var input = req.body.data
           
            var upsert = await db.upsertRows('LOCATIONS',input)

            res.json({data:req.body,user:req.user})
        
        },

        /* -------------------------------------------------------------------------- */


    },


    office : {



    },


    instructor : {



    },


    student : {



    },

    






















}












