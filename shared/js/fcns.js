
/**
 * 
 * @param {string} id The queryselector arg to find the element of tableLayout: 
 * @param {[][]} y 2d array of data where first index is headers
 * @param {string} formatfcn name of formatting function found in the loadtables object
 * @param {string} scrollheight argument given to scrollY, locks the height of the table body to a certain ammount and creates a scrollbar
 */
function createDataTable(id,y,formatfcn,scrollheight,width="25px") {

    if(formatfcn) { y = loadTables.formatFunctions[formatfcn](y) }
   

    
    if(document.querySelector(id)){
    var cols = y.shift().map(v => { return {title:v,"width":width}})
    new DataTable(id, {
        scrollY : scrollheight??'',
        columns: cols,
        data: y,
        searching:false,
        ordering:false,
        lengthChange: false,
        info:false,
        paging:false,
        autoWidth: false,
    });
    }
}


/* -------------------------------------------------------------------------- */








/**Utility functions */
const j = {

    async GET(path,json) {

        return await fetch(path, {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(json),
         });
         
     },
     async POST(path,json) {
         return await fetch(path, {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(json),
         });
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
            var obj = headers.reduce((acc, v, iter) => {acc[v] = iter;return acc}, {})
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
    /**
     * 
     * @param {string} txt Describes the console log
     * @param {*} value value to be logged
     */
    l(txt,value) { 
        console.log(`%c${txt}`,'color: blue; font-weight: bold;',value)
    },

    /* Provide email, tests if it looks like an email. Returns boolean */
    validateEmail(x){
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(x||'no')
    },

    /**
     * 
     * @param {Element} x sets visibility style to 'hidden' and disables the button
     */
    disableAndHideBtn(x) {
        x.style.visibility = 'hidden'
        x.disabled = true
    },
    /**
     * 
     * @param {Element} x sets visibility style to 'visible' and enables the button
     */
    enableAndShowBtn(x) {
        x.style.visibility = 'visible'
        x.disabled = false
    },

    

    isEmail(x) {return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(x)},

    /**
     * 
     * @param {string} css_selector query selector string
     * @returns 1d array of html elements
     */
    q(css_selector) {return [...document.querySelectorAll(css_selector)]},

    /**
     * getElementById
     * @param {string} id element ID 
     * @returns element
     */
    $(id) {return document.getElementById(id)},


    getClientRect(id) {return j.$(id).getBoundingClientRect()},

    /**
     * 
     * @param {Function} fcn this function runs when the page loads
     */
    runOnPageLoad(fcn) {window.addEventListener('load',fcn)},

    tsvToArray(x) { return x.split('\r\n').map(v=>v.split('\t')) },

    /**
     * 
     * @param {string} html_string string to be added to end of html body for current page
     */
    insertHTML(html_string) {[...document.getElementsByTagName('body')][0].insertAdjacentHTML('beforeend', html_string);},

    detectMobile() {
        const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i,
        ];
      
        return toMatch.some((toMatchItem) => {
          return navigator.userAgent.match(toMatchItem);
        });
    },

    /**
     * 
     * @param {string} x name of css variable within :root
     * @param {string} [value_to_change]  if present, will set the css variable to this new value
     */
    cssVar(x,value_to_change) {
        var root = document.documentElement;
        var current_value = getComputedStyle(document.querySelector(':root')).getPropertyValue(x);
        
        if(value_to_change){
            root.style.setProperty(x,value_to_change)
        }
        var new_current_value = root.style.getPropertyValue(x)
        console.log(`${current_value} ----> ${new_current_value}`)
        return new_current_value||current_value
    },

    /**
     * @param {string} x Value that will be wrappe din <span> tags
     * @param {string} [span_attributes] Set the attributes for the span such as class. This will be inserted directly into the html text. A valid example: `class="test"`
     */
    wrapInSpan(x,span_attributes) {
        return `<span ${span_attributes||''}>${x}</span>`
    },

    getPageName() {
        return window.location.pathname.split("/").pop().replace('.html','');
    },
    
    sql(data, statement) {

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
                                    acc += `,${str}`
                                    }
                                }
                                return acc
                                },'').trim() || '-') 
                            }
                        })
                        return false
                    },
                    "MAX": 0,
                    "MIN": Infinity,
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
                                return (C.reduce((acc, e) => acc + e) / C.length)
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
            if (/DAY|WEEK|QTR/.test(statement)) {fobj.initalize_fiscal_calendar()}
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
                            ref[depth - 1] = (ref[depth - 1] === undefined || Date.parse(ref[depth - 1]) > Date.parse(val)) ? val : ref[depth - 1];
                        } else {
                            ref[depth - 1] = (ref[depth - 1] === undefined || ref[depth - 1] > val) ? val : ref[depth - 1];
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
    
    
    
        return _Engine_(data, statement)
    }
    



}






/** 
 The point of this is to replace the loading spinner 
 with the content only after all iframes are loaded
*/
var iframeLoadCheck = 0
var num_of_iframes;
/** 
    Each iframe, generated as a web component, based off of the defined the locations/programs object 
    on the js/components page has this as its onload function. 
    Each time an iframe loads, it incremements iframeloadcheck. 
    Each load will test whether iframeloadcheck is equal
    to the number of iframes within the document
*/
function registerIframeLoad() {
    const iframesCount = [...document.querySelectorAll('iframe[data-hds_iframe="1"]')].length
    iframeLoadCheck++
    console.log(iframeLoadCheck)
    if(iframesCount === iframeLoadCheck){
        document.getElementById('location-load-spinner').style.display = 'none'
        document.getElementById('hds-locations-outermost-container').style.display = 'grid'

    }
}


/* -------------------------------------------------------------------------- */









