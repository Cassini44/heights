/*
  * Author: Nick Janosky (nyden1414@gmail.com)
  * 2023  
*/



// LOADS ON EVERY PAGE
window.onload = (function(){
    mobileMenu.init()

    loadTables.teen_driving_homepage()
    loadTables.adult_lessons()
    loadTables.adult_remedial()
    loadTables.adult_abbreviated()

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
    },

    adult_lessons() {

        createDataTable('#courses-adults-lessons',[
            ['Course','Price',''],
            ['6 Hours','$550',loadTables.register_button],
            ['4 Hours','$365',loadTables.register_button],
            ['Per 2 Hours','$180',loadTables.register_button]
        ])
    },
    
    adult_remedial() {

        createDataTable('#courses-adults-remedial',[
            ['Course','Price',''],
            ['In Person','$80',loadTables.register_button],
            ['Online','$80',loadTables.register_button]
        ])
    },

    adult_abbreviated() {

        
        createDataTable('#courses-adults-abbreviated',[
            ['Course','Price',''],
            ['In-Person Class Only','$175',loadTables.register_button],
            ['Online Class Only','$85',loadTables.register_button],
            ['Driving Only','$365',loadTables.register_button],
            ['In-Person Class + Driving','$85',loadTables.register_button],
            ['Online Class + Driving','$85',loadTables.register_button]
        ])
    },


}













