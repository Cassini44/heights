







const server =  {

    logout() {
        fetch('/public/logout', {
            method: 'GET',
            credentials: 'include' // This ensures cookies are sent with the request
        })
    },

    /**
     * Completely manual request
     * @param {string} path
     * @param {string} method
     * @param {any} json
     * @returns {any}
     */
    async hdsRequest(path,method,json={}) {
        var res = await fetch(path, {
             method,
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(json),
         });

         return res
    },

    /**
     * Directly calls data functions. This is abstracted further in the api object
     * @param {any} fcn_name name of the function in /secure/data/{}/
     * @param {any} [json] provide paramaters for the request
     * @returns {any}
     */
    async hdsData(fcn_name,json={}) {
        var path = `/secure/data/${user_info.USER_TYPE}/${fcn_name}`

        try {

          var response = await this.hdsRequest(path, "POST", json);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json(); // Parse the JSON response
          return data
        } catch (e) {

          console.error("Error fetching data:", e);

        }
    },

    db_enums : {
        CHARGE_STATUS:  ["Pending", "Partially Paid", "Paid", "Cancelled"],
        COURSE_CATEGORY:  ["Adults", "Teens", "Seniors", "Disabilities", "Other"],
        COURSE_TYPE:      ["Class", "Driving", "Evaluation"],
        DELIVERY_METHOD:  ["Heights Classroom", "High School Classroom", "Online", "Virtual", "Behind the Wheel", "Other"],
        LOCATION_TYPE:    ["On Site", "Web Browser", "Student Designated"],
        PAYMENT_METHOD:   ["Credit Card", "Check", "Cash", "Other"],
        USER_TYPE:        ["ADMIN", "INSTRUCTOR", "STUDENT", "OFFICE"],
        GENDER:           ["F", "M", "OTHER"]
    }


}






export default server

window.server = server









  
