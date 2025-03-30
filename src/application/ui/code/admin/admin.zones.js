import t from "@shared_js/TableEngine.js"
import server from "@shared_js/server.js"





// This example adds a user-editable rectangle to the map.
export default function() {

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.489904, lng: -81.517437 }, //41.489904, -81.517437
      zoom: 11,
      mapId: "f9bd1ad9de8dec9f",
    });

   

    const hds = [
        {lat:41.488347,lng: -81.607387} ,
        {lat:41.487190,lng: -81.640175},
        {lat:41.513546,lng: -81.641033},
        {lat:41.533980,lng: -81.553142}
      ];
    // Define a rectangle and set its editable property to true.
    var poly = new google.maps.Polygon({
        map,
        paths: hds,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        draggable: true,
        editable: true,
        geodesic: true,
      });
  
      poly.setMap(map);
    // listen to changes
    ["bounds_changed", "dragstart", "drag", "dragend"].forEach((eventName) => {
        poly.addListener(eventName, () => {
        console.log({ bounds: poly.getBounds()?.toJSON(), eventName });
      });
    });
}
