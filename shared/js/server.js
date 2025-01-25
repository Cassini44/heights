









const SERVER = {

    async GET(path,json) {

       return await fetch(path, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        });
        
    },
    async POST(path,json) {
        return await fetch(path, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        });
    }




}