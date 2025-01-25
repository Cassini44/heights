/* -------------------------------------------------------------------------- */

//~ When page loads, do this
window.onload = (() => {

    

    /* -------------------------------------------------------------------------- */



    // This is where you will fetch class structure data for dropdown selections
    const dropdowns = [
        { id: 'class_dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
        { id: 'class_del_method_dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
        {id:'states_dropdown',options:['OH','NY']},
        {id:'gender_dropdown',options:['M','F']},
        // More dropdowns can be added here 📌
      ];
      
      dropdowns.forEach(dropdown => {
        new Dropdown(dropdown.id, dropdown.options); // No need to store the instance unless needed
      });


    /* -------------------------------------------------------------------------- */

    // Whenever a change occurs, re validate all fields
    // change should be the entryway into the business logic
    document.addEventListener('change', (e) => { ca_logic_val.validationFcn() })


    //specifically for passwords
    j.q('input[type="password"]').map(v => {
        v.addEventListener('keyup', function(e) {
            ca_logic_val.validationFcn()
        })
    })

    
    ca_logic_nav.displayCurrentStep()
    //initiate buttons
    page_elements.previous_button().addEventListener('click', () => ca_logic_nav.stepBackward())
    page_elements.next_button().addEventListener('click', () => ca_logic_nav.stepForward())

    

    // setup the phone number input
    inputNumeral = document.querySelector('.input-phone');
    inputNumeral.addEventListener('input', (e) => {
        inputNumeral.value = cleaveZen.formatGeneral(e.currentTarget.value, {
            blocks: [0,3,3,4],
            delimiters: ['(', ') ', '-'],
            delimiterLazyShow: true,
            numericOnly: true
        });
    })


    j.$('payment_option_radio').addEventListener('change', (e) =>{
        [...e.currentTarget.querySelectorAll('input')].map((v)=>{

            var lookups = {
                pay_now : 'payment-form',
                pay_online_later: 'pay_online_later_message',
                in_person : 'cash_or_check_message'
            }
                
            var label = v.id
            
            var lkup = lookups[label]
            var ischecked = v.checked

            if(ischecked){
                document.getElementById(lkup).style.display = 'block'
                
            }else{
                document.getElementById(lkup).style.display = 'none'
            }
        })
    })


    


})

/*-------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------- */




const page_elements = {
    previous_button : () =>  j.$('previous_button'),
    next_button : () =>  j.$('next_button')
}


/* Logic around how the form moves through pages */
const ca_logic_nav = {

    currentStep : 1,
    maxsteps: 4,


    //Either via the button or auto
    stepForward() {
        if(this.currentStep === this.maxsteps){return;}
        this.currentStep++;
        document.querySelector(`#step${this.currentStep}`).classList.add('step_complete')
        this.updateButtons()
        this.displayCurrentStep();
    },

    ////Either via the button or auto
    stepBackward() {
        if(this.currentStep === 1){return;}
        document.querySelector(`#step${this.currentStep}`).classList.remove('step_complete')
        this.currentStep--;
        this.updateButtons()
        this.displayCurrentStep();
    },


    updateButtons() {
        var cs = this.currentStep
        var csname = `ca_input_step${this.currentStep}`

        var previous = page_elements.previous_button()
        var next = page_elements.next_button()

        var is_current_step_valid = ca_logic_val.inputs_validity_states?.[csname];

        j.l('Is current step valid',is_current_step_valid)

       
           // next.classList.add('step-validated')

            //next.classList.remove('step-validated')

        if(cs === 1){
            j.disableAndHideBtn(previous)

            if(is_current_step_valid){
                j.enableAndShowBtn(next)
            }else{
                j.disableAndHideBtn(next)
            }
        }else if(cs === 4) {
            j.disableAndHideBtn(next)
            j.enableAndShowBtn(previous)
        }else{

            j.enableAndShowBtn(previous)

            if(is_current_step_valid){
                j.enableAndShowBtn(next)
            }else{
                j.disableAndHideBtn(next)
            }
        }
        
    },


    displayCurrentStep() {

        var current_step = `ca_input_step${this.currentStep}`;
        

        this.updateButtons();
        

        [...j.q('#ca_input_container > div')].map((v)=> {
            if(v.id === current_step){
                
                v.classList.remove('hide_step')

            }else{
                v.classList.add('hide_step')
            }
        })

    }

    

    
    

}



// Validation and feedback
const ca_logic_val = {

    inputs_validity_states:{},
    inputs_current_state:[],
    inputs_serialized: {},

    
    

    

    //Gather the inputs
    getAllInputs() {
        var d = j.q('input').map((v)=>{return [
            v.closest('.input-fields-container').id,
            v.parentElement.parentElement.id,
            v.checked===true ? 1 : v.value === "on" ? 0 : v.value
        ]})

        
        return d
    },

    // validate all fields
    validationFcn() {

        /* 📌
            [0] = step
            [1] = id
            [2] = value
        */
            
        var inputs = ca_logic_val.getAllInputs().reduce((acc,v)=>{

            var step  = v[0]
            var id    = v[1]
            var value = v[2]
            
            if(id==='payment_option_radio'){return acc}
            
            var validationResponse = ca_logic_val.validation_logic[id](value,id)
            
            v.push(validationResponse??0)

            acc.push(v)
            return acc
        },[])


        inputs.unshift(['STEP','FIELD','VALUE','IS_VALID'])
        /* 📌 MANUALLY ADD FIELDS HERE SUCH AS PAYMENT OPTION */


        
        var payment_option = [...document.getElementById('payment_option_radio').querySelectorAll('INPUT')]
        .find((v)=>{
            return v.checked
        }).id;

          
        inputs.push([
            'ca_input_step4',
            'payment_choice',
            payment_option,
            payment_option==="pay_now" ? (isStripePaymentComplete ? 1 : 0) : 1
        ])
    
        /* 📌 MANUALLY ADD FIELDS HERE SUCH AS PAYMENT OPTION */
        this.inputs_current_state = inputs


        var isvalid = j.sql(inputs,`
            GROUPBY(STEP),
            MIN(IS_VALID)
        `)
        
        /* -------------------------------------------------------------------------- */
        isvalid =  isvalid.reduce((acc,v)=>{
            acc[v[0]] = v[1];
            return acc
        },{})
        this.inputs_validity_states = isvalid


        /* -------------------------------------------------------------------------- */
        var {STEP,FIELD,VALUE,IS_VALID} = j.arrayIndex(inputs)
        this.inputs_serialized = inputs.reduce((acc,v,i)=>{
            if(i && v[IS_VALID] ){
                acc[v[FIELD]] = v[VALUE]
            }
            return acc
        },{})




        ca_logic_nav.updateButtons()


        

    },

    
    validation_logic : {
        // valid
        // valid_nr
        // invalid
        // required

        class(x,id) {
            
        
            if(x) {
                vd(id,"valid")
                return 1
            }else{
                vd(id,"required")
                return 0
            }
        },

        delivery_method(x,id) {
            


            if(x) {
                vd(id,"valid")
                return 1
            }else{
                vd(id,"required")
                return 0
            }
        },



        email(x,id) {

            if(!x){
                
                vd(id,"required")
                return 0
            }

            var y = j.validateEmail(x)





            if(y){
                vd(id,"valid",` `)
                return 1
            }else{
                vd(id,"invalid","Not a valid email address")
                return 0
            }



        },

        password(x,id) {

            // var pass = `<i class="fa-solid fa-check"></i>`
            // var fail = `<i class="fa-solid fa-xmark"></i>`

            var len = x.length
            
            if(!len){vd(id,"required");return 0}

        
            if(len >= 8) {
                vd(id,"valid",` `)
                return 1
            }else{
                vd(id,"invalid",`Password must be at least 8 characters.`)
                return 0
            }

            


        },

        first_name(x,id) {
            var validname = /^[A-Za-z'-\s]+$/;

            
            if(x){

                if(validname.test(x)){
                    console.log(`First name passed`)
                    vd(id,"valid",` `)
                    return 1
                }else{
                    console.log(`First name failed`)
                    vd(id,"invalid","Only letters, spaces, apostrophes, and hyphens")
                    return 0
                }

                
            }else{
                vd(id,"required")
                return 0
            }
        },

        last_name(x,id) {

            var validname = /^[A-Za-z'-\s]+$/;
            if(x){

                if(validname.test(x)){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid","Only letters, spaces, apostrophes, and hyphens")
                    return 0
                }

                
            }else{
                vd(id,"required")
                return 0
            }

        },

        phone(x,id) {
            if(x) {
                
                if(x.match(/\d/g).length === 10){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid","Must be 10 digits")
                    return 0
                }

            }else{
                vd(id,"required")
                return 0
            }
        },

        

        address_1(x,id) {
            if(x) {

                const addressRegex = /^[A-Za-z0-9\s,.'#-]+$/;

                if(addressRegex.test(x)){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid","Invalid address")
                    return 0
                }
            }else{
                vd(id,"required")
                return 0
            }
        },

        address_2(x,id) {
            if(x) {
                if(x.length>=2){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid",`At least 2 characters`)
                    return 0
                }
            }
            else{

                vd(id,"required")
                return 1
                
            }

        },

        city(x,id) {
            if(x){
                if(x.length>=2){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid",`At least 2 characters`)
                    return 0
                }
            }else{
                vd(id,"required")
                return 0
            }
        },
        state(x,id) {

            if(x){
                if(x.length>=2){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid",`At least 2 characters`)
                    return 0
                }
            }else{
                vd(id,"required")
                return 0
            }



        },

        zip(x,id) {
            if(x) {
                
                if(x.length === 5){
                    vd(id,"valid",` `)
                    return 1
                }else{
                    vd(id,"invalid","Must be 5 digits")
                    return 0
                }

            }else{
                vd(id,"required")
                return 0
            }

        },
        contract_signature(x,id) {
            if(x===1) {
                
                return 1

            }

        },
        sms_auth(x,id) {
            return 1

        },
        email_auth(x,id) {
            return 1
        },

        dob(x,id) {
            if(x) {
                
                
                return 1

            }else{
                
                return 0
            }

        },

        gender(x,id) {
            if(x) {
                
               
                return 1

            }else{
                
                return 0
            }

        },

    }

}

function vd(id,status,info) {
    // console.log(j.$(id).querySelector('.ca_input_item'))
       
    j.$(id).querySelector('.ca_input_item').dataset.status = status

    if(info){

        j.$(id).querySelector('.input-message').innerHTML = info


    }else{

        

        j.$(id).querySelector('.input-message').innerHTML = ''

    }

}


async function createAccount(x = ca_logic_val.inputs_serialized) {


    var response = await SERVER.POST('/public/create-student-account',x)
    
    var result = await response.json()

    console.log(result)
    

}






