


import t from "@shared_js/TableEngine.js"
import table_engine_ext,{columnEngine} from "@shared_js/TableEngine_Ext.js"
/// <reference types="tabulator-tables" />
import loadData from "@admin/loadData"


export default function() {

    window.loadData = loadData

   

    /** @type {import("tabulator-tables").Tabulator} */
    let  t1_courses   =  t.getTable("courses_table")
    let  t2_delivery  =  t.getTable("delivery_methods_table")
    let  t3_locations =  t.getTable("course_locations_table")
    let  t4_locations =  t.getTable("delivery_hours_cost")

    
    t1_courses.on("cellClick", function(e, /** @type {import("tabulator-tables").CellComponent} */ cell){
        if(cell.getField() !== "BUTTON__DRILL_MASTER_DETAIL") {return}
        var row = cell.getRow()

        
        var is_row_selected = row.isSelected();
        t1_courses.deselectRow();
        t2_delivery.deselectRow();
        if(!is_row_selected){ //! selecting
            row.select();
            var SELECTED_COURSE_ID = row.getData()['COURSE_ID'] 
            t3_locations.setFilter((v)=> false)
            t4_locations.setFilter((v)=>false)
            t2_delivery.setFilter((v)=> v['COURSE_ID'] === SELECTED_COURSE_ID)
        }else{ //! deselecting
            row.deselect();
            t2_delivery.setFilter((v)=> false)
            t3_locations.setFilter((v)=> false)
            t4_locations.setFilter((v)=>false)
        }
    });

    t2_delivery.on("cellClick", function(e, cell){
        if(cell.getField() !== "BUTTON__DRILL_MASTER_DETAIL") {return}
        var row = cell.getRow()

        var is_row_selected = row.isSelected();
        var table = row.getTable().deselectRow();
        if(!is_row_selected){ //= selecting

            row.select();
            var SELECTED_COURSE_DELIVERY_ID = row.getData()['COURSE_DELIVERY_METHOD_ID'] 
            t3_locations.setFilter((v)=> v['COURSE_DELIVERY_METHOD_ID'] === SELECTED_COURSE_DELIVERY_ID)
            t4_locations.setFilter((v)=> v['COURSE_DELIVERY_METHOD_ID'] === SELECTED_COURSE_DELIVERY_ID)

        }else{ //= deselecting
            row.deselect();
            t3_locations.setFilter((v)=> false)
            t4_locations.setFilter((v)=>false)
        }
    });

   
    // t2_delivery.on("rowAdded",function( /** @type {import("tabulator-tables").RowComponent} */ row){
    //     var courseid = t1_courses.getSelectedData()['COURSE_ID']
    //     row.up


    // }) 




    
    



    






}