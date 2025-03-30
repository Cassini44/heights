import { db , pool} from "../models/db_model/config.js";
import express from 'express';



/*
req.user = {USER_ID: 1, FIRST_NAME: 'Nick', USER_TYPE: 'admin'


var delivery_methods =  (await db.secure_query(` SELECT 1  `)).asArray()
*/

//!test
//

export default  {


    admin : {
        /* Gets the initial data for an admin login. */
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
                    LOCATION_TYPE,
                    CITY,
                    LOCATION_ID,
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
                SELECT
                LOCS.LOCATION_NAME,
                LOCS.LOCATION_TYPE,
                CDML.IS_ACTIVE,
                CDM.COURSE_DELIVERY_METHOD_ID,
                COURSE_DELIVERY_CLASS_LOCATION_ID
                FROM COURSE_DELIVERY_CLASS_LOCATIONS CDML
                LEFT JOIN LOCATIONS LOCS ON CDML.LOCATION_ID = LOCS.LOCATION_ID
                LEFT JOIN COURSE_DELIVERY_METHODS CDM  ON CDM.COURSE_DELIVERY_METHOD_ID = CDML.COURSE_DELIVERY_METHOD_ID
                LEFT JOIN COURSES C ON C.COURSE_ID = CDM.COURSE_ID;
            `
            )).asArray()

            var delivery_hours_cost = (await db.secure_query(`
                SELECT
                    CST.COURSE_DELIVERY_COST_ID, 
                    CST.COURSE_DELIVERY_METHOD_ID, 
                    CST.HOURS, 
                    CST.COST, 
                    CST.IS_ACTIVE, 
                    CST.CREATION_DATE
                FROM COURSE_DELIVERY_HOURS_COST CST

            `
            )).asArray()


            var courses_all = (await db.secure_query(`
                SELECT 
                C.COURSE_NAME,
                CD.DELIVERY_METHOD,
                CDHC.HOURS,
                CDHC.COST,
                CDHC.COURSE_DELIVERY_COST_ID
                FROM COURSES C
                LEFT JOIN COURSE_DELIVERY_METHODS CD ON CD.COURSE_ID = C.COURSE_ID
                LEFT JOIN COURSE_DELIVERY_HOURS_COST CDHC ON CDHC.COURSE_DELIVERY_METHOD_ID = CD.COURSE_DELIVERY_METHOD_ID
            `
            )).asArray()

            var packages_all = (await db.secure_query(`
               SELECT * FROM PACKAGES;
            `
            )).asArray()

            
            var package_courses = (await db.secure_query(`
                SELECT * FROM PACKAGE_COURSES;
            `
            )).asArray()


            var courses = (await db.secure_query(`SELECT * FROM COURSES`)).asArray();

            res.json({
              data: {
                courses_table: courses,
                users_table,
                locations_table,
                class_locations,
                delivery_methods,
                delivery_hours_cost,
                courses_all,
                packages_all,
                package_courses
              },
            });


        },

        /* -------------------------------------------------------------------------- */

        // Upload from the courses page
        /**
         * 
         * @param {express.Request} req 
         * @param {express.Response} res 
         */
        async setCourses(req,res) {
            
            console.log(global.isDev)

            var {COURSES,
                COURSE_DELIVERY_CLASS_LOCATIONS,
                COURSE_DELIVERY_METHODS,
                COURSE_DELIVERY_HOURS_COST
             } = req.body.data

                console.log(COURSES,COURSE_DELIVERY_CLASS_LOCATIONS,COURSE_DELIVERY_METHODS)

                db.transaction(async(trns)=>{

                    await db.upsertRows('COURSES',COURSES,'COURSE_ID',trns);

                    await db.upsertRows('COURSE_DELIVERY_METHODS',COURSE_DELIVERY_METHODS,'COURSE_DELIVERY_METHOD_ID',trns);

                    await db.upsertRows('COURSE_DELIVERY_CLASS_LOCATIONS',COURSE_DELIVERY_CLASS_LOCATIONS,'COURSE_DELIVERY_CLASS_LOCATION_ID',trns);    

                    await db.upsertRows('COURSE_DELIVERY_HOURS_COST',COURSE_DELIVERY_HOURS_COST,'COURSE_DELIVERY_COST_ID',trns);


                },async(error)=>{

                    res.status(500).json({
                        message: 'An error occurred while processing your request.',
                        error: error.message, // Or hide this in production for security.
                       });


                })

                res.end()

                

                

                
            



            


        },


        

        /* -------------------------------------------------------------------------- */
        
        

        async setLocationTable(req,res) {
            var input = req.body.data

            console.log(input)
           
            var upsert = await db.upsertRows2('LOCATIONS',input,'LOCATION_ID')

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












