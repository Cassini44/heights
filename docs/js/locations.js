


j.runOnPageLoad( function() {

    [...document.querySelectorAll('.location-option')].map((v)=>{
        v.addEventListener("click",locSelection.click)
    })
    locSelection.current_active = document.querySelector('.location-option.active-location').dataset.class_location
    
    if(!locations.breakpointForMobileCalendar()) {
            gapi.load("client", {
            callback: function () {
                mobileCalendar.loadMobileCalendar();
                
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
const mobileCalendar = {

    loadMobileCalendar() {
    
        locations.programs.teen_classes.map((v,i)=>{
            var {address_display,address_src,calender_api,calender_src,name} = v
            mobileCalendar.printCalendar(calender_api,name)
        })

        

    },



    printCalendar(calendarId,name) {
    
    
        var apiKey = 'AIzaSyBksWZ8E6qnfN-Nlp8SG7myS-xHcED1kS0';
    
        var userTimeZone = "US/Eastern";
    
        // Initializes the client with the API key and the Translate API.
        gapi.client.init({
            'apiKey': apiKey,
            // Discovery docs docs: https://developers.google.com/api-client-library/javascript/features/discovery
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        }).then(function () {
            // Use Google's "apis-explorer" for research: https://developers.google.com/apis-explorer/#s/calendar/v3/
            // Events: list API docs: https://developers.google.com/calendar/v3/reference/events/list
            
            return gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'timeZone': userTimeZone,
                'singleEvents': true,
                'timeMin': (new Date()).toISOString(), //gathers only events not happened yet
                'maxResults': 50,
                'orderBy': 'startTime'
            });
        }).then(function (response) {
            // console.log(response.result.items)
            if (response.result.items) {

                var arr = [['Class Number','Date','Start','End']]
    
                
                response.result.items.forEach(function(entry) {
                    
                    var startsAt = entry.start.dateTime
                    var endsAt   = entry.end.dateTime
                    var date = new Date(startsAt)
                    var date2 = new Date(endsAt)
    
                    var datestring = date.toLocaleDateString('en-US')
                    var starttime = date.toLocaleTimeString('en-US', { hour: 'numeric',minute: '2-digit', hour12: true })
                    var endtime = date2.toLocaleTimeString('en-US', { hour: 'numeric',minute: '2-digit', hour12: true })
                    var location_name = entry.organizer.displayName
                    var class_number = entry.summary

                    datestring = datestring==='Invalid Date' ? '-' : datestring
                    starttime = starttime==='Invalid Date' ? '-' : starttime
                    endtime = endtime==='Invalid Date' ? '-' : endtime
                    
                    arr.push([class_number,datestring,starttime,endtime])
                    
                });

                createDataTable(`[data-class_location_mobile_cal="${name}"]`,arr)
                


    
                
    
            }
    
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    }
}








// -----------------------------------------------------------------------





// Loads the JavaScript client library and invokes `start` afterwards.

