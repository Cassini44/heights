
//=Imports
  import dotenv from 'dotenv';
  import mysql from 'mysql2/promise';
  import fs from 'fs';
  import path from 'path';
  import { performance } from 'node:perf_hooks';
  import { f } from '../../utility/f.js';

//=Configure dotenv
  dotenv.config();



//=Get SSL certs
  const caCertPath = path.join(process.cwd(), 'ssl', 'ca-cert.pem')
  const clientCertPath = path.join(process.cwd(), 'ssl', 'client-cert.pem');
  const clientKeyPath = path.join(process.cwd(), 'ssl', 'client-key.pem');
  const caCert = fs.readFileSync(caCertPath)
  const clientCert = fs.readFileSync(clientCertPath);
  const clientKey = fs.readFileSync(clientKeyPath);


//=Create connection
/** @type {import('mysql2/promise').Pool} */
const pool = mysql.createPool({
    
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    multipleStatements: true,
    // dateStrings: true,
    timezone: 'Z',
    rowsAsArray: true,
    ssl: {
      ca: caCert,
      cert: clientCert,
      key: clientKey,
      // rejectUnauthorized: false  // Add this line
    }
});







const db = {
  /**
   *
   * @param {string} sql Sql query.
   * @param {[]} params
   * @example
   * // x will go in the first question mark and y will go in the second
   * secure_query('SELECT COL FROM TABLE WHERE COL2 = ? AND COL3 = ?',[x,y])
   */
  async secure_query(sql, params) {
    try {
      const [rows, fields] = await pool.execute(sql, params);
      return {
        isEmpty() {
          return rows.length === 0;
        },

        asObjSingleRow() {
          try {
            const headers = fields.map((field) => field.name);
            const data = rows[0].reduce((acc, v, i) => {
              acc[headers[i]] = v;
              return acc;
            }, {});
            return data;
          } catch {
            return false;
          }
        },

        asArray() {
          const headers = fields.map((field) => field.name);
          const data = rows.map((row) => Object.values(row));

          return [headers, ...data];
        },
        asLOV() {
          var data = rows.map((row) => Object.values(row));
          return data.map((v) => v[0]);
        },
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
     * 
     * @param {string} sql Sql query.
     * @param {[]} return_keys 1d array of strings. Should be equal to the number of statements. index 0 will be the object key to that data array
     * @param {[]} (params) 1d array of values
     * @example
     * // subs ? as they appear in the literal text. first question mark = argument   index 0
     * var {result1,result2} = multi_query(`
     * SELECT COL FROM TABLE WHERE COL2 = ? AND COL3 = ?;
     * SELECT COL FROM TABLE2 WHERE COL2 = ? AND COL3 = ?;
     * `,['result1','result2'],[a,b,c,d] 
     * )*/
  async multi_query(sql, return_keys, params) {
    const [rows, fields] = await pool.query(sql, params);

    var results = rows.map((v, i) => {
      const headers = fields[i].map((field) => field.name);
      const data = v.map((row) => Object.values(row));
      return [headers, ...data];
    });

    return return_keys.reduce((acc, v, i) => {
      acc[v] = results[i];
      return acc;
    }, {});
  },


  async upsertRows(tableName, array, keyColumn, transaction) {
    if (!array.length || array.length < 2) {
        return;
    }

    const context = transaction || pool;

    // Extract headers (first row)
    const columns = array[0];

    // Extract values (remaining rows) and replace undefined with NULL
    const dataRows = array.slice(1).map(row =>
        row.map(value => (value === undefined ? null : value))
    );
    if (!dataRows.length) {
        console.log("❌ No valid data rows found.");
        return;
    }
    console.log("📊 Data Rows:", dataRows);

    // Ensure keyColumn exists
    if (!columns.includes(keyColumn)) {
        console.error(`❌ Key column '${keyColumn}' does not exist in headers.`);
        throw new Error(`Key column '${keyColumn}' must exist in data headers.`);
    }
    
    console.log(`✅ Key column '${keyColumn}' found.`);

    // **Step 1: Generate UNION ALL for batch processing (Keep working UPDATE statement)**
    const selectStatements = dataRows
        .map(() => `SELECT ${columns.map(() => '?').join(', ')}`)
        .join(' UNION ALL ');

    const values = dataRows.flat();

    // **Step 2: Keep Your Working UPDATE Query**
    const updateSql = `
        UPDATE ${tableName} AS t
        INNER JOIN (
            ${selectStatements}
        ) AS new_data (${columns.join(', ')})
        ON t.${keyColumn} = new_data.${keyColumn}
        SET ${columns
            .filter(col => col !== keyColumn)
            .map(col => `t.${col} = new_data.${col}`)
            .join(', ')};
    `;

    // **Step 3: Correct INSERT using VALUES**
    const valuePlaceholders = dataRows.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
    
    const insertSql = `
        INSERT IGNORE INTO ${tableName} (${columns.join(', ')})
        VALUES ${valuePlaceholders}
        ;
    `;

    try {


       
        // const result = await context.query( `${updateSql}${insertSql}`, [...values]); // Run insert separately

        
        

        const [result_update] = await context.execute(updateSql, [...values]); // Run update first
        const [result_insert] = await context.execute(insertSql, [...values]); // Run insert separately

        //result.affectedRow

        

        console.log( {action: 'BATCH_UPSERT ✔️', info : `
          Updated:${result_update.info}\n
          Inserted:${result_insert.info}

        `})

    } catch (error) {
        console.error("❌ Batch Upsert Error:", error);
        console.error("🛠 SQL Query:\n", updateSql, "\n", insertSql);
        console.error("🔢 SQL Parameter Values:", [...values, ...values]);
        throw error;
    }
  },

  /**
   * 
   * @param {string} tableName name of table
   * @param {string} keyColumn the field by which you are deleting on. the values you add in the keys paramater match this field in order to delete
   * @param {[]} keys 1d array of values as they appear in the column defined in keyColumn
   * @param {object} [transaction] include the transaction object, if applicable
   */
  async deleteRows(tableName,keyColumn,keys,transaction) {
    const context = transaction || pool;

    var query = `DELETE FROM ${tableName} WHERE ${keyColumn} IN (${keys.map(() => '?').join(', ')})`

    context.execute(query,keys)



  },







  /**
   * Dynamically inserts a row into a table based on the provided data.
   * @param {String} tableName - The name of the table.
   * @param {Object} data - The data to insert (key-value pairs).
   */
  async insertRow(tableName, data, transaction) {
    const context = transaction || pool;

    // Get the columns from the keys of the data object
    const columns = Object.keys(data);

    // Create the placeholder string for the values
    const placeholders = columns.map(() => "?").join(", "); // Creates (?, ?, ?)

    // Create the SQL query dynamically
    const sql = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    // Get the values from the data object
    const values = Object.values(data);

    // Execute the query

    const [result] = await context.execute(sql, values);

    return result.insertId; // Return the insert ID of the new row
  },



  async transaction(fcn, onFailure) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await fcn(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Transaction failed, rolling back:", error);
      onFailure(error);
    } finally {
      console.log("Releasing connection");
      connection.release();
    }
  },
};



  
//=Keep Alive
setInterval(async () => {
  try {
        const start = performance.now(); // Start time
        await pool.execute('SELECT 1');
        const end = performance.now(); // End time
        console.log(`DB pool is still good. Query took ${(end - start).toFixed(2)} ms`);
  } catch (error) {
      console.error('Keep-alive failed:', error);
  }
}, 60000); // Run every 60 seconds





  



// test()//?


export { pool, db };



