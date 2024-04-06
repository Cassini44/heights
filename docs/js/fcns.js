




function createDataTable(id,y) {

    
    if(document.querySelector(id)){
    var cols = y.shift().map(v => { return {title:v,"width":20}})
    new DataTable(id, {

        columns: cols,
        data: y,
        searching:false,
        ordering:false,
        lengthChange: false,
        info:false,
        paging:false,
        autoWidth: false,
    });
    }
}



function tsvToArray(x) {
    return x.split('\r\n').map(v=>v.split('\t'))
}




/**Utility functions */
const j = {
    q(css_selector) {return [...document.querySelectorAll(css_selector)]},
    $(id) {return document.getElementById(id)},
    getClientRect(id) {return j.$(id).getBoundingClientRect()},
    runOnPageLoad (fcn) {window.addEventListener('load',fcn)}

}









/* -------------------------------------------------------------------------- */
/** 
 The point of this is to replace the loading spinner 
 with the content only after all iframes are loaded
*/
var iframeLoadCheck = 0
var num_of_iframes;



/** 
    Each iframe, generated as a web component, based off of the defined the locations/programs object 
    on the js/components page has this as its onload function. 
  
    Each time an iframe loads, it incremements iframeloadcheck. 
    Each load will test whether iframeloadcheck is equal
    to the number of iframes within the document
*/
function registerIframeLoad() {
    const iframesCount = [...document.querySelectorAll('iframe[data-hds_iframe="1"]')].length
    iframeLoadCheck++
    console.log(iframeLoadCheck)
    if(iframesCount === iframeLoadCheck){
        document.getElementById('location-load-spinner').style.display = 'none'
        document.getElementById('hds-locations-outermost-container').style.display = 'grid'

    }
}
/* -------------------------------------------------------------------------- */




