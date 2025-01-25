
import c from './components.js'
// 





export default {
  filepaths: {
    forms: "src/application/ui/forms/", // absolute since this is being seen on server side
    scripts: "/loaded_scripts", // relative to the static declared in app.js
    styles: "/loaded_styles", // relative to the static declared in app.js
  },

  ui_config: {
    admin: {
      forms: [
        {
          name: "Home",
          icon: "home",
          html() {

            return /*html*/`
              <div id="example-table"> </div>
            `

          },
          scriptfile: ["admin.load.tables"],
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
          scriptfile: ["admin.load.tables"],
          id: "users",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Courses",
          icon: "school",
          html() {
            var courses = c.templates.configTable({
              table_id: `${this.id}_table`,
              table_control_components_array: [
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

            var course_locations  = c.templates.configTable({
              table_id: `course_locations_table`,
              table_control_components_array: [
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

            return /*html*/`
            <div id="form-layout-course-admin">
                <div id="course_manager_courses">${courses}</div>
                <div id="course_manager_delivery_methods">${delivery_methods}</div>
                <div id="course_manager_locations">${course_locations}</div>
            </div>
            `
            

          },
          scriptfile: ["admin.courses","admin.load.tables"],
          cssfile: ['admin'],
          id: "courses",
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
          scriptfile: ["admin.load.tables"],
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
          scriptfile: ["admin.zones"],
          cssfile: ["admin"],
          id: "zones",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Prices",
          icon: "attach_money",
          html() {},
          scriptfile: ["admin.load.tables"],
          id: "prices",
        },
        /* -------------------------------------------------------------------------- */

        {
          name: "Vehicles",
          icon: "directions_car",
          html() {},
          scriptfile: ["admin.load.tables"],
          id: "vehicles",
          
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Employees",
          icon: "badge",
          html() {},
          scriptfile: ["admin.load.tables"],
          id: "employees",
        },
        /* -------------------------------------------------------------------------- */
        {
          name: "Stats",
          icon: "query_stats",
          html() {},
          scriptfile: ["admin.load.tables"],
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

        //   scriptfile: ["admin.load.tables"],
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
      head(cssfiles) { return `
                <title>
                Heights Driving School, Inc.
                </title>
                <link rel="icon" type="x-icon" sizes="any" href="../images/heights_favicon.svg">
                <meta name="referrer" content="no-referrer" />
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width">
                <script type="module" src="/assets/js/web.js" ></script>
                <script type="module" src="/assets/js/navigation.js"></script>
                <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/shoelace-autoloader.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/global/luxon.min.js"></script>
             
                <link href="../vendor/tabulator-master/dist/css/tabulator_simple.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/themes/light.css" />


                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
                <link rel="preconnect" href="https://fonts.googleapis.com">

                <!-- Dynamic CSS BEGIN -->
                <link rel="stylesheet" href="/assets/css/all.css">
                ${cssfiles??''}
                <!-- Dynamic CSS END -->
                <link rel="stylesheet" href="/fonts/stylesheet.css">
                <link rel="stylesheet" href="/css/root.css">
                <link rel="stylesheet" href="/css/style_grids.css">
                <link rel="stylesheet" href="/css/style.css">
                <link rel="stylesheet" href="/css/style2.css">
                <link rel="stylesheet" href="/css/pages.css">
                <link rel="stylesheet" href="/assets/css/structure.css">
                <link rel="stylesheet" href="/assets/css/viewport.css">
                <link rel="stylesheet" href="/assets/css/table.css">
                <link rel="stylesheet" href="/assets/css/buttons_inputs.css">
                <link rel="stylesheet" href="/assets/css/maps.css">

                <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
                <script>WebFont.load({google: {families:['Public Sans','Inter', 'Source Sans 3','Roboto','Roboto Condensed']}});</script>
                <script type="text/javascript" src="../vendor/tabulator-master/dist/js/tabulator.min.js" defer></script>
                <script type="text/javascript" src="../js/fcns.js" defer></script>
                <script type="module" src="/assets/js/web.js" defer></script>
                <script type="module" src="/assets/js/server.js"></script>
                <script type="module" src="/assets/js/TableEngine_Ext.js" defer></script>
                <script type="module" src="/assets/js/TableEngine.js" defer></script>
        `},
      },
  },
};


