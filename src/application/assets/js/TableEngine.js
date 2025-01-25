import web from "../../assets/js/web.js"
import table_engine_ext from "./TableEngine_Ext.js"




//> REMOVE THIS BEFORE PRODUCTION
const developermode = true
//> ^^^^


class TableEngine {
  constructor(defaultOptions = {}) {
    // Set up default properties for all tables
    this.defaultOptions = {
      // renderVertical:"basic",
      placeholder:"No Data Available", //display message to user on empty table
      addRowPos: "top",
      // debugEventsExternal: true, //console log external events
      layout:"fitColumns",
      // autoResize: true,
       footerElement:'<div class="tabulator-footer">text</div>',
      ...defaultOptions, // Allow initial default overrides
    };

    this._tables = new Map();
    this.increment = 0;
  }


  // Columns such as CREATION_DATE which many tables have and would have the same definition

  
  predefinedColumnDefinitions(column_defs,header) {

    
    var def = Object.keys(column_defs).reduce((acc,v)=>{
      var regx = new RegExp( v )
      if(regx.test(header)) {
        
        acc = {...acc,...column_defs[v]}

        

      }
      return acc
    },{})

    return def

  }

  





  createTable(
    elementId,key,data,{includeRowSelector=false,forceTemplate=[],tableOptions={},columnOptions={},additionalColumns=[],onSaveServerFunction=function(){}} = {}
    ) {

    //Headers = index 0
    const [headers, ...rows] = data;

    


    // Generate column definitions with field names based on headers
    const columns = headers.map((header) => {
      

      //The default for any given column
      const baseColumn = {
        title: TableEngine.formatString(header), 
        field: header,
        visible: header===key? false:true ,
        resizable : false
      }; // 
    
      
      return { 
        ...baseColumn,
        ...(this.predefinedColumnDefinitions(table_engine_ext.column_defs,header) || {}),
        ...(columnOptions[header] || {}) 
      }; // Merge with any column-specific options
    });

    

    // Map rows to objects using field names (headers) as keys
    const rowData = rows.map((row) =>
      row.reduce((acc, cell, idx) => {
        acc[headers[idx]] = cell; // Use header name as key
        return acc;
      }, {})
    );

    

    var rowheader = includeRowSelector ? 
      {
        rowHeader: {

          width:'1.5em',

          formatter: (() => {
            return `<span class="material-icons-outlined">check_box_outline_blank</span>`
          }),
          cellClick: ((e,cell) => {
            var cellval = cell.getElement().innerHTML
            var row = cell.getRow()
            var table = cell.getTable()

            

            if(cellval === '<span class="material-icons-outlined">check_box_outline_blank</span>') {
              cell.getElement().innerHTML = '<span class="material-icons-outlined">check_box</span>';
              table.deselectRow();
              row.select()
            }
            if(cellval === '<span class="material-icons-outlined">check_box</span>') {
              cell.getElement().innerHTML = '<span class="material-icons-outlined">check_box</span>';
              table.deselectRow();
              
            }


          })

        }
      } : {}




    if (additionalColumns.length) {

      additionalColumns = additionalColumns.map((v)=>{
        if(v.field) {
          return { 
            ...v, 
            ...(this.predefinedColumnDefinitions(table_engine_ext.column_defs,v.field))
          }
        }
        return v

      })
      
    }  

    var FINAL_COLUMNS = [...additionalColumns, ...columns]

    console.log(FINAL_COLUMNS)
    
    if(forceTemplate.length) {
      FINAL_COLUMNS = FINAL_COLUMNS.reduce((acc,c)=>{
        if(!c.field){return acc}
        c.column_order = forceTemplate.indexOf(c.field)
        if(c.column_order === -1) {return acc}
        acc.push(c)
        return acc
      },[])

      FINAL_COLUMNS.sort((a,b)=>{
        return a.column_order - b.column_order
      })



    }


    // Merge default options with custom options for this specific table
    const tableSetup = {
      selectableRows:includeRowSelector?1:false,
      ...rowheader,
      columns: FINAL_COLUMNS,
      data: rowData, // Use field names for row objects
      ...this.defaultOptions,
      ...tableOptions, // Custom overrides specific to this table
      index : key,
      
      
      
    };

    // Create and return a new Tabulator instance
    const table = new Tabulator(`#${elementId}`, tableSetup);
    table.on("tableBuilt",function () {
      
      if (this.getData().length === 0) {
        this.addRow();
      }
    })

    table.on("cellEdited", function(cell){
      //cell - cell component
    });

    if(developermode){
      table.on("headerDblClick", function(e, column){
        web.copyToClipBoard(`[${column.getTable().getColumnLayout().map((v)=> `'${v.field}'`).join(',\n')}]`)
       
      });
    }
    
    
    this._tables.set(elementId, table);
    
    //!Adds the event listeners to the buttons
    //!--------------------------------------------------------------------------//!--------------------------------------------------------------------------
    [...web.$(elementId).parentElement.querySelectorAll("sl-button[data-click_function]")].map((v) =>{
      
      var table_name = v.closest('div[data-table_context]').getAttribute('data-table_context')
      var eventTable = t.getTable( table_name  )
      
      var fcn = v.getAttribute('data-click_function')
      var fcn_param = v.getAttribute('data-click_function_param')
     

      const clickfcns = {
         addRow: () => {
            eventTable.addRow({[key]: this.generateRowId() })
         },
         saveTable: function () {
            
          onSaveServerFunction(elementId)

         }
      }


      v.addEventListener('click',clickfcns[fcn])
   })
   //!--------------------------------------------------------------------------//!--------------------------------------------------------------------------
    table.index = key
    
    return table;
  }
  

  // Method to get a specific table by its element ID
  getTable(elementId) {
    return this._tables.get(elementId); // Returns the Tabulator instance or undefined
  }

  // Method to get all created tables
  getAllTables() {
    return Array.from(this._tables.values()); // Returns all Tabulator instances as an array
  }

  getTableDataAsArray(elementId) {
    var table = this._tables.get(elementId)
    var cols = table.getColumns().reduce((acc,v)=>{
      if(v.getField()){
        acc.push(v.getField())
      }
      return acc
    },[])

    var data = table.getData().reduce((acc,v)=>{
      var row = cols.map((column) => v[column])
      acc.push(row)
      return acc
    },[])

    
    
  }


  getTableEditsForUpload(elementId,remove_key_col) {
    var table = this._tables.get(elementId)
    var cols = table.getColumns().reduce((acc,v)=>{

      if(v.getField() && v.getDefinition().editor ){
        acc.push(v.getField())
      }
      return acc
    },[])

    const editedRows = this.getEditedRows(elementId); // Returns row components
    const editedData = editedRows.map((row) => row.getData()); // Extract data

    var data = editedData.reduce((acc,v)=>{
      var row = cols.map((column) => v[column])
      acc.push(row)
      return acc
    },[])

    data.unshift(cols);

    if(remove_key_col) {
      var keyfield = data[0].indexOf(table.index)
      if(keyfield !== -1) {
        data = data.reduce((acc,v)=>{
          acc.push(v.filter((v2,i2) => i2!== keyfield ))
          return acc
        },[])
      }
    }
    

    
    return data
    
  }



  /** @example 
   * //returned object
   * temp_id_1 : {LOOKUP_TYPE_NAME: 'COURSE_TYPE'} */
  getTableEdits(elementId) {
    var table = this._tables.get(elementId);
    return table.getEditedCells().reduce((acc,v)=>{
      var rowkey = v.getRow().getIndex()??this.generateRowId()
      var coledited = v.getColumn().getField()
      var val = v.getValue()
      if(acc[rowkey]) {
        acc[rowkey][coledited] = val
      }else{
        acc[rowkey] = {[coledited] : val}
      }
      return acc
    },{})
  }

  
  /** Returns rows with edits */
  getEditedRows(elementId) {
    var table = this._tables.get(elementId);
    var indexes_of_edits = new Set (
      table.getEditedCells().reduce((acc,v)=>{ 
      var index = v.getRow().getIndex()
      acc.push(index)
      return acc
    },[])
    )
    return table.getRows().filter((v)=> indexes_of_edits.has(v.getIndex()) )
  }


  generateRowId() {
   this.increment+=1
   return `temp_id_${this.increment}`
  }

  redrawAll() {
   Array.from(this._tables.values()).map((v)=> v.redraw())
  }





  
  /**
   * Converts 'COLUMN_NAME' to 'Column Name'
   * @param {string} input should be a column name
   * @returns string
   */
  static formatString(input) {
    return input.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase()+word.slice(1)).join(" ");
  }

 
}

const t = new TableEngine()

export default t;
