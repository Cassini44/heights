const web = {

    swapColumnName(arr,oldcolname,newcolname) {
        arr[0][arr[0].indexOf(oldcolname)] = newcolname;
        return arr
    },


    clone2DArray(arr) {
        return arr.map(subArr => [...subArr]);
    },

    /**
     * Generate a {KEY : VALUE} object from a 2d data table
     * @param {[[]]} array 2d array of table data with headers
     * @param {string} keycolumn the column to use as the key
     * @param {string} valuecolumn the value to the key
     * @returns {}
     */
    createLookupObjectFromTable(array,keycolumn,valuecolumn) {
        var key = array[0].indexOf(keycolumn)
        var value = array[0].indexOf(valuecolumn)
        return array.reduce((acc,v,i)=>{
            if(i){
                acc[v[key]] = v[value]
            }
            return acc
        },{})

    },

    copyToClipBoard(x) {
        navigator.clipboard.writeText(x).then(() => {
            console.log("Text copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    },

    /**
     * Adds a class to any selectors that match a selector
     * @param {*} css_selector If it matches this selector, the class will be added to it
     * @param {*} classname Classname to add to matches
     */
    addClassTo(css_selector,classname) {
        web.q(css_selector).map((v)=>{
            v.classList.add(classname)
        })
    },

    /**
     * Any element with this class will have it removed
     * @param {string} x class name without a dot
     */
    removeClassFromAll(classname) {
        web.q(`.${classname}`).map((v)=>{
            v.classList.remove(classname)
        })
    },


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

    debug_css : {
        

        listAllClasses() {
            const elements = document.querySelectorAll('*');
            const classSet = new Set();
        
            elements.forEach(element => {
                element.classList.forEach(cls => classSet.add(cls));
            });
        
            return Array.from(classSet).sort();
        },
        
        traceParentHeights(css_selector) {
            let currentElement = document.querySelector(css_selector);
        
            while (currentElement) {
                // Get computed styles for the element
                const computedStyle = window.getComputedStyle(currentElement);
        
                // Extract box model details
                const marginTop = parseFloat(computedStyle.marginTop);
                const marginBottom = parseFloat(computedStyle.marginBottom);
                const paddingTop = parseFloat(computedStyle.paddingTop);
                const paddingBottom = parseFloat(computedStyle.paddingBottom);
                const borderTopWidth = parseFloat(computedStyle.borderTopWidth);
                const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth);
        
                // Log detailed information about the element
                console.log({
                    tagName: currentElement.tagName,
                    id: currentElement.id || "(no id)",
                    className: currentElement.className || "(no class)",
                    offsetHeight: currentElement.offsetHeight, // Total visible height (padding + content + border)
                    computedHeight: computedStyle.height, // CSS height (content only, no padding/border/margin)
                    margin: {
                        top: marginTop,
                        bottom: marginBottom,
                        total: marginTop + marginBottom,
                    },
                    padding: {
                        top: paddingTop,
                        bottom: paddingBottom,
                        total: paddingTop + paddingBottom,
                    },
                    border: {
                        top: borderTopWidth,
                        bottom: borderBottomWidth,
                        total: borderTopWidth + borderBottomWidth,
                    },
                    totalHeight: currentElement.offsetHeight + marginTop + marginBottom, // Includes margin
                });
        
                // Move to the parent element
                currentElement = currentElement.parentElement;
            }
        }

    },

    /**
     * Nicely prints to console for debugging purposes
     * @param {object} obj 
     */
    printObject(obj) {
        console.log(JSON.stringify(obj, null, 2));
    },


    array : {
        isInList(x,y) {
            return (y.indexOf(x)> -1)
        },

        clone2DArray(arr) {
            return arr.map(subArr => [...subArr]);
        },

        /**
             * 6/16/22
             * UPDATE 1/2/2025 - NONMATCHED COLUMNS WILL USE COLUMN HEADER AND EACH CELL IS EMPTY STRING
             * @param {[][]} x 2d data array
             * @param {[]} y 1d array of string column headers. Use '=[ALIAS]' syntax to rename the column on the output
             * @param {boolean} [append_nonmatched] If set to true, appends the unused columns to the end of the array, in the original order
             * @returns 
             */
        forceTemplate3(x, y, append_nonmatched) {
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
                    
                    box.push(  value[key[i]]??(index === 0 ? y[i] : '')   )
                }
                return box
            })
            return y
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

        /**
             * UPDATE 1/17/2025
             * Return distinct rows based on all columns or specified composites. If you expect certain values to replace others in the result, consider sorting the array first
             * @param {[[]]} x 2d array
             * @param {[]} fields 1d array of field names to be used as a key for uniqeness
             * @returns [[]]
             */
        distinctRows(x,fields) {
            var s = new Set()
            var indexes = fields ? fields.map((v)=>x[0].indexOf(v)) : ''
            return x.filter((v) => {
                var composite = indexes ? indexes.reduce((acc,k) => {
                    acc+=v[k];
                    return acc
                },'') : v.join("")

                if(s.has(composite)){
                    return false
                }else{
                    s.add(composite)
                    return true
                }
            })
        },

        /** Fixed on 2/12/2025 */
        leftJoin(dataLeft, dataRight, keyLeft, keyRight) {

            dataRight[0][dataRight[0].indexOf(keyRight)] = keyLeft
            // keyRight = keyLeft
            
            var keyRightX = keyRight.toUpperCase()
            
            keyLeft = dataLeft[0].map((v) => v.toUpperCase()).indexOf(keyLeft.toUpperCase())
            var fillin = dataRight[0].reduce((acc,v,i)=>{if(i){acc.push('')};return acc},[])
            
            keyRight = dataRight[0].map((v) => v.toUpperCase()).indexOf(keyRight.toUpperCase())
            dataRight = dataRight.reduce((acc, v, ind) => {
            
            var KEYRIGHT = v[keyRight]
            acc[KEYRIGHT] = ([...v].filter(v2 => v2 !== v[keyRight])) //?
            return acc
            }, {})
        
        
            
            return dataLeft.map((v, ind) => {
                
            
            var ref = (!ind) ? dataRight[keyRightX] : dataRight[v[keyLeft]]
            
            if (ref) {
                v.push(...ref)
            }else{
                v.push(...fillin)
            }
            return v
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

        arrayIndex(array2d) {
            var headers = array2d[0]
            var obj = headers.reduce((acc, v, iter) => {
            acc[v] = iter
            return acc
            }, {})
            return obj
        },
    











    }





}



export default web
window.web = web
