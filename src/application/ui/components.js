


export default {

    


    templates : {

        configTable({
            table_id='',table_control_components_array=[]
        }={}) {



            return (
            `
              <div class="outer-table-container">
                <div class="table-controls" data-table_context="${table_id}">
                ${table_control_components_array.join("")}
                </div>
                <div class="table-container" id="${table_id}"></div>
              </div>

            `
            )



        }





    },
    components: {

        createButton({
            button_text="",button_class="",icon_name="",icon_class="",click_function="",click_function_param=""
        }={}) {

            return (
                `<div>
                    <sl-button data-click_function="${click_function}" data-click_function_param="${click_function_param}"  class="${button_class}" variant="default" size="large">
                    <sl-icon  class="${icon_class}" slot="prefix" style="font-size: 1.5rem;" name="${icon_name}"></sl-icon>
                    ${button_text}
                    </sl-button>
                </div>
                 `
            )

        },
        createInput({
            input_class="",placeholder="",icon_class="",icon_name=""
        }={}) {
            return (
                `<div>
                    <sl-input  class="${input_class}" placeholder="${placeholder??''}" size="large">
                        <sl-icon class="${icon_class}" name="${icon_name}" slot="prefix"></sl-icon>
                    </sl-input>
                </div>
                `
            )

            


        }

        





    },
   
    


}