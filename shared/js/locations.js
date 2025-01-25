


j.runOnPageLoad( function() {


    
    [...document.querySelectorAll('.location-option')].map((v)=>{
        v.addEventListener("click",locSelection.click)
    })

    locSelection.current_active = document.querySelector('.location-option.active-location').dataset.class_location
    
    if(!mobileCalendar.breakpointForMobileCalendar()) {
            gapi.load("client", {
            callback: function () {
                locations.programs.teen_classes.map((v,i)=>{
                    var {address_display,address_src,calender_api,calender_src,name} = v
                    mobileCalendar.printCalendar(calender_api,name)
                })
            },
        });
    }

})



/* -------------------------------------------------------------------------- */


//# Logic for switching selections in the teen driving schools page

const locSelection = {
    current_active:'',

    click(e) {
        var clicked_loc = e.target.dataset.class_location
        if(clicked_loc !== locSelection.current_active) {
            // Deactive currently active
            document.querySelector('.location-option.active-location').classList.toggle('active-location')

            document.querySelector('.loc-container.active-loc').classList.toggle('active-loc')
            //-------
            e.target.classList.toggle('active-location')

            document.querySelector(`.loc-container[data-class_location="${clicked_loc}"]`).classList.toggle('active-loc')

            locSelection.current_active = clicked_loc
        }
    }
}




//#If the mobile breakpoint is hit, this object will load up the mobile version of the calendars









// -----------------------------------------------------------------------





// Loads the JavaScript client library and invokes `start` afterwards.

