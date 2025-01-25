







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




    api : {

        
        
        getData : {

            /**
             * Pulls all user data for eahc user brought into the query
             * @param {object} filters In the form of {column_name: 'filter expression'}
             * @returns 
             */
            async getAllUsers(filters) {
                let response = await server.hdsData('getAllUsers',filters);
                return response.data
            },

            /**
             * Pulls all user data for eahc user brought into the query
             * @param {object} filters In the form of {column_name: 'filter expression'}
             * @returns 
             */
            async getLookupTable(filters) {
                let response = await server.hdsData('getLookupTable',filters);
                return response.data
            },
            
            


        }

        

        

    },
    

}






export default server

window.server = server









  
