import server from "@shared_js/server.js"
import web from "@shared_js/web.js"
import t from "@shared_js/TableEngine.js"
import table_engine_ext,{columnEngine} from "@shared_js/TableEngine_Ext.js"
import loadData from "@admin/loadData"


/// <reference types="tabulator-tables" />

/*
!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
1) This script file acts upon the outputs of the file called 'parameters' specifically the tables
2) 'paramaters' will utilize an EJS template or inline html() function, to buld out a 'form' which is a div
3) those 'forms' sometime have tables that need defining. those are defined here
4) http requests to the server also happen here, providing data to the table
!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/




export default async function initTables() {

    
  window.t = t

  //# Get Datasets 
  var {
    class_locations,
    courses_all,
    courses_table,
    delivery_hours_cost,
    delivery_methods,
    locations_table,
    package_courses,
    packages_all,users_table
  } = (await loadData())


  
  //! COURSES ----------------------------------------------------------------------------------------------------------
  t.createTable("courses_table", "COURSE_ID", courses_table, { 

    rowProccesorFunction(x) {
      
    },

    forceTemplate: [
      'COURSE_ID',
      'BUTTON__DRILL_MASTER_DETAIL',
      'COURSE_NAME',
      'COURSE_CATEGORY',
      'COURSE_TYPE',
      'COURSE_DESCRIPTION',
      'COURSE_MINIMUM_HOURS',
      'IS_ACTIVE',
      'CREATION_DATE'
    ],

    tableOptions: {


      rowFormatter: function (row) {
        /** @type {HTMLElement} */
        let r = row.getElement(); 
        
        // r.insertAdjacentHTML('afterbegin',`<div style="background-color:#eff3f6;height:1rem;"></div>`)
        
        
      },

      rowContextMenu: [
        {
          label: "Delete Row",
          action: function (e, row) {
            row.delete();
          },
        },
      ],
    },

    columnOptions: {

      // ['COURSE_ID']
      // ['BUTTON__DRILL_MASTER_DETAIL']
      // ['COURSE_NAME']
      // ['COURSE_CATEGORY']
      // ['COURSE_TYPE']
      // ['COURSE_DESCRIPTION']
      // ['COURSE_MINIMUM_HOURS']
      // ['IS_ACTIVE']
      // ['CREATION_DATE']
      
      ['COURSE_DESCRIPTION']: {
        editor : "input",
        widthGrow:5
      },
      ['COURSE_NAME'] : {
        editor: "input",
        widthGrow:2
      },

      ['COURSE_MINIMUM_HOURS'] : {
        title: "Min Hours",
        hozAlign: "center",
        minWidth: 70,
        maxWidth: 80,
        editor:"number", 
        editorParams:{
          min:0,
          max:100,
          step:1,
        }
      }
      
    },

    additionalColumns: [
      {
        field: 'BUTTON__DRILL_MASTER_DETAIL',
      }
      

    ],
    
    /**
     * 
     * @linkcode 
     */
    onSaveServerFunction: async function (table) {

      var COURSES = t.getTableEditsForDb2(table);
      var COURSE_DELIVERY_METHODS = t.getTableEditsForDb2("delivery_methods_table",  ['COURSE_DELIVERY_METHOD_ID',
        'COURSE_ID',
        'DELIVERY_METHOD',
        'IS_ACTIVE']);

      
      var COURSE_DELIVERY_CLASS_LOCATIONS =  web.swapColumnName( t.getTableEditsForDb2("course_locations_table",["COURSE_DELIVERY_METHOD_ID","IS_ACTIVE","LOCATION_NAME","COURSE_DELIVERY_CLASS_LOCATION_ID"]),'LOCATION_NAME','LOCATION_ID' )

      var COURSE_DELIVERY_HOURS_COST = t.getTableEditsForDb2("delivery_hours_cost" )


      //file:///c:/Users/nyden/Home/Dev/JS/Heights%20Driving%20School%20Inc/Heights/src/controllers/dataAccess.js
      //file:///c:/Users/nyden/Home/Dev/JS/Heights%20Driving%20School%20Inc/Heights/src/models/db_model/config.js
      

     

      let response = await server.hdsData("setCourses", {
        data: {
          COURSES,
          COURSE_DELIVERY_CLASS_LOCATIONS,
          COURSE_DELIVERY_METHODS,
          COURSE_DELIVERY_HOURS_COST
        },
      });
      var d = response;
      console.log(d);
    },
    
  });


  //! COURSES --> DELIVERY_METHOD ---------------------------------------------------------------------------------------
  t.createTable("delivery_methods_table", "COURSE_DELIVERY_METHOD_ID", delivery_methods, {
    forceTemplate: [
      'COURSE_DELIVERY_METHOD_ID',
      'COURSE_ID',
      'BUTTON__DRILL_MASTER_DETAIL',
      'DELIVERY_METHOD',
      'IS_ACTIVE'
    ],

    tableOptions: {
      initialFilter: function (row) {return false},
      rowFormatter: function (row) {},
      rowContextMenu:[
        {
            label:"Delete Row",
            action:function(e, row){
                row.delete();
            }
        },
      ]
    },

    columnOptions: {

      ['COURSE_ID'] : {
        mutator: (value) => value ?? t.getTable("courses_table").getSelectedData()[0]['COURSE_ID'],
      }
     
      

      
    },
    additionalColumns: [
      {
          field: 'BUTTON__DRILL_MASTER_DETAIL',
      }

    ],
    
   
  });
  


  //! COURSES --> DELIVERY_METHOD --> DELIVERY_METHOD_LOCATIONS  ------------------------------------------------------------------------------------------------------------------------
  var locations_lookup = web.createLookupObjectFromTable(locations_table,'LOCATION_NAME','LOCATION_ID')

  t.createTable("course_locations_table", "COURSE_DELIVERY_CLASS_LOCATION_ID", class_locations, {
    forceTemplate : [
      "LOCATION_NAME","IS_ACTIVE","LOCATION_ID","COURSE_DELIVERY_METHOD_ID","COURSE_DELIVERY_CLASS_LOCATION_ID"


    ],



    tableOptions: {

      initialFilter: function (row) {return false},
      rowFormatter: function (row) {},
      rowContextMenu:[
        {
          label:"Delete Row",
          action:function(e, row){
                  row.delete();
              }
        },
    ]
    },

    columnOptions: {
      ['LOCATION_NAME'] : {
        ...columnEngine.createDropdown(web.array.pc(locations_table,'LOCATION_NAME',true,false)),
        ...{accessor : (value) => locations_lookup[value] }

      },

      ['COURSE_DELIVERY_METHOD_ID'] : {
        mutator: (value) => value ?? t.getTable("delivery_methods_table").getSelectedData()[0]['COURSE_DELIVERY_METHOD_ID'],
        
      }
        
      
    

      
    },
    additionalColumns: [
    

    ],
    
    includeRowSelector:false
  });


  //! COURSES --> DELIVERY_METHOD --> DELIVERY_METHOD_PRICES
  t.createTable("delivery_hours_cost", "COURSE_DELIVERY_COST_ID", delivery_hours_cost, {
    forceTemplate : [
      "HOURS","COST","IS_ACTIVE","COURSE_DELIVERY_METHOD_ID","COURSE_DELIVERY_COST_ID"

    ],

    columnOptions: {
      ['COURSE_DELIVERY_METHOD_ID']: {
        mutator: (value) => value ?? t.getTable("delivery_methods_table").getSelectedData()[0]['COURSE_DELIVERY_METHOD_ID'],
      },
      ['HOURS']: {
        title: "Hours",
        hozAlign: "center",
        minWidth: 70,
        maxWidth: 80,
        editor:"number", 
        editorParams:{
          min:0,
          max:100,
          step:1,
      }},
      ['COST']: {
        formatter:"money",
        editor:'number',
        formatterParams:{
          symbol:"$",
      }
      }
    },

    tableOptions: {

      initialFilter: function (row) {return false},
      rowFormatter: function (row) {},
      rowContextMenu:[
        {
          label:"Delete Row",
          action:function(e, row){
                  row.delete();
              }
        },
      ],
    },

   
      
    additionalColumns: [
      

    ],
    
    includeRowSelector:false

  })


  



  //= LOCATIONS DEFINITIONS ----------------------------------------------------------------------------------------------
  t.createTable("locations_table", "LOCATION_ID", locations_table, {
    tableOptions: {
      rowFormatter: function (row) {}
      
    },

    columnOptions: {
     
      ['LOCATION_NAME']: {
       editor:"input"
      },
      ['ADDRESS_1']: {

      },
      ['ADDRESS_2']: {

      },
      ['CITY']: {

      },
      ['IS_ACTIVE']: {
        
      },

      ['STATE']: {

      },
      ['ZIP_CODE'] : {

      }

      
    },

    additionalColumns: [
    ],

    onSaveServerFunction: async function (table) {
      var dataTable = t.getTableEditsForDb2(table);
      
      let response = await server.hdsData("setLocationTable", {
        data: dataTable,
      });
      var d = response;
    },

    includeRowSelector:false

  });



  //= USERS ---------------------------------------------------------------------------------------------------------------
  t.createTable("users_table", "USER_ID",users_table, {

    forceTemplate: [
      'BUTTON__NOTES',
      'USER_ID',
      'CREATION_DATE',
      'FIRST_NAME',
      'LAST_NAME',
      'PHONE_NUMBER',
      'USER_TYPE',
      'ADDRESS_1',
      'ADDRESS_2',
      'BIRTH_DATE',
      'CITY',
      'EMAIL',
      'GENDER',
      'IS_LEGACY',
      'PASSWORD_RESET_FLAG'
    ],

    onSaveServerFunction : function(table) {
      var edits = t.getTableEdits(table)
    },
    tableOptions : {
      rowFormatter: function (row) {},
    },
    
    columnOptions : {
      CREATION_DATE : {
        title:"Account Created On", 
        field:"CREATION_DATE", 
        headerTooltip:true
        
        
      },
      FIRST_NAME : {
        editor:'input'
      }
      

      

    },
    
    additionalColumns: [
      {
        field: 'BUTTON__NOTES',
        title: "Notes",
        
        formatter: (() => {
          return `<span class="material-icons-outlined">note</span>`
        }),
        cellClick: ((e,cell) => {
          alert('cell clicked')

        })

      }
    ]

  });





  //~ packages -------------------------------------------------------------------------------------------------------------
  t.createTable("packages_available_courses", "COURSE_DELIVERY_COST_ID",courses_all, {

    forceTemplate: [
    ],

    /** @type {import("tabulator-tables").Options} */
    tableOptions : {
      rowFormatter: function (row) {
        return '<div style="height:5px;"></div>'
      },

     


    },
    

    columnOptions : {

      /** @type {import("tabulator-tables").ColumnDefinition} */
      ['COURSE_NAME'] :{
        editable: false
      },
      ['DELIVERY_METHOD'] :{
        editable: false
      },
      ['HOURS'] :{
        editable: false
      },
      ['COST']: {
        editable: false
      }
    
    },
    
    additionalColumns: [
      {
        field: 'BUTTON__ADD_TO',
        /** @type {import("tabulator-tables").ColumnDefinition} */
     
        hozAlign: 'center',

        frozen:true,
        headerSort:false,
        // titleFormatter:"rowSelection",

        formatter: (() => {
          return table_engine_ext.icons.add_box
        }),

        cellClick: ((e,/** @type {import("tabulator-tables").CellComponent} */cell) => {
          var y = cell.getRow().getIndex()


         
          

        })
      
        
      }
     
    ]

  });

  

  t.createTable("packages_table", "PACKAGE_ID",packages_all, {

    forceTemplate: [
    ],

    tableOptions : {
      rowFormatter: function (row) {},
    },
    
    columnOptions : {
      ['PACKAGE_NAME'] : {
        editor: "input"
      },
      ['PACKAGE_DESCRIPTION'] :{
        editor: "input"
      } ,
      ['CREATION_DATE'] : {

      }

    
    },
    
    additionalColumns: [
     
    ]

  });


  t.createTable("package_courses_table", "PACKAGE_COURSE_ID",package_courses, {

    forceTemplate: [
    ],

    tableOptions : {
      rowFormatter: function (row) {},
    },
    
    columnOptions : {

    
    },
    
    additionalColumns: [
     
    ]

  });

  
  







  


 




};



/* ----------------------------------------- */