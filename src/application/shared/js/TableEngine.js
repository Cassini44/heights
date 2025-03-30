import web from "@shared_js/web.js"
import table_engine_ext,{columnEngine} from "@shared_js/TableEngine_Ext.js"
/// <reference types="tabulator-tables" />



//> REMOVE THIS BEFORE PRODUCTION
const developermode = true
//> ^^^^



//Let god have mercy on your soul, future developer



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
      //  footerElement:'<div class="tabulator-footer">text</div>',
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
        
        var c_def = typeof column_defs[v] === 'function' ? column_defs[v]() : column_defs[v]
        
        acc = {...acc,...c_def}

        

      }
      return acc
    },{})

    return def

  }


  // ---------------------------------------------------


  createTable(
      elementId,
      key,
      data, {
        includeRowSelector=false,
        forceTemplate=[],
        tableOptions={},
        columnOptions={},
        additionalColumns=[],
        onSaveServerFunction=function(){},
        rowProccesorFunction=false,
      } = {} 
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

    if(rowProccesorFunction) {

      rowProccesorFunction(rowData)
      
    }

    

    var rowheader = includeRowSelector ?  {
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


    //! Merge default options with custom options for this specific table
    const tableSetup = {
      selectableRows:includeRowSelector?1:false,
      ...rowheader,
      columns: FINAL_COLUMNS,
      data: rowData, // Use field names for row objects
      ...this.defaultOptions,
      ...tableOptions, // Custom overrides specific to this table
      index : key,
      
      
      
    };


    
    //! Create and return a new Tabulator instance
    /** @type {import("tabulator-tables").Tabulator} */
    const table = new Tabulator(`#${elementId}`, tableSetup);

    
    

    
    //! If table is empty on creation
    table.on("tableBuilt",function () {
      
      if (this.getData().length === 0) {
        this.addRow();
      }
    })

    

    //! Developer mode stuff
    if(developermode){


      table.on("headerDblClick", function(e, column){
        web.copyToClipBoard(`[${column.getTable().getColumnLayout().map((v)=> `['${v.field}']`).join(',\n')}]`)
       
      });
      

      
      table.on("cellEdited",  function(cell) {
        /** @type {Tabulator.CellComponent} */
        var cell = cell

        
        
        
        
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
         saveTable: async function () {
          await onSaveServerFunction(elementId)
          table.alert('Saved','msg')
          setTimeout((v)=>{table.clearAlert()},1000)
         }
      }


      v.addEventListener('click',clickfcns[fcn])
   })
   //!--------------------------------------------------------------------//
    

   table.index = key;

   return table;

  }
  
  // ----------------------------------------------------
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




    /**
   * ✔️
   * @param {string} elementId The id of the table
   * @param {[]} columns_to_upload A 1d array of columns to upload. Always uploads the primary key
   * @returns 
   */
    getTableEditsForDb2(elementId,columns_to_upload) {

   

      /** @type {import("tabulator-tables").Tabulator} */
      var table = this._tables.get(elementId)

      var pimrary_key_column = table.index
  
      /* -------------------------------------------------------------------------- */
      var cols;
      
      if(columns_to_upload) { //if we are explicitly defining what columns to send out
  
        cols = table.getColumns().reduce((acc,v)=>{
          var colname = v.getField()
  
          if(columns_to_upload.indexOf(colname) !== -1 ){
            acc.push(colname)
          }
          return acc
        },[])
  
        /* ---------------------------------------- */
      }else{ //if we are not explicitly defining what columns to send out
  
        cols = table.getColumns().reduce((acc,v)=>{
  
        
          if(v.getField() && (((v.getDefinition().editor)||v.getDefinition()['virtual_editor']) || v.getField() === pimrary_key_column   ) ){
           
            acc.push(v.getField())
          }
          return acc
        },[])
      }
  
      /* -------------------------------------------------------------------------- */
  
      const editedRows = this.getEditedRows(elementId); // Returns row components
    
      const editedData = editedRows.map((row) => row.getData("data")); // Extract data
      console.log('edited data',editedData)
  
      var data = editedData.reduce((acc,v)=>{
        var row = cols.map((column) => v[column])
        acc.push(row)
        return acc
      },[])
  
      data.unshift(cols);

      return data
      
    } //✔️



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
