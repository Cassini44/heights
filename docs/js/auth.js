
const active = {
    input_user : document.getElementById('username'),
    input_pass : document.getElementById('password'),
    button_login : document.getElementById('login'),
    form : document.getElementById('login-form')
}






//when page loads, do this

window.onload = (() =>{

    active.button_login.className = "login-not-ready"
    active.button_login.disabled = true

    active.form.addEventListener('input', () => {

        if(active.input_pass.value && active.input_user.value){

            active.button_login.className = "login-ready"
            active.button_login.disabled = false

            
        }else{
            active.button_login.className = "login-not-ready"
            active.button_login.disabled = true
        }

    }, false);
})


