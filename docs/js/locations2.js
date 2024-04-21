


j.runOnPageLoad( function() {


    if(!mobileCalendar.breakpointForMobileCalendar()) {
            gapi.load("client", {
            callback: function () {
                
                    var {address_display,address_src,calender_api,calender_src,name} = locations.programs.zoom
                    mobileCalendar.printCalendar(calender_api,name,false,'27vh')
                
            },
        });
    }

})
