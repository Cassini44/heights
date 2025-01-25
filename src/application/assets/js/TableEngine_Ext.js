
const table_engine_ext  = {

    icons: {
      edit_pencil : `<span class="material-icons">edit</span>`,
      edit_calendar: `<span class="material-icons">edit_calendar</span>`,
    },

    column_defs : {


      '.*': {
        formatter: ((v)=>{
          return v.getValue()
        })

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
        
        cellClick: ((e,cell) => {

          console.log(cell.getOldValue())
          console.log(cell.getValue())
          cell.setValue(Number(cell.getValue())===0?1:0)

        }),
        headerHozAlign :'center',
        title: 'Active',
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

        cellClick: ((e,cell) => {
          alert('cell clicked')

        })
      }



        
  
    },


    custom_editors : {
      dateEditorExample : function(cell, onRendered, success, cancel, editorParams){

        //create and style input
        var cellValue = cell.getValue()?.toUpperCase()??'',
        input = document.createElement("input");

        input.setAttribute("type", "checkbox");

        // input.style.padding = "4px";
        // input.style.width = "100%";
        // input.style.boxSizing = "border-box";
        // input.style.backgroundColor = "red";

        input.value = cellValue;

        onRendered(function () {
            input.focus();
            input.style.height = "100%";
        });

        function onChange(e) {
            if (input.value != cellValue) {
                success(input.value.toUpperCase());
            } else {
                cancel();
            }
        }

        //submit new value on blur or change
        input.addEventListener("change", onChange);
        input.addEventListener("blur", onChange);

        //submit new value on enter
        input.addEventListener("keydown", function (e) {
            if (e.code === 'Enter') {
                success(input.value);
            }
        });

        return input;
      }

    }

    

}

export default table_engine_ext


