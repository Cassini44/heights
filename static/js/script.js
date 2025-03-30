/*
  * Author: Nick Janosky (nyden1414@gmail.com)
  * 2023  
*/







j.runOnPageLoad( () => {
    mobileMenu.init()
    loadTables.teen_driving_homepage()
    loadTables.adult_lessons()
    loadTables.adult_remedial()
    loadTables.adult_abbreviated()
    loadTables.seniors()
    loadTables.disability()
    loadTables.teens_highschool_nordonia()
    loadTables.teens_highschool_padua()

    // console.table(j.q('*').reduce((acc,v)=>{
    //     var rect = v.getBoundingClientRect()
    //     var  width = rect.width
    //     if(width && (v.id === 'c-mobile' || v.id === 'c-header')) {

    //         acc.push([
    //             v.id,
    //             width,
                
    //         ])
    //     }
    //     return acc
    // },[]).sort((a,b)=>{return a[1] - b[1]}))
})


/** Obviously, this data shouldnt be hardcoded into an object but without database access
 *  (at current time in development) this must be done to show the client what the pages will look
 *  like while still developing the general path that this script will take when pulling from the
 *  database
 */
const loadTables = {
    register_button: `<button class="register_button_table"  onclick="location.href='https:\/\/login.heightsdriving.com/system/enroll';">Enroll</button>`,

    formatFunctions : {

        enrollment(x) {
            return x.map((v,i)=>{ 
                
                    v[0] = j.wrapInSpan(v[0],'data-course-name')
                    v[1] = j.wrapInSpan(v[1],'data-price_column')
                    v[2] = j.wrapInSpan(v[2],'data-enroll-button')
                
                return v
            })
        },
        highschool_program(x) {
            return x.map((v,i)=>{ 
                return v.map(v2 => j.wrapInSpan(v2,'data-highschool-programs'))
        })
        }




    },



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
        ],'enrollment')
    },

    adult_lessons() {

        createDataTable('#courses-adults-lessons',[
            ['Course','Price',''],
            ['6 Hours','$550',loadTables.register_button],
            ['4 Hours','$365',loadTables.register_button],
            ['Per 2 Hours','$180',loadTables.register_button]
        ],'enrollment')
    },
    
    adult_remedial() {

        createDataTable('#courses-adults-remedial',[
            ['Course','Price',''],
            ['In Person','$80',loadTables.register_button],
            ['Online','$80',loadTables.register_button]
        ],'enrollment')
    },

    adult_abbreviated() {

        
        createDataTable('#courses-adults-abbreviated',[
            ['Course','Price',''],
            ['In-Person Class Only','$175',loadTables.register_button],
            ['Online Class Only','$85',loadTables.register_button],
            ['Driving Only','$365',loadTables.register_button],
            ['In-Person Class + Driving','$85',loadTables.register_button],
            ['Online Class + Driving','$85',loadTables.register_button]
        ],'enrollment')
    },
    disability() {

        
        createDataTable('#courses_evaluation',[
            ['Course','Price',''],
            ['Special Needs Enrollment','$375',loadTables.register_button],
        ],'enrollment')
    },
    
    seniors() {
        createDataTable('#courses_senior',[
            ['Course','Price',''],
            ['Seniors Driving Evaluation','Call for Pricing',loadTables.register_button],
        ],'enrollment')
    },

    teens_highschool_padua() {
        createDataTable('#padua_schedule',[
            ['Fall','Winter','Spring'],
            ['10/02/23','01/22/24','05/06/24'],
            ['10/03/23','01/23/24','05/07/24'],
            ['10/04/23','01/24/24','05/08/24'],
            ['10/05/23','01/25/24','05/09/24'],
            ['10/06/23','01/29/24','05/13/24'],
            ['10/09/23','01/30/24','05/14/24'],
            ['10/10/23','01/31/24','05/15/24'],
            ['10/11/23','02/01/24','05/16/24'],
        ],'highschool_program','',"33%")
    },
    teens_highschool_nordonia() {
        createDataTable('#nordonia_schedule',[
            ['Session 1','Session 2'],
            ['03/04/24','03/18/24'],
            ['03/05/24','03/20/24'],
            ['03/06/24','03/21/24'],
            ['03/07/24','03/22/24'],
            ['03/11/24','03/25/24'],
            ['03/12/24','03/26/24'],
            ['03/13/24','03/27/24'],
            ['03/14/24','03/28/24'],
            [loadTables.register_button,loadTables.register_button],
        ],'highschool_program','',"50%")
    }


}













