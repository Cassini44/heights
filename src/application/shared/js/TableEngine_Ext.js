import server from "@shared_js/server.js"





const table_engine_ext  = {

    icons: {
      edit_pencil : `<span class="material-icons">edit</span>`,
      edit_calendar: `<span class="material-icons">edit_calendar</span>`,
      search: `<span class="material-icons">search</span>`,
      drill_down: `<button><span class="material-icons">subdirectory_arrow_right</span></button>`,
      add_box: `<span class="material-icons plus-add">add</span>`,
    },

    column_defs : {

      '.*' :{
        vertAlign:'middle'
        
      },


      

      

      '_ID$' : {
        visible : false
      },

      '.*DATE.*' : {
        formatter: "datetime",
        formatterParams: {
          inputFormat: "iso",
          outputFormat: "yyyy-MM-dd",
          timezone: "America/New_York",
        },


      },

      'CREATION_DATE': {
        formatter: "datetime",
        formatterParams: {
          inputFormat: "iso",
          outputFormat: "yyyy-MM-dd 'at' h:mm a",
          timezone: "America/New_York",
        },
      },

      'IS_ACTIVE' : {

        

        virtual_editor: true,

        cellClick: ((e,cell) => {

          cell._cell.modules = {edit: {edited:true}}

          
          cell.setValue(Number(cell.getValue())===0?1:0)
          cell.setEdited();


        }),
        mutator: (value) => value ?? 0,
        headerHozAlign :'center',
        hozAlign:'center',
        title: 'Active',
        field: 'IS_ACTIVE',
        minWidth: 70,
        maxWidth: 80,
        cssClass: 'tabulator-icon-column',
        formatter:"lookup", 
        formatterParams: {
          "0": `<span class="material-icons-outlined">check_box_outline_blank</span>`,
          "1": `<span  style =""class="material-icons-outlined">check_box</span>`
        }
      },

      //Generic button column
      'BUTTON__' : {
        minWidth: 10,
        maxWidth: 80,
        headerHozAlign :'center',
        cssClass:'tabulator-icon-column'
      },
      
      'BUTTON__EDIT': {




        formatter: (() => {
          return table_engine_ext.icons.edit_pencil
        }),

        // cellClick: ((e,cell) => {
        //   alert('cell clicked')

        // })
      },



      'BUTTON__DRILL_MASTER_DETAIL': {

        frozen:true,
        headerSort:false,
        // titleFormatter:"rowSelection",

        formatter: (() => {
          return table_engine_ext.icons.drill_down
        }),

        // cellClick: ((e,cell) => {
        //   alert('cell clicked')

        // })
      },

      
      /** @type {import("tabulator-tables").ColumnDefinition} */
      'BUTTON__ADD_TO': {
        hozAlign: 'center',

        frozen:true,
        headerSort:false,
        // titleFormatter:"rowSelection",

        formatter: (() => {
          return table_engine_ext.icons.add_box
        }),

        // cellClick: ((e,cell) => {
        //   alert('cell clicked')

        // })
      },
      
      ['CHARGE_STATUS']() {
        return columnEngine.createDropdown(server.db_enums.CHARGE_STATUS)
      },
      ['COURSE_CATEGORY']() {
        return columnEngine.createDropdown(server.db_enums.COURSE_CATEGORY)
      },

      ['COURSE_TYPE']() {
        return columnEngine.createDropdown(server.db_enums.COURSE_TYPE)
      },

      ['DELIVERY_METHOD']() {
        return columnEngine.createDropdown(server.db_enums.DELIVERY_METHOD)
      },

      ['LOCATION_TYPE']() {
        return columnEngine.createDropdown(server.db_enums.LOCATION_TYPE)
      },
      ['PAYMENT_METHOD']() {
        return columnEngine.createDropdown(server.db_enums.PAYMENT_METHOD)
      },
      ['PAYMENT_STATUS']() {
        return columnEngine.createDropdown(server.db_enums.PAYMENT_STATUS)
      },
      ['USER_TYPE']() {
        return columnEngine.createDropdown(server.db_enums.USER_TYPE)
      },
      ['GENDER']() {
        return columnEngine.createDropdown(server.db_enums.GENDER)
      },



      

      
      




        
  
    },








}


export const columnEngine = {


  createDropdown(array_1d_for_dropdown) {


    return {
      formatter: (cell) =>   `<div style="width:100%;display:flex; justify-content:space-between;"> ${(cell.getValue() ?? "")}  <span style ="margin-right:3%;"class="material-icons-outlined">expand_more</span></div>`,
        mutator: (value) => value ?? '',
        editor: "list",
        editorParams: {
           values: array_1d_for_dropdown,
           itemFormatter: function(label, value, item, element){
               //label - the text lable for the item
               //value - the value for the item
               //item - the original value object for the item
               //element - the DOM element for the item
               return "<strong>" + label + " </strong><br/><div></div>";
           }
         }
    }
  }


}




export default table_engine_ext


