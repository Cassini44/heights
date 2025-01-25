
const active = {
    input_user : document.getElementById('username'),
    input_pass : document.getElementById('password'),
    button_login : document.getElementById('login'),
    form : document.getElementById('login-form')
}






//when page loads, do this

window.onload = (() => {

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

    
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        // Send login request to the server
        const response = await fetch("/public/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        // Check if the response was successful
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Login failed:", errorText);
          document.getElementById('password-error-message').classList.remove('invisible')
          return;
        }

        // On successful login, the token is already stored in a cookie, so redirect the user
        window.location.href = "/secure/home"; // Redirect to the dashboard or interface page
      } catch (error) {
        console.error("Error during login:", error);
        
      }
    });



})







