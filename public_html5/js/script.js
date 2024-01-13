/*
  * Author: Nick Janosky (nyden1414@gmail.com)
  * 2023  
*/

window.onload = (function(){
    loadTables.teen_driving_homepage()
    
})


const loadTables = {
    register_button: `<button class="register_button_table">Enroll</button>`,
    teen_driving_homepage() {

        createDataTable('#courses-teen-all',[
            ['Course','Price',''],
            ['HEIGHTS PREFERRED','$595',loadTables.register_button],
            ['IN PERSON CLASS + 8 HR DRIVE','$450',loadTables.register_button],
            ['ZOOM CLASS + 8 HR DRIVE','$450',loadTables.register_button],
            ['ONLINE CLASS + 8 HR DRIVE','$500',loadTables.register_button],
            ['ONLINE CLASS + 10 HR DRIVE','$595',loadTables.register_button],
            ['IN PERSON CLASS','$175',loadTables.register_button],
            ['ONLINE CLASS','$80',loadTables.register_button],
            ['8 HR DRIVE','$435',loadTables.register_button]
        ])
    }

}






