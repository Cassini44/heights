


import t from "../../assets/js/TableEngine.js"
import table_engine_ext from "../../assets/js/TableEngine_Ext.js"


export default function() {



    
    let  t1_courses   =  t.getTable("courses_table")
    let  t2_delivery  =  t.getTable("delivery_methods_table")
    let  t3_locations =  t.getTable("course_locations_table")

    

    t1_courses.on("rowClick", function(e, row){
        var is_row_selected = row.isSelected();
        t1_courses.deselectRow();
        t2_delivery.deselectRow();
        if(!is_row_selected){ //! selecting
            row.select();
            var SELECTED_COURSE_ID = row.getData()['COURSE_ID'] 
            t2_delivery.setFilter((v)=> v['COURSE_ID'] === SELECTED_COURSE_ID)
        }else{ //! deselecting
            row.deselect();
            t2_delivery.setFilter((v)=> false)
        }
    });

    t2_delivery.on("rowClick", function(e, row){
        var is_row_selected = row.isSelected();
        var table = row.getTable().deselectRow();
        if(!is_row_selected){ //= selecting
            row.select();
            var SELECTED_COURSE_DELIVERY_ID = row.getData()['COURSE_DELIVERY_METHOD_ID'] 
            t3_locations.setFilter((v)=> v['COURSE_DELIVERY_METHOD_ID'] === SELECTED_COURSE_DELIVERY_ID)
        }else{ //= deselecting
            row.deselect();
            t3_locations.setFilter((v)=> false)
        }
    });

    
    



    






}