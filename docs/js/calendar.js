

const class_calendar = {}

function printCalendar(calendarId) {
  
    
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
            'maxResults': 20,
            'orderBy': 'startTime'
        });
    }).then(function (response) {
        if (response.result.items) {

            var calendarRows = ['<table class="wellness-calendar"><tbody>'];
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

                if(class_calendar[location_name]){
                    class_calendar[location_name].push([class_number,datestring,starttime,endtime])
                }else{
                    class_calendar[location_name] = [['Class Number','Date','Start','End']]
                }

            });


            calendarRows.push('</tbody></table>');
            
           
        }
    }, function (reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}

// Loads the JavaScript client library and invokes `start` afterwards.
gapi.load('client');