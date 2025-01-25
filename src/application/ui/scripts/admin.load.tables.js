import t from "../../assets/js/TableEngine.js"
import table_engine_ext from "../../assets/js/TableEngine_Ext.js"
import web from "../../assets/js/web.js"
import server from "../../assets/js/server.js"
import courses from "./admin.courses.js"



window.addEventListener("load", async () => {

    
  window.t = t

  //# Get Datasets 
  var {
    lookup_types,
    lookup_table,
    courses_table,
    users_table,
    locations_table,
    class_locations,
    delivery_methods
  } = (await server.hdsData('getAdminData')).data


  

  

  /*===================================================================================================*/
  /*===================================================================================================*/



  //# COURSES 
  t.createTable("courses_table", "COURSE_ID", courses_table, {
    forceTemplate: [
      'COURSE_ID',
      'BUTTON__EDIT',
      'COURSE_NAME',
      'COURSE_CATEGORY',
      'COURSE_TYPE',
      'COURSE_DESCRIPTION',
      'COURSE_MINIMUM_HOURS',
      'IS_ACTIVE',
      'CREATION_DATE'
    ],


    tableOptions: {

      rowFormatter: function (row) {},

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
      ['COURSE_DESCRIPTION']: {
        widthGrow:5
      },

      ['COURSE_MINIMUM_HOURS'] : {
        title: "Min Hours",
        hozAlign: "center",
        minWidth: 70,
        maxWidth: 80,
      }
      
    },
    additionalColumns: [
      {
          field: 'BUTTON__EDIT',
          formatter: (() => {
            return table_engine_ext.icons.edit_pencil
          }),
          cellClick: ((e,cell) => {
            alert('cell clicked')

          })

        
      }

    ],
    onSaveServerFunction: async function (table) {
      var dataTable = t.getTableEditsForUpload(table, true);
      let response = await server.hdsData("setLookupTable", {
        data: dataTable,
      });
      var d = response;
      console.log(d);
    },
    
  });

  window.courses_table = t.getTable('courses_table')




  //# COURSES --> DELIVERY_METHOD 
  t.createTable("delivery_methods_table", "COURSE_DELIVERY_METHOD_ID", delivery_methods, {
    forceTemplate: [
      'COURSE_DELIVERY_METHOD_ID',
      'COURSE_ID',
      'BUTTON__EDIT',
      'COURSE_NAME',
      'DELIVERY_METHOD',
      'IS_ACTIVE'
    ],

    tableOptions: {
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
      

      
    },
    additionalColumns: [
      {
          field: 'BUTTON__EDIT',
      }

    ],
    onSaveServerFunction: async function (table) {
      var dataTable = t.getTableEditsForUpload(table, true);
      let response = await server.hdsData("setLookupTable", {
        data: dataTable,
      });
      var d = response;
      console.log(d);
    },
    includeRowSelector:false
  });
  



  

  //# COURSES --> DELIVERY_METHOD --> DELIVERY_METHOD_LOCATIONS     
  t.createTable("course_locations_table", "COURSE_DELIVERY_CLASS_LOCATION_ID", class_locations, {
    forceTemplate : [


    ],

    tableOptions: {
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
     

      
    },
    additionalColumns: [
      {
          field: 'BUTTON__EDIT',
          formatter: (() => {
            return table_engine_ext.icons.edit_pencil
          }),
          cellClick: ((e,cell) => {
            alert('cell clicked')

          })

        
      }

    ],
    onSaveServerFunction: async function (table) {
      var dataTable = t.getTableEditsForUpload(table, true);
      let response = await server.hdsData("setLookupTable", {
        data: dataTable,
      });
      var d = response;
      console.log(d);
    },
    includeRowSelector:false
  });



  /*===================================================================================================*/
  /*===================================================================================================*/


  //# LOCATIONS DEFINITIONS 
  t.createTable("locations_table", "COURSE_LOCATION_ID", locations_table, {
    tableOptions: {
      rowFormatter: function (row) {}
      
    },

    columnOptions: {
    

      
    },

    additionalColumns: [
      {title:"Birthday", field: 'test',editorEmptyValue:'',editor: table_engine_ext.custom_editors.dateEditorExample}
    ],

    onSaveServerFunction: async function (table) {
      var dataTable = t.getTableEditsForUpload(table, true);
      let response = await server.hdsData("setLocationTable", {
        data: dataTable,
      });
      var d = response;
      console.log(d);
    },

    includeRowSelector:false

  });




  //# USERS 
  t.createTable("users_table", "USER_ID",users_table, {

      forceTemplate: [
        'USER_ID',
        'CREATION_DATE',
        'FIRST_NAME',
        'BUTTON__NOTES',
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




courses()

  


















});



/* ----------------------------------------- */

