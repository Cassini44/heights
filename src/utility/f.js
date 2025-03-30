import ejs from 'ejs';
import path from 'path';
import chalk from 'chalk';





export const f = {

    /**
     * 
     * @param {string} label Will print in red
     * @param {any} data Will print in blue---------------------
     */
    logger(label,data) {
        console.log( 
            chalk.dim.bold(`\n--- 🔎 ${label} -------------------------------------------------------------\n`) , 
            chalk.gray(data),
            chalk.dim.bold(`\n-------------------------------------------------------------------------------------\n`) ,  
        )
    },

    tableCleanup(y) {
        var filterindexes = y[0].reduce((acc, v, i) => {
            if (!v) {
            acc.push(i)
            }
            return acc
        }, [])
        return y.reduce((acc, v, i) => {
            var row = v.filter((v2, i2) => filterindexes.indexOf(i2) === -1)
            var is_not_emptyrow = row.join("")

            if (is_not_emptyrow) { acc.push(row) }

            return acc

        }, [])
    },


    arrayToObject(key,data) {
        var fields = data.shift()
        var key = fields.indexOf(key)
        return data.reduce((acc,v,i)=>{
            var rowkey = v[key]
            if(!rowkey) {return acc}
            acc[rowkey] = {}
            v.map((v2,i2)=>{
            if(i2 !== key) {
                acc[rowkey][fields[i2]] = v2
            }
            })
            return acc
        },{})
    },


  

  
  
    /**
         * Pulls a column
         * @param  {[]} array
         * @param  {any} index Either string column name OR index number
         * @param {boolean} [distinct] if true, only distinct values will be pulled
         * @param {boolean} [keep_header] if true, the header field will be included in results
         */
    pc(array, index, distinct,keep_header) {
        var r = []
        var typetest = typeof index === "string"
        typetest ? index = array[0].indexOf(index) : index = index;
        var len = array.length
        for (var i = 0; i < len; i++) {
        r.push(array[i][index])
        }
        if(!keep_header){r.shift()}
        if (distinct) {
        r = [...new Set(r)] //?
        }
        return r
    },
  
  
    
    includeHTML: (x) => {
        return HtmlService.createHtmlOutputFromFile(x).getContent();
    },
  
    /**
     * Nicely prints to console for debugging purposes
     * @param {object} obj 
     */
    printObject(obj) {
        console.log(JSON.stringify(obj, null, 2));
    },
  
  
    /**
        * @param {object} x Object should be in {ID : {PROP1:'A', PROP2:'B'} }
        * @param {string} name_first_col 
        */
    objectToArray(x, name_first_col) {
        var box = new Set()
        Object.keys(x).map((v) => {
            var k = Object.keys(x[v])//?
            k.map(v2 => { box.add(v2) })
        })
  
        var cols = [...box]//?
  
        var y = Object.keys(x).map((v, i) => {
            var c = x[v]
            var row = [v]
            cols.map((v2) => { row.push(c[v2] ?? '') })
            return row
        })
        y.unshift([name_first_col, ...cols])
        return y
  
    },

  
    distinctRows(x) {
        var s = new Set()
        return x.filter((v) => {
            var composite = v.join('')
            if(s.has(composite)){
                return false
            }else{
                s.add(composite)
                return true
            }
        })
    },
  
      
  
      /** var a = leftUnion([[A,B,C]] , [[A,C,B]], [[A,D,E]])
           * The output table will be A,B and C. For tables that dont have index of ABC, it will always be '' empty string
           * 
           */
      leftUnion(...x) {
          var drive_table = x.shift()
          var drivecolumns = drive_table[0]
          var keysets = x.reduce((acc,v) => {
              acc.push(drivecolumns.reduce((acc2,v2)=> {
                  acc2.push(v[0].indexOf(v2))
                  return acc2
              },[]))
              return acc
          },[])
          x.map((outer,table)=>{
              var z = outer.reduce((acc,v,i)=>{
                  if(!i){return acc}
                      acc.push(keysets[table].reduce((acc2,v2,i2)=>{
                          acc2.push(v[v2]??'')
                          return acc2
                      },[]))
                  return acc
              },[])
              drive_table = drive_table.concat(z)
          })
          return drive_table
      },
  
      /** Edit a single column using that columns value
       * @param {[[]]} data 2d array of data with index 0 as headers
       * @param {string} column string column name
       * @param {*} fcn function where the single argument is the columns current value. The return of this function is the new value
       * @returns [[]]
       * @example arrayEdit(data,'col2', ((v) => v+5)   )
       */
      arrayEdit(data, column, fcn) {
          var col = data[0].indexOf(column)
          return data.map((c, i) => {
              if (i) {
                  c[col] = fcn(c[col])//?
              }
              return c
          })
      },
  
      /**
           * Add a column to a data table based on other columns. This can also filter data by utilizing `this.remove = true`. Filtering cannot be done if using arrow function syntax
           * @param {[]} x 2d array, where index 0 are the headers
           * @param {Array|String} var_col_names Headers of columns that will corespond to paramaters of the callback function. If adding multiple columns, it must be a 1d array
           * @param {Array|String} new_col_names The name of columns being added. If adding multiple columns, it must be a 1d array. This must match the order in which columns are being returned from callback function
           * @param {function} fcn Callback function that will operate on each row other than the first. The params are based on `var_col_names`. The return value will be pushed to the data table row. 
           * If multiple columns are being added, the return value must be an array 
           * @example
      * //----------------------------------------
      * tableFcn( data,['COLOR','SHAPE'],['IS_RED'],((color,shape) => { return color === "RED" ? 'y' : 'n' }) )
      * tableFcn( data,['COLOR','SHAPE'],['IS_RED','IS_SQUARE'],((color,shape) => { return [color === "RED" ? 'y' : 'n',shape === "SQUARE" ? 'y' : 'n'] }) )
      * tableFcn( data,'COLOR','IS_RED',((color) => { return color === "RED" ? 'y' : 'n' }) ) //If only one param or one column is being added, it may be a string
      */
      arrayFormula(x, var_col_names, new_col_names, fcn) {
          function arrayIndex(array2d) {
              var headers = array2d[0];
              var obj = headers.reduce((acc, v, iter) => { acc[v] = iter; return acc }, {})
              return obj
          }
          var indx = arrayIndex(x)
          new_col_names = Array.isArray(new_col_names) ? new_col_names : [new_col_names]
          var_col_names = Array.isArray(var_col_names) ? var_col_names : [var_col_names]
          var multi_cols = new_col_names.length > 1
          var state = { remove: false }
          return x.reduce((acc, v, i) => {
              state.remove = false
              if (!i) {
                  v.push(...new_col_names)
                  acc.push(v)
              } else {
                  var params = var_col_names.map((c) => v[indx[c]])
                  var callback_results = fcn.apply(state, params)
                  callback_results = multi_cols ? callback_results : [callback_results]
                  state.remove//?
                  if (!state.remove) { v.push(...callback_results); acc.push(v) }
              }
              return acc
          }, [])
      },
  
  

  
  
      /** ### Return a cloned array of rows where the date makes the comparison function return true
       * - 1   = Equal to
       * - 2   = Less than
       * - 2.5 = Less than or equal to
       * - 3   = greater than
       * - 3.5 = Greater than or equal to
       * @param {[]} x 
       * @param {String} col string header to identify column
       * @param {Number} type type of filter
       * @param {*} date can be a string, new Date( ) or anything that goes into value( ). Used as the constant argument to each date in the table
       * @param {*} [offset_days] optionally specificy a positive or negative number to add to the 'date' variable.
       * @example 
       * ```
       * arrayFilterByDate(data,'FIRST_TIMESTAMP',1,'9/10/2023',-5) // the -5 turn 9/10 into 9/5
       * ```
      */
      arrayFilterByDate(x, col, type, date, offset_days = 0) {
          /**
               * 
               * @param {*} date Either a date object or date with or without time
               * @param {*} [onlydate] Will only use the date portion
               * @param {*} [roundhour] Will not use the minutes portion of a date. 8:30 becomes 8:00
               * 
               * @returns number
               */
          function value(date, onlydate, roundhour) {
              if (typeof date === 'string') {
                  if (!/:/.test(date)) {
                      date = `${date} 00:00:00`
                  }
              }
              date = onlydate ? new Date(new Date(date).setHours(0, 0, 0, 0)) : roundhour ? new Date(new Date(date).setMinutes(0, 0, 0)) : new Date(date)
              return 25569 + (date.getTime() - date.getTimezoneOffset() * 60000) / 86400000;
          }
          var date_col_indx = typeof col === 'string' ? x[0].indexOf(col) : col
          var date_argument = value(date, true) + offset_days
  
          var filter_types = {
              1: (a, b) => a === b,
              2: (a, b) => a < b,
              2.5: (a, b) => a <= b,
              3: (a, b) => a > b,
              3.5: (a, b) => a >= b
          }
          return x.reduce((acc, v, i) => {
              if (!i) { acc.push(v); return acc }
  
              var date_col = value(v[date_col_indx], true)
  
              var comparisonfunction = filter_types[type](date_col, date_argument)
  
              if (comparisonfunction) {
                  acc.push(v)
  
              }
              return acc
          }, [])
      },
  
      /**
       * Use array to manipulate other objects
       * @param {[]} x 2d array, where index 0 are the headers
       * @param {Array|String} var_col_names Headers of columns that will corespond to paramaters of the callback function. If adding multiple columns, it must be a 1d array
       * @param {function} fcn Callback function that will operate on each row other than the first. The params are based on `var_col_names`. The return value will be pushed to the data table row. 
       * If multiple columns are being added, the return value must be an array 
       * @example
          * //----------------------------------------
          * arrayScan(array,['COLOR','SHAPE'],((color,shape) => {
          *   object[color] = shape
          * }))
      */
      arrayScan(x, var_col_names, fcn) {
          function arrayIndex(array2d) {
              var headers = array2d[0];
              var obj = headers.reduce((acc, v, iter) => { acc[v] = iter; return acc }, {})
              return obj
          }
          var indx = arrayIndex(x)
          var_col_names = Array.isArray(var_col_names) ? var_col_names : [var_col_names]
          //var multi_cols = new_col_names.length > 1
          var state = { remove: false }
          x.map((v, i) => {
              if (i) {
                  var params = var_col_names.map((c) => v[indx[c]])
                  fcn(...params)
              }
          })
      },
  
      
      addIdColumn(x,id) {return x.map((v,i)=>{if(!i){v.push('ID_COLUMN')}else{v.push(id)};return v})},
  
      /**
       * 
       * @param {[]} x 2d array
       * @param {String} col string name of column
       * @param {Number} type 1 = string, 2 = number and 3 = date
       * @param {String} [order] if false or ommited, the lowest number / earliest date (farthest back in time) will be in index 1
       */
      arraySort(x, col, type, order) {
          var header = x.shift()
          var index = header.indexOf(col)
          const sortfunctions = {
              1(a, b) {
  
                  return a.localeCompare(b)
              },
              2(a, b) {
                  return a - b
              },
              3(a, b) {
                  return Date.parse(a) - Date.parse(b)
              }
  
          }
          x.sort((a, b) => {
              if (order) [a, b] = [b, a]
              return sortfunctions[type](a[index], b[index])
          })
          x.unshift(header)
      },
  
      arrayIndex(array2d) {
          var headers = array2d[0]
          var obj = headers.reduce((acc, v, iter) => {
          acc[v] = iter
          return acc
          }, {})
          return obj
      },
  
      /**
               * 6/16/22
               * @param {[][]} x 2d data array
               * @param {[]} y 1d array of string column headers. Use '=[ALIAS]' syntax to rename the column on the output
               * @param {boolean} [append_nonmatched] If set to true, appends the unused columns to the end of the array, in the original order
               * @returns 
               */
      forceTemplate2(x, y, append_nonmatched) {
          var key = []
          var non_key = []
          var currentHeaders = x[0]
          var i;
          for (i in y) {
          if (/=\[.*\]/.test(y[i])) {
              var match = y[i].match(/(.*)=\[(.*)\]/)
              var colname = match[1]
              var swapname = match[2]
              var indexnumber = currentHeaders.indexOf(colname)
              x[0][indexnumber] = swapname
              key.push(indexnumber)
  
          } else {
              key.push(currentHeaders.indexOf(y[i]))
          }
          }
  
          if (append_nonmatched) { currentHeaders.map((v, ind) => { !key.includes(ind) ? key.push(ind) : null }) }
  
  
          var y = x.map(function (value, index) {
  
          var box = []
          for (i in key) {
              box.push(value[key[i]])
          }
          return box
          })
          return y
      },
  
      
      /**
       * Provide a string and an array in the form of => [  [regex,'value if match'] , [regex2,'value if match2']  ]
       * @param {String} strg String being extracted from
       * @param {[]} array2d In the form of [   [/REGEX/,'RETURN THIS IF MATCHED'] , [/ANOTHER_REGEX/,'RETURN THIS IF MATCHED']   ]
       * @param {String} [nomatch] If no match is found, use this value. Defaults to 'NO_MATCH'
       * @returns 
       */
      regexLookup(strg,array2d,nomatch='NO_MATCH') {
          var result =  array2d.findIndex(v => v[1].test(strg))
          return result !== -1 ? array2d[result][0] : nomatch
      },
  

  
      toPercent(x) { return Number(x.toString().replace('.','').match(/\d{3}/)[0])+'%' }

  
  }


export const clock2 = {
    toMonth(x) {return new Date(x).toLocaleString('default', { month: 'long' })},

    toYearMonth(x) { return Utilities.formatDate(new Date(x), "EST", "yyyy-MM")   },

    /**
     * 
     * @param {*} date Either a date object or date with or without time
     * @param {*} [onlydate] Will only use the date portion
     * @param {*} [roundhour] Will not use the minutes portion of a date. 8:30 becomes 8:00
     * 
     * @returns number
     */
    value(date,onlydate,roundhour) {
        if(typeof date === 'string') {
            if(!/:/.test(date)){
                date = `${date} 00:00:00`
            }
        }
        date = onlydate ? new Date(new Date(date).setHours(0,0,0,0)) : roundhour ?  new Date(new Date(date).setMinutes(0,0,0)) : new Date(date)
        return 25569 + (date.getTime()-date.getTimezoneOffset()*60000)/86400000 ;
    },

    /** The opposite of clock.value(). If the date has a time component, it will utilize that and otherwise will be only a date string */
    valueToDateString(n) { 
      var d = new Date(((n-25569)*86400000)+(new Date().getTimezoneOffset()*60000))
      return (Math.round(n)===n) ? d.toLocaleDateString() : d.toLocaleString().replace(",","").replace(/\u202f/,' ')
    },

    /** 
     * In the form of : 5/30/2023 10:14:58
     * @param {string} [x] A string that can go into new Date( x ) 
     * 
     * Provide a value that can be converted to a date - returns a date string compatible with sheets. If left blank, does the same for the current time */
    timestamp(x) {
      var y=x?new Date(x.replace(/\u202f/,' ')):new Date();
      return y.toLocaleString().replace(",","").replace(/\u202f/,' ')
    },

    specializedFunctions : {
      changeTimeZoneReturnTime(x,timezone) { return new Date(x).toLocaleString("en-US",{timeZone:timezone}).replace(',','')},
      changeTimeZoneReturnDate(x,timezone) {return new Date(new Date(x).toLocaleString("en-US",{timeZone:timezone})).toLocaleDateString()},
      fix_string_timezone(x){
        if(typeof x === 'string' && /-/.test(x) ){x = x.replaceAll("-","/")}
        return x
       },


    },

    /**
       * Paramater is an object. Define the date group rules
       * Will return `OVER_${n}` where n is [0] of last index in GROUPS
       * 
       * @example
       * dateSpanGroups({
         DATE:'2023-05-15',
        GROUPS:[[0,'EXPIRED'],[30,'DAYS_0_30'],[61,'DAYS_31_61'],[92,'DAYS_62_92'],[183,'DAYS_93_183'],[364,'DAYS_184_364'],[725,'DAYS_365_725']],
        NO_DATE: 'NO_EXP_DATE'
        })
      */
    dateSpanGroups2({DATE,GROUPS,NO_DATE}) {
        var c = new Date()
        var d = new Date(clock.fix_string_timezone(DATE))
        var days_elapsed = clock.elapsed(c,d).days()
        if(isNaN(d)){return NO_DATE??'NO_DATE'} //if no date
        var last = 0
        var y = GROUPS.reduce((acc,v,i) => {
            if(acc){return acc}
            var n = v[0]
            var group = v[1]
            acc = (days_elapsed <= n)  ? group : acc
            last = n
            return acc
        },'')
        return y ? y : `OVER_${last}`
    
    },


    _FISCAL_ : {
        dval(x, dayVal) {
                try{
                if(typeof x === 'string' && /-/.test(x) ){x = x.replace("-","/")};
                return new Date(x).setHours(0, 0, 0, 0) / (dayVal ? 8.64e+7 : 1)
                }catch{return 0}
        },
        CALENDAR: '',
        GET_CALENDAR() {
            if(!clock._FISCAL_.CALENDAR) { 
                clock._FISCAL_.CALENDAR = j.$.getData('FISCAL')
            }
            return clock._FISCAL_.CALENDAR
        }
    },

    /**Input date string output fiscal values as object*/
    getFiscalValues(x) {
      return this._FISCAL_.GET_CALENDAR()[clock2._FISCAL_.dval(x)]
    },
    
    /** Maps fiscal dates to a 2d array.
     * @param {array} x  2d array
     * @param {string} date_col  name of column where date is located at
     * @param {array} [headers] A 1d array of column headers to replace the defaults. The order in which they are pushed into the array is 
     * ["YEAR_MONTH","YEAR_WEEK","YEAR_QTR","YEAR_WEEK_QTR"]
     */
    mapFiscalValues(x,date_col,headers = ['YEAR_MONTH','YEAR_WEEK','YEAR_QTR','YEAR_WEEK_QTR']) {
        var i = x[0].indexOf(date_col)
        var cal = clock._FISCAL_.GET_CALENDAR()
        return x.map( (v,ind ) => {
          if(!ind){
            v.push(...headers)
          }else{
            var {year_month,year_week,year_qtr,year_week_qtr} = cal[clock2._FISCAL_.dval(v[i])]?? {year_month:'',year_week:'',year_qtr:'',year_week_qtr:0}
            v.push(year_month,year_week,year_qtr,year_week_qtr)
          }
          return v
        })
    }

}


/*** STABLE v6.1
                 * @param {[]} data A 2D Array of data with headers in data[0]
                 * @param {string} statement Query statement using the syntax provided in the description
                 * @returns {[]} Output of query
                 * ----------------------
                 * # Syntax Reference
                 * 4/28/23 - Added the `||` construct which concats via the '~' tilde symbol before aggregation
                 * 3/18/23 - fixed bug where columns with $ signs could not be used in filter clause
                 * 8/2/22 Update
                 * 
                 * 
                 * query( ) allows you to groupby and aggregate 2d arrays
                 * using SQL like syntax. The basic form is as follows:
                 * ```
                 *  var transformed_data = query3(data,`
                 *  GROUPBY(Inventory Item Number => IFNULL(No Item)), 
                 *  SUM(On Hand quantity)/COUNTD(Locations)*COUNTD(Delivery Number),
                 *  'Column Alias' MIN(Lot Origination Date => DATE.WEEK),
                 *  FILTER(![ITEM NUMBER]A006094)
                 * `)
                 * ```
                 * 
                 * ## `Syntax:`
                 *  1. Commas between statements
                 *  2. Clause or agg function with a brace right next to it 
                 *  3. Within braces, column header and optionally an arrow `=>`  
                 *  to pass the value through a function before being evaluated (see scalar functions)
                 *  4. Use single quotes and add it after the closing brace before the comma to rename the column
                 *  5. Add an -ASC or -DESC at the end of a statement, before the comma to force sorting order
                 *  6. Use ? instead of arrow to simulate a CASE IF statement (see Case IF)
                 *  7. Supports (+) (-) (/) (*) (&) operations (alias must be infront of first column named)
                 *  8. Use || to concat values before aggregation
     
                * ## `Aggregate Functions`
                * GROUPBY( ) is used to determine what the data is being aggregated to
                * 1) SUM(  )
                * 2) MAX(  )
                * 3) MIN(  )
                * 4) COUNT(  )
                * 5) COUNTD(  )
                * 6) LISTAGG(  )
                * 7) AVG( )
                * 
                * ## `Scalar Functions`
                * 1) DATE
                * 2) DATE.FLAG - Does not change value but will cast as a date during evaluation
                * 3) DATE.DAY 
                * 4) DATE.WEEK
                * 5) DATE.QTR
                * 6) TIME.HOUR
                * 7) TIME.MINUTE
                * 8) TIME.SECOND
                * 9) REGEX.EXTRACT()
                * 10)REGEX.REPLACE()
                * 11)REGEX.COUNTIF()
                * 11)IFNULL()
                * 12)SPACER()
                * 
                * ## `Case IF`
                * SUM(QTY ? COLOR = .*Red.*) // Only add qty if the COLOR field test the provided regex
                * 
                * ## `Arithmatic operators`
                * (+) (-) (/) (*)
                * SUM(Completed)/COUNTD(Delivery) // Completed divided by Delivery
                * MAX( => IFNULL(5)) // If you want to use the number 5 in a calculation
                * 
                * ## `Concat operator (convert to string and concat columns)`
                * (&)
                * MAX(Order_Number) & MAX(Region) // => '11427548 EU'
                * 
                * ## `Concat pre aggregate (concat columns before functions are applied)`
                * (||)
                * GROUPBY( COLOR || SHAPE )
                * 
                * ## `Sort Order`
                * By default, sorts by the groupby() clause. To overide this, add a '-' and DESC or ASC. Case sensitive
                * "SUM(Quantity)-DESC"//Sorts by descending
                * "SUM(Quantity)-ASC"//Sorts by ascending
                * ```
                * 
                * ## `Filter:`
                * The FILTER( ) function can take multiple arguments, seperated by a semicolon `;`
                * There are 3 types of arguments that can be used:
                * 
                * 1) Regular expression test on entire row
                * 2) Regular expression test on a single column
                * 3) The BETWEEN(x AND y) function, which works with dates and integers.
                * 4) NOT NULL which tests if the field is blank (works with )
                * > The `!` operator negates the argument. "Filter out if NOT"
                * 
                * #### `BETWEEN() OPERATORS`
                * 3) The `*` operator, which denotes open ended
                * 4) The `TODAY` operator, which uses the current date of runtime
                * 
                * 
                * ```
                *  "FILTER(A006094)"//Filters out rows if regex is matched anywhere in a row
                *  "FILTER(!A006094)"//Filters out rows if regex is NOT matched anywhere in a row
                *  "FILTER([Inventory Item Description]A006094)" // Filters out rows if regex match within column
                *  "FILTER([Scheduled_Date]BETWEEN(9/7/21 AND 9/9/21))"//Filters out dates between
                *  "FILTER([Scheduled_Date]BETWEEN(9/7/21 AND *))"//Filters out dates from a date and anything beyond
                *  "FILTER(![Scheduled_Date]BETWEEN(9/7/21 AND 9/9/21))"// Not Between
                *  "FILTER([Scheduled_Date]BETWEEN(9/7/21 AND 9/9/21);A006094)"//Combining with semicolons
                *  "FILTER([Scheduled_Date]BETWEEN(TODAY AND 9/9/21);A006094)"//Combining with semicolons
                * 
                * ```
                * 
                *
                *
                *
            */
export function sql(data, statement, {listagg_delimeter=',',remove_headers=false}={}) {
 

    const rgx = {
        regex_to_parse_selections:  /([A-Za-z]+)(?<!\()\((.*)\)(?!\))/s,
        regex_to_parse_filter:      /FILTER(?<!\()\((.*)\)(?!\))/s,
        regex_to_parse_fnArgs:      /(?<func>.*)(?<!\()\((?<func_arg>.*)\)(?!\))/s,
        regex_to_parse_colOps:      /(?<=.*\))\s*(\+|\*|\/|\-|\&)\s*(?=.*\()/gs
    }

    //Container for utility functions
    const fobj = {

        interpretOperator : {
            ['+'](x,y){return Number(x) + Number(y)},
            ['-'](x,y){return x - y},
            ['/'](x,y){return x / y},
            ['*'](x,y){return x * y},
            ['&'](x,y){return `${x} ${y}`},
        },

        /**
        * @param {[][]} array2d 2 dimensional array with [0] being column headers
        * @returns Object
        */
        createIndexLookup(array2d) {
            var headers = array2d[0]
            var obj = headers.reduce((acc, v, iter) => {
                acc[v] = iter
                return acc
            }, {})
            return obj
        },

        initalize_fiscal_calendar: function () {
            this.fiscal_calendar = this._generateDateArray_("12/31/2016", 3000)
        },
        _generateDateArray_: function (start, days) {
            function arrayPc(array, index) {
            var r = []
            var typetest = typeof index === "string"
            typetest ? index = array[0].indexOf(index) : index = index;
            var len = array.length
            for (var i = 0; i < len; i++) {
                r.push(array[i][index])
            }
            return r
            }
            //This will allow us to use the weeknumber-1 to directly access the quarter number's related index
            var wds = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            var quarterLookup = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4
            ]


            var f = new Date(start)
            var box = []
            var ref = 0 // refernce to current "weeknumber" during for loop
            var ref_month = 1

            var weeknum = (x) => {
            if (x.getDay() === 0) {
                if (ref < 52) {
                ref = ref + 1
                } else if (ref === 52) {
                var lookbehind = new Date(x)
                lookbehind.setDate(x.getDate() - 20)
                var lby = lookbehind.getFullYear()
                ref = ([2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048].indexOf(lby) !== -1) ?
                    ref = 53 :
                    ref = 1

                } else if (ref === 53) {
                ref = 1
                }
            }
            return ref
            }
            for (var i = 1; i < days; i++) { // ----------------->

            var temp = []
            f.setDate(f.getDate() + 1)
            var _wk = weeknum(f)
            _wk = _wk < 10 ? `0${_wk}` : _wk //?
            var _q = quarterLookup[ref - 1]
            var _wkday = wds[f.getDay()]
            temp.push(
                f.toLocaleDateString(),
                _wkday,
                _wk,
                _q
            )
            box.push(temp) // -------------------->
            }
            var invalid_index_address = box.push(["Invalid Date", 0, 0, 0])


            var dates = arrayPc(box, 0)
            var robj = {
            fulltable: box,
            lookuptable: dates,
            invalid_index: invalid_index_address - 1
            }

            return robj
        },
        fiscal_calendar: "",
        convertToFiscalDate: function (a, b) {
            var fulltable = this.fiscal_calendar.fulltable
            var lookuptable = this.fiscal_calendar.lookuptable
            var invalid_index = this.fiscal_calendar.invalid_index

            var f_index = (b === 'DAY') ? 1 : (b === 'WEEK') ? 2 : 3 //get a bench for using object instead of ternary
            var ndate = new Date(a)
            var ndateindex = lookuptable.indexOf(ndate.toLocaleDateString())
            ndateindex = ndateindex !== -1 ? ndateindex : invalid_index


            if (b === "DAY") {
            return fulltable[ndateindex][f_index]
            }
            return `${ndate.getFullYear()}${fulltable[ndateindex][f_index]}`
        },
        convertToTime: function ($, TIMESTRING) {

            if (TIMESTRING) {
            return new Date($)
            }
            // actual
            var x = new Date($).getTime()
            //start of day
            var y = new Date(new Date($).setHours(0, 0, 0, 0)).getTime()

            let times = {

            sec: Math.round((x - y) / 1000),
            min: Math.round((x - y) / 1000 / 60),
            hour: Math.floor((x - y) / 1000 / 60 / 60)

            }
            return times
        },
        deepCopy: function (arr) {
            let copy = [];
            arr.forEach(elem => {
            if (Array.isArray(elem)) {
                copy.push(this.deepCopy(elem))
            } else {
                if (typeof elem === 'object') {
                copy.push(this.deepCopyObject(elem))
                } else {
                copy.push(elem)
                }
            }
            })
            return copy;
        },
        deepCopyObject: function (obj) {
            let tempObj = {};
            for (let [key, value] of Object.entries(obj)) {
            if (Array.isArray(value)) {
                tempObj[key] = this.deepCopy(value);
            } else {
                if (typeof value === 'object') {
                tempObj[key] = this.deepCopyObject(value);
                } else {
                tempObj[key] = value
                }
            }
            }
            return tempObj;
        },
        /**
        * Callback to Array.sort(). Allows sorting of 2d arrays by specifying the index. Parse dates if flag is set 
        * @param  {number} index index to sort by
        * @param  {boolean} is_ascending If true, used `ascending` order. Default is `descending`
        * @param {boolean} is_dateflag If true, date.parse will be used to compare values
        * @example [[2,"red"],[2,"blue"]].sort(sortFunction(0,false))
        */
        arraySort: (index, is_ascending, is_dateflag) => {

            if (!is_dateflag) {



            if (!is_ascending) {

                return function (a, b) {
                return b[index] - a[index]
                }
            } else {
                return function (a, b) {
                return a[index] - b[index]
                }
            }
            } else {
            if (!is_ascending) {

                return function (a, b) {
                return Date.parse(b[index]) - Date.parse(a[index])
                }
            } else {
                return function (a, b) {
                return Date.parse(a[index]) - Date.parse(b[index])
                }
            }

            }
        },
        /**
        * Use regular expressions to filter a 2 dimensional array.
        * @param  {array} data 2d array
        * @param  {} INCLUDE A string to be converted to a regex that must match something in the row
        * @param  {} EXCLUDE A string to be converted to a regex that must not match something in the row
        */
        arrayFilter2: function (data, INCLUDE, EXCLUDE) {

            // \B\b will never match anything.  
            var regINCLUDE = INCLUDE ? new RegExp(INCLUDE, 'i') : /./
            var regEXCLUDE = EXCLUDE ? new RegExp(EXCLUDE, 'i') : /\B\b/

            return data.filter((v) => {
            var e = v.join("").toUpperCase()
            return (regINCLUDE.test(e) && !regEXCLUDE.test(e))
            })
        },
        arrayFilter3: function (f, upperCased = false, doesNot) /*⚡*/ {

            function isBetweenDate(x, gteDate, lteDate) {
            x = new Date(x).setHours(0, 0, 0, 0)
            var gte = (gteDate) ? new Date(gteDate).setHours(0, 0, 0, 0) : 875764800000
            var lte = new Date(lteDate).setHours(0, 0, 0, 0)
            var tf = (gte > x) ? false : (lte >= x) ? true : false
            return tf
            }
            for (let i in f) {
            var doesnot, op_between_1, op_between_2, op_between_1_type, op_between_2_type, op_between_type;


            var filterArg = f[i]

            var COL$ = filterArg.match(/\[(.*)]/)[1]

            filterArg = filterArg.replace(/\[.*\]/, "")

            if (/^!/.test(filterArg)) {
                filterArg = filterArg.replace("!", "")
                doesnot = true
            } else {
                doesnot = false
            }
            var between = /BETWEEN/.test(filterArg)
            var notnull = /NOT NULL/.test(filterArg)
            if (between) {
                var between_args = filterArg.match(/BETWEEN\((?<TO>.*)AND(?<FROM>.*)\)/).groups

                op_between_1 = between_args.TO.trim()
                op_between_2 = between_args.FROM.trim()

                op_between_1 = (op_between_1 === "TODAY") ? j.time.daysFromNow(0) :
                (op_between_1 === "YESTERDAY") ? j.time.daysFromNow(-1) : (op_between_1 === "LASTWEEK") ? j.time.daysFromNow(-7) : op_between_1


                op_between_2 = (op_between_2 === "TODAY") ? j.time.daysFromNow(0) :
                (op_between_2 === "YESTERDAY") ? j.time.daysFromNow(-1) : (op_between_2 === "LASTWEEK") ? j.time.daysFromNow(-7) : op_between_2



                op_between_1_type = (isNaN(op_between_1) || op_between_1 instanceof Date) ? (op_between_1 === '%' ? "OPEN" : "DATE") : "NUMBER";
                op_between_2_type = (isNaN(op_between_2) || op_between_2 instanceof Date) ? (op_between_2 === '%' ? "OPEN" : "DATE") : "NUMBER";

                if (op_between_1_type === "DATE" && op_between_2_type === "OPEN") {
                op_between_2 = '10/15/2029'
                } else if (op_between_2_type === "DATE" && op_between_1_type === "OPEN") {
                op_between_1 = '10/2/1997'
                } else if (op_between_1_type === "OPEN" || op_between_2_type === "OPEN") {
                op_between_1 = (op_between_1_type === "OPEN") ? -1000000000 : Number(op_between_1)
                op_between_2 = (op_between_2_type === "OPEN") ? 1000000000 : Number(op_between_2)
                }

                op_between_type = (op_between_1_type === "DATE" || op_between_2_type === "DATE") ? "DATE" : "INTEGER"


            } else if (!notnull) {
                var regx = new RegExp(filterArg, "i") //?
            }

            f[i] = {
                $: COL$,
                NOT_NULL: notnull,
                REGX: regx,
                // The ! operator, filters rows that dont contain
                OP_NEGATION: doesnot,
                OP_BETWEEN: between,
                OP_BETWEEN_GTE: op_between_1,
                OP_BETWEEN_LTE: op_between_2,
                OP_BETWEEN_TYPE: op_between_type


            }


            }
            return function (value, index) {
            var box = []

            for (var i in f) {

                var filter_obj = f[i]
                var val = value[filter_obj.$]


                if (filter_obj.OP_NEGATION) {
                if (filter_obj.OP_BETWEEN) {
                    if (filter_obj.OP_BETWEEN_TYPE === "DATE") {

                    var tf = (val) ? (isBetweenDate(val, filter_obj.OP_BETWEEN_GTE, filter_obj.OP_BETWEEN_LTE)) : false
                    } else {
                    var tf = ((Number(val) >= filter_obj.OP_BETWEEN_GTE) && (Number(val) <= filter_obj.OP_BETWEEN_LTE))
                    }
                } else {
                    //!!!!!!!!!!
                    var tf = (filter_obj.NOT_NULL) ? val.length === 0 : (filter_obj.REGX.test(val))
                }
                } else {
                if (filter_obj.OP_BETWEEN) {
                    if (filter_obj.OP_BETWEEN_TYPE === "DATE") {
                    var tf = !((val) ? (isBetweenDate(val, filter_obj.OP_BETWEEN_GTE, filter_obj.OP_BETWEEN_LTE)) : true)
                    } else {
                    var tf = !((Number(val) >= filter_obj.OP_BETWEEN_GTE) && (Number(val) <= filter_obj.OP_BETWEEN_LTE))

                    }
                } else {
                    //!!!!!!!!
                    var tf = !((filter_obj.NOT_NULL) ? val.length === 0 : (filter_obj.REGX.test(val)))
                }
                }

                box.push(tf)

            }

            var x = !box.includes(false) //12 ms
            return x
            }
        },
        /**
        * turns [[1,2,3]] into [1,2,3]
        * @param  {[]} x 2d array
        */
        arrayFlat: (x) => {

            var merged = [].concat.apply(0, x);

            var remove1 = merged.filter(function (index) {
            return (index != 0 || index != '');
            })
            return remove1
        },
        sqlReplace: (h) => {
            return function (str, group1, group2) {
            var regxx = new RegExp(group1.replace('$','\\$'),"i")
            var colIndex = h.findIndex(v => regxx.test(v));
            return `[${colIndex}]`
            }
        }

    }

    function _Engine_(data, statement) {
        data = fobj.deepCopy(data)

        function SQL_PARSER() {
            var fields = data.shift().map((v) => v.toUpperCase())
            var fields_object = fobj.createIndexLookup([fields])

            
            let r = rgx.regex_to_parse_colOps
            var args = statement.split(",").map((v,ind)=>{
                if(r.test(v)) {
                    v.match(r).map((v2) => {
                        QP3.push({
                            indx1:ind,
                            indx2:ind+1,
                            operator:v2.trim()
                        })
                    })
                    v = v.replace(rgx.regex_to_parse_colOps,",")
                }
                return v
            })
            args = args.join(",").split(",")
            

            var counter = 0
            var acc_asign = {
                "LISTAGG": function () {
                    QP2.push({
                        indx: counter + 1,
                        convertFunction: function (s) {
                            var cnter = 0
                            return  ([...s].reduce((acc,str) => {
                            if(str) {
                                if(!acc){
                                acc = `${str}`
                                }else{
                                acc += `${listagg_delimeter||','}${str}`
                                }
                            }
                            return acc
                            },'').trim() || '-') 
                        }
                    })
                    return false
                },
                "MAX": 0,
                "MIN": false,
                "SUM": false,
                "COUNT": 0,
                "COUNTD": function () {
                    //Results for countD cannot be proccessed during the main loop
                    //This function provides Q2_PARAM an object describing how to 
                    //Get the count distinct while the object is being destructured
                    QP2.push({
                        indx: counter + 1,
                        convertFunction: function (s) {
                            //fixed on 6/7/22
                            return (typeof s === "object") ? [...s].filter(v => v+"").length : 0
                        }
                    })
                    return 0
                },
                "AVG": function () {
                    //Results for countD cannot be proccessed during the main loop
                    //This function provides Q2_PARAM an object describing how to 
                    //Get the count distinct while the object is being destructured
                    QP2.push({
                        indx: counter + 1,
                        convertFunction: function (s) {
                            var C = s.reduce((acc2, e) => {
                                if (e) {
                                    if (!isNaN(e)) {
                                        acc2.push(Number(e))
                                    }
                                }
                                return acc2
                            }, [])
                            return C.length > 0 ? (  C.reduce((acc, e) => {acc = acc + e;return acc},0) / C.length    ) : ''
                        }
                    })
                    return []
                },
            }

            args.map((v, ind) => {//~■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
            
                /*---------------------------------------------------------------------FILTER*/
                if (/FILTER/.test(v)) {

                    var regx = rgx.regex_to_parse_filter
                    var arg = v.match(regx)[1]
                    var indexFilter, lazyFilter;
                    var filters = arg.split(";").map(v => v.trim()).filter((v) => v)
                    var filterSplit = filters.reduce((acc, v) => {
                    /\[.*\]/.test(v) ? acc.indexFilter.push(v) : acc.lazyFilter.push(v);
                    return acc
                    }, {
                    indexFilter: [],
                    lazyFilter: []
                    })
                    //=Filter where index is considered
                    if (filterSplit.indexFilter[0]) {
                    indexFilter = filterSplit.indexFilter.map(v => {v = v.replace(/\[(.*)\]/, fobj.sqlReplace(fields));return v})
                    data = data.filter(fobj.arrayFilter3(indexFilter))
                    }
                    //=Filter where entire row is merged into 1 string and tested against a regex
                    if (filterSplit.lazyFilter) {
                        // Lazy filter (joins the whole row and tests for regex match)
                    var lazyFilter = filterSplit.lazyFilter.reduce((acc, v) => {
                        (/^!/.test(v)) ? acc.include.push(v.replace("!", "")) : acc.exclude.push(v)
                        return acc
                    }, {
                        include: [],
                        exclude: []
                    })
                    for (var i in lazyFilter) {
                        lazyFilter[i] = lazyFilter[i].length > 1 ? lazyFilter[i].join("|") : lazyFilter[i].toString()
                    }
                    data = fobj.arrayFilter2(data, lazyFilter.include, lazyFilter.exclude)
                    }
                    return; //If we are on the FILTER clause, filter the array and eject loop
                }
                /*---------------------------------------------------------------------FILTER*/
                var cmatch = v.match(rgx.regex_to_parse_selections)
                var agg_type = cmatch[1].trim() // GROUPBY, SUM, MAX, MIN.. 
                var arg = cmatch[2].trim() // (ITEM NUMBER) ... (LOT DATE => DATE.QUARTER)
            


                //⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞
                let _field, _func, sort_order, _func_arg,refcol,refcol2;
                if (!/=>|\?|\|\|/.test(arg)) {
                    _field = arg

                } else if(/=>/.test(arg)){
                    arg = arg.split("=>")
                    _field = arg[0].trim()
                    if (/\(/.test(arg[1])) { //4/16/22 update
                    var __func = arg[1].match(rgx.regex_to_parse_fnArgs).groups
                    _func = __func.func.trim()
                    _func_arg = __func.func_arg.trim()
                    } else {
                    _func = arg[1].trim()
                    }
                }else if(/\?/.test(arg)){
                    arg = arg.split("?")
                    _field = arg[0].trim()
                    var ifstatement = arg[1].split("=").map(v3=>v3.trim().toUpperCase())
                        refcol = fields_object[ifstatement[0]]
                        _func_arg = new RegExp(ifstatement[1],'i')
                        _func = "?"
                }else if(/\|\|/.test(arg)) {

                    var arg = arg.split('||')//?
                    _field = arg.shift().trim()//?
                    refcol2 = arg.map(  ( v3=> fields_object[v3.trim().toUpperCase()] )  )
                    _func = "COMPOSITE"
                }

                _field = _field.toUpperCase()
                var indx = fields.indexOf(_field.toUpperCase())
                //⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞⊞

                //COLS is offset from Q_PARAM becuase we are declaring the initial value before hand
                //acc_assign[agg_type] looks up the correct initial value for the accumulator
                
                
                if (!/GROUPBY|FILTER/.test(agg_type)) {
                    //--------------------------------------------||
                    if (/\-(DESC|ASC)/.test(v)) {
                    default_sort = false
                    sort_order = (/ASC/.test(v)) ? "ASC" : "DESC"
                    }
                    if(/'.*'/.test(v)){
                        _field = v.match(/'(.*)'/)[1]
                    }
                    var initiator = acc_asign[agg_type]
                    initiator = (typeof initiator === "function") ? initiator() : initiator
                    COLS.push(initiator)
                    counter++
                    //--------------------------------------------||
                } else if (/GROUPBY/.test(agg_type)) { //ADDED ON 9/6/21 TO FIX BUG THAT WOULD CHECK GROUPBY ASC DESC OPERAND
                    if (/\-(DESC|ASC)/.test(v)) {
                    default_sort = false
                    sort_order = (/ASC/.test(v)) ? "ASC" : "DESC"
                    }
                    if(/'.*'/.test(v)){
                        _field = v.match(/'(.*)'/)[1]
                    }
                    //--------------------------------------------||
                }
                HEADERS.push(_field)


                if (agg_type)
                    QP1.push({
                    sort_order: sort_order,
                    $: indx,
                    agg_type: agg_type,
                    convertFunction_type: _func,
                    fn_arg: _func_arg,
                    flag_datevalue: false,
                    refcolumn : refcol,
                    refcolumn2 : refcol2,
                    

                    /*CONVERT FUNCTION*/
                    convertFunction: function (current_row) {


                        var e = current_row[this.$]

                        var e2 = current_row[this.refcolumn]

                        if(this.refcolumn2){
                            var e3 = this.refcolumn2.reduce((s,u) => {  
                            return `${s}~${current_row[u]}`  
                            },e)
                        }

                        



                        const convFunctions = {
                            ["COMPOSITE"] : (e,e2,e3)  => {return e3},
                            ['?']: (e,e2) => {return this.fn_arg.test(e2) ? e : ''},
                            ['DATE']: (e) => { this.flag_datevalue = true; return new Date(e).toLocaleDateString() },
                            ["DATE.FLAG"]: (e) => { this.flag_datevalue = true; return e },
                            ["DATE.WEEK"]: (e) => fobj.convertToFiscalDate(e, "WEEK"),
                            ["DATE.QTR"]: (e) => fobj.convertToFiscalDate(e, "QTR"),
                            ["DATE.DAY"]: (e) => fobj.convertToFiscalDate(e, "DAY"),
                            ["TIME"](e) { this.flag_datevalue = true; return fobj.convertToTime(e, true) },
                            ["TIME.HOUR"]: (e) => fobj.convertToTime(e).hour,
                            ["TIME.MINUTE"]: (e) => fobj.convertToTime(e).min,
                            ["TIME.SECOND"]: (e) => fobj.convertToTime(e).sec,
                            ['REGEX.EXTRACT']: (e) => e.match(new RegExp(this.fn_arg))?.[0] ?? '',
                            ['REGEX.REPLACE']: (e) => e.replace(new RegExp(this.fn_arg)),
                            ['REGEX.COUNTIF']: (e) => new RegExp(this.fn_arg).test(e) ? 1 : 0,
                            ['IFNULL']: (e) => e || this.fn_arg,
                            ['SPACER']: () => ''
                        }
                        return convFunctions[this.convertFunction_type](e,e2,e3)
                    }
                    })
            })//~■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        }

        //statement = statement.toUpperCase()
        // if (/DAY|WEEK|QTR/.test(statement)) {fobj.initalize_fiscal_calendar()}
        var default_sort = true
        var QP1 = []
        var QP2 = []
        var QP3 = []
        var HEADERS = [] // If length === 0, no aggregates were selected
        let COLS = []
        
        SQL_PARSER()
        
        
        var groupfunction = data.reduce((acc, v) => {
            let ref
            

            //For each argument
            QP1.reduce((ref, f, depth) => {
                
            var val;
            

            if (f.convertFunction_type) {

                

                val = f.convertFunction(v)
                
            
            } else {
                val = v[f.$]
            }

            
            if (depth === 0) {

                

                
                ref = (!acc.hasOwnProperty(val)) ? acc[`${val}`] = fobj.deepCopy(COLS) : acc[`${val}`]
                
            } else {
                
                
                switch (f.agg_type) {
                // ref[depth-1] = Current Value => 
                // val = Incoming value
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻;
                case "COUNT":

                    ref[depth - 1]++
                    break;
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻;
                case "COUNTD":

                    if (ref[depth - 1] === 0) {
                    ref[depth - 1] = new Set()
                    ref[depth - 1].add(val)
                    } else {
                    ref[depth - 1].add(val)
                    }
                    break;
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻;
                case "SUM":
                    
                    ref[depth - 1] = ((Number(ref[depth - 1]) || 0) + (Number(val) || 0))
                    break;
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻; 
                case "LISTAGG":

                    if (!ref[depth - 1]) {
                    ref[depth - 1] = new Set()
                    ref[depth - 1].add(val)
                    }

                    ref[depth - 1].add(val)
                    break;
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻; 
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻; 
                case "AVG":
                    ref[depth - 1].push(val)
                    break;
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻; 
                case "MAX": //If the datevalue is set during query evaluation, cast values as numbers (milliseconds since 1970 something)
                    if (f.flag_datevalue) {
                    ref[depth - 1] = (Date.parse((ref[depth - 1] || val)) > Date.parse(val)) ? ref[depth - 1] : val
                    } //the initial value of MAX and MIN is false so that we can short circuit the first evaluation
                    else {
                    ref[depth - 1] = ((ref[depth - 1] || val) > val) ? ref[depth - 1] : val
                    }
                    break;
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻;
                case "MIN":

                    if (f.flag_datevalue) {
                    ref[depth - 1] = (Date.parse((ref[depth - 1] || val)) < Date.parse(val)) ? ref[depth - 1] : val
                    } else {
                    ref[depth - 1] = ((ref[depth - 1] || val) < val) ? ref[depth - 1] : val
                    }
                //◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻       
                }

            }
            return ref
            }, ref = 0)
            return acc
        }, {})

        var y = Object.entries(groupfunction)
        var q2len = QP2.length
        var q3len = QP3.length//?
        
        y = y.reduce((acc, v) => {
            v = v.flat()

            for (var i = 0; i < q2len; i++) {
            var ref = QP2[i]
            v[ref.indx] = ref.convertFunction(v[ref.indx])
            }
            for (var i = 0; i < q3len; i++) {
                var op = QP3[i]//?
                v.splice(op.indx1,2,fobj.interpretOperator[op.operator](v[op.indx1],v[op.indx2]))
            }

            acc.push(v)
            return acc
        }, [])

        /* If no sort order is specified, default_sort remains true and the array will be ordered by column 1*/
        if (default_sort) {
            if (QP1[0].flag_datevalue) {

            QP1[0].sort_order === "ASC" ?
                y.sort((a, b) => {
                return Date.parse(a[0]) - Date.parse(b[0])
                }) :
                y.sort((a, b) => {
                return Date.parse(b[0]) - Date.parse(a[0])
                })
            } else if (/QTR|WEEK/.test(QP1[0].convertFunction_type)) {
            QP1[0].sort_order === "ASC" ?
                y.sort((a, b) => {
                return Number(a[0]) - Number(b[0])
                }) :
                y.sort((a, b) => {
                return Number(b[0]) - Number(a[0])
                })

            } else {
            QP1[0].sort_order === "ASC" ?
                y.sort((a, b) => {
                if(typeof a[0] === 'string' && typeof b[0] === 'string'){
                    return a[0].localeCompare(b[0])
                }
                return a[0] - b[0]
                }) :
                y.sort((a, b) => {
                if(typeof a[0] === 'string' && typeof b[0] === 'string'){
                    return b[0].localeCompare(a[0])
                }
                return b[0] - a[0]
                })

            }
        } else {
            QP1.map((v, ind) => {
            if (v.sort_order) {
                if (v.flag_datevalue) {
                v.sort_order === "ASC" ?
                    y.sort((a, b) => {
                    return Date.parse(a[ind]) - Date.parse(b[ind])
                    }) :
                    y.sort((a, b) => {
                    return Date.parse(b[ind]) - Date.parse(a[ind])
                    })
                } else if (/QTR|WEEK/.test(v.convertFunction_type)) {
                v.sort_order === "ASC" ?
                    y.sort((a, b) => {
                    return Number(a[ind]) - Number(b[ind])
                    }) :
                    y.sort((a, b) => {
                    return Number(b[ind]) - Number(a[ind])
                    })
                } else {
                v.sort_order === "ASC" ?
                    y.sort((a, b) => {
                    if(typeof a[ind] === 'string' && typeof b[ind] === 'string'){
                        return a[ind].localeCompare(b[ind])
                    }
                    return a[ind] - b[ind]
                    }) :
                    y.sort((a, b) => {
                    if(typeof a[ind] === 'string' && typeof b[ind] === 'string'){
                        return b[ind].localeCompare(a[ind])
                    }
                    return b[ind] - a[ind]
                    })
                }
            }
            })
        }
        var headerscopy = fobj.deepCopy(HEADERS)

        QP3.map((v, ind) => {
        HEADERS = HEADERS.filter((o, i) => { return i !== v.indx2 })
        })

        y.unshift(HEADERS)
        return y
    }



    var result_set = _Engine_(data, statement)

    if(remove_headers) {
        result_set.shift()
    }

    return result_set


}




