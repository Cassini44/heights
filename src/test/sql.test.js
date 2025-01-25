import { db , pool} from "../models/db_model/config.js";



/*
req.user = {USER_ID: 1, FIRST_NAME: 'Nick', USER_TYPE: 'admin'
*/
/**
 * Adds two numbers together and returns the result.
 * @param {number} value1 - The first value
 * @param {number} value2 - The second value
 * @returns {string} The values that have been added together
 * @example
* const a = 10;
* const b = 20;
*
* const result = addNumbers(a, b);
* console.log(result);
* // Logs: 30
*/

function test() {
  
}















multi_query(`SELECT LAST_NAME, FIRST_NAME FROM USERS;SELECT LAST_NAME FROM USERS;`,['arr1','arr2'])
