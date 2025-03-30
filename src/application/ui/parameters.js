
import components from './components.js';
import c from './components.js'
import {ejsFcns,n} from '../../utility/misc.js'
import {f} from '../../utility/f.js'
import chalk from 'chalk';
import { getManifest } from '../../utility/viteUtility.js';
// 






export default   {
  filepaths: {
    forms: "src/application/ui/forms/", // absolute since this is being seen on server side
    scripts(usertype) { `/loaded_scripts/${usertype}`}, // relative to the static declared in app.js
    styles(usertype) {`/loaded_styles/${usertype}`}, // relative to the static declared in app.js
  },

  ui_config: {

    admin: {
      forms: [
        {
          name: "Home",
          icon: "home",
          html() {

            return /*html*/`
              <div id="example-table"> 
                
              </div>
            `

          },
          id: "home",
        },
        /* -------------------------------------------------------------------------- */
        /* -------------------------------------------------------------------------- */
        {
          name: "Users",
          icon: "person_search",
          html() {

            var users = c.templates.configTable({
              table_id: `${this.id}_table`,
              table_control_components_array: [
                c.components.createInput({
                  icon_name: "search",
                  placeholder: "Search users",
                }),
                c.components.createButton({
                  button_text: "Save",
                  icon_name: "floppy",
                  click_function: "saveTable",
                  
                }),
                c.components.createButton({
                  button_text: "Add User",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                }),
              ],
            });

            return /*html*/`
              <div class="form-layout-1">
                
                ${users}
              </div>
            `

          },
          id: "users",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Courses",
          icon: "admin_panel_settings",
          html() {
            var courses = c.templates.configTable({
              table_id: `${this.id}_table`,
              table_control_components_array: [
                `<div class="table_title">Courses</div>`,
                c.components.createButton({
                  button_text: "Save",
                  icon_name: "floppy",
                  click_function: "saveTable",
                }),
                c.components.createButton({
                  button_text: "Add Course",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                }),
              ],
            });

            var delivery_methods = c.templates.configTable({
              table_id: `delivery_methods_table`,
              table_control_components_array: [
                `<div class="table_title">Course Delivery Methods</div>`,
                c.components.createButton({
                  button_text: "Add Delivery Method",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                }),
              ],
            });

            var course_locations  = c.templates.configTable({
              table_id: `course_locations_table`,
              table_control_components_array: [
                `<div class="table_title">Course Delivery Method Locations</div>`,
                c.components.createButton({
                  button_text: "Add Location",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                })
                
              ],
            });

            var delivery_hours_cost = c.templates.configTable({
              table_id: `delivery_hours_cost`,
              table_control_components_array: [
                `<div class="table_title">Hours Pricing</div>`,
                c.components.createButton({
                  button_text: "Add New Pricing",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                })
                
              ],
            });

            



            return /*html*/`
            <div id="form-layout-course-admin">
                <div id="course_manager_courses">${courses}</div>
                <div id="course_manager_delivery_methods">${delivery_methods}</div>
                <div id="course_manager_delivery_hours_cost">${delivery_hours_cost}</div>
                <div id="course_manager_locations">${course_locations}</div>
            </div>
            `
            

          },
          cssfile: ['admin'],
          id: "courses",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Packages",
          icon: "attach_money",
          html() {
            var allCourses =  c.templates.configTable({
              table_id: `packages_available_courses`,table_control_components_array: [
                `<div class="table_title">Available Courses</div>`
                
              ],
            })

            var packagesAll = c.templates.configTable({
              table_id: `packages_table`,
              table_control_components_array: [
                `<div class="table_title">Packages</div>`,
                c.components.createButton({
                  button_text: "Save",
                  icon_name: "floppy",
                  click_function: "saveTable",
                }),
                c.components.createButton({
                  button_text: "Add Course",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                }),
              ],
            })

            var packageCourses = c.templates.configTable({
              table_id: `package_courses_table`,
              table_control_components_array: [
                `<div class="table_title">Package Courses</div>`,
                c.components.createButton({
                  button_text: "Save",
                  icon_name: "floppy",
                  click_function: "saveTable",
                }),
                c.components.createButton({
                  button_text: "Add Course",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                }),
              ],
            })
            // f.logger('HTML for TABLE1',packages)


            return ejsFcns.renderFormSync('admin/packages.ejs',{
              allCourses,
              packagesAll,
              packageCourses
            })

          },
          id: "packages",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Locations",
          icon: "domain",
          html() {
            var locations =  c.templates.configTable({
              table_id: `${this.id}_table`,
              table_control_components_array: [
                c.components.createButton({
                  button_text: "Save",
                  icon_name: "floppy",
                  click_function: "saveTable",
                }),
                c.components.createButton({
                  button_text: "Add Location",
                  icon_name: "plus-circle",
                  click_function: "addRow",
                }),
              ],
            });
            return `<div class="form-layout-1">${locations}</div>`

          },
          id: "locations",
        },
        /* -------------------------------------------------------------------------- */
        {
          
          name: "Zones",
          icon: "location_on",
          html() {
            var html = `

              <div id="map"></div>
              
            `


            return html


          },
          cssfile: ["admin"],
          id: "zones",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Vehicles",
          icon: "directions_car",
          html() {

            return ejsFcns.renderFormSync('admin/vehicles.ejs',{
              USER_DETAILS:'test'
            })

          },
          id: "vehicles",
          
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Employees",
          icon: "badge",
          html() {},
          id: "employees",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Stats",
          icon: "query_stats",
          html() {},
          id: "stats",
        },
        // {
        //   name: "System",
        //   icon: "table_view",
        //   html() {

        //     var lookups = c.templates.configTable({
        //       table_id: `${this.id}_table`,
        //       table_control_components_array: [
        //         c.components.createInput({
        //           icon_name: "search",
        //           placeholder: "Search users",
        //         }),
        //         c.components.createButton({
        //           button_text: "Save",
        //           icon_name: "floppy",
        //           click_function: "saveTable",
        //           click_function_param: "setLookupTable",
        //         }),
        //         c.components.createButton({
        //           button_text: "Add Value",
        //           icon_name: "plus-circle",
        //           click_function: "addRow",
        //         }),
        //       ],
        //     });

        //     return `<div class="form-layout-1">${lookups}</div>`

        //   },

        //   id: "lookuptable",
        // },


      ],
      
    },

    office: {
      forms: [],
    },

    instructor: {
      forms: [],
    },

    student: {
      forms: [],
    },

    all: {
      

      head(user_type) {  
        
        var manifest_user = getManifest(`_${user_type}`)
        var manifest_main = getManifest(`main`)


        return `
        <title> Heights Driving School, Inc.</title>
        <link rel="icon" type="x-icon" sizes="any" href="../images/heights_favicon.svg">
        <meta name="referrer" content="no-referrer" />
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
        <link rel="stylesheet" href="/fonts/stylesheet.css">
        <link href="../vendor/tabulator-master/dist/css/tabulator_simple.min.css" rel="stylesheet">
        <script type="text/javascript" src="../vendor/tabulator-master/dist/js/tabulator.min.js" defer></script>
        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
        <script>WebFont.load({google: {families:['Public Sans','Inter', 'Source Sans 3','Roboto','Roboto Condensed']}});</script>
        <!-- ----------------------------------------------------------------------- -->
        <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/shoelace-autoloader.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/global/luxon.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/themes/light.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        ${manifest_user.css}
        ${manifest_user.js}
        ${manifest_main.css}
        ${manifest_main.js}
      `},
    },

}
}



