







/**
 * 
 * @param {string} id The queryselector arg to find the element of tableLayout: 
 * @param {[][]} y 2d array of data where first index is headers
 * @param {string} formatfcn name of formatting function found in the loadtables object
 * @param {string} scrollheight argument given to scrollY, locks the height of the table body to a certain ammount and creates a scrollbar
 */
function createDataTable(id,y,formatfcn,scrollheight,width="25px") {

    if(formatfcn) { y = loadTables.formatFunctions[formatfcn](y) }
   

    
    if(document.querySelector(id)){
    var cols = y.shift().map(v => { return {title:v,"width":width}})
    new DataTable(id, {
        scrollY : scrollheight??'',
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










/**Utility functions */
const j = {

    /**
     * 
     * @param {string} css_selector query selector string
     * @returns 1d array of html elements
     */
    q(css_selector) {return [...document.querySelectorAll(css_selector)]},

    /**
     * getElementById
     * @param {string} id element ID 
     * @returns element
     */
    $(id) {return document.getElementById(id)},


    getClientRect(id) {return j.$(id).getBoundingClientRect()},

    /**
     * 
     * @param {Function} fcn this function runs when the page loads
     */
    runOnPageLoad(fcn) {window.addEventListener('load',fcn)},

    tsvToArray(x) { return x.split('\r\n').map(v=>v.split('\t')) },

    /**
     * 
     * @param {string} html_string string to be added to end of html body for current page
     */
    insertHTML(html_string) {[...document.getElementsByTagName('body')][0].insertAdjacentHTML('beforeend', html_string);},

    detectMobile() {
        const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i,
        ];
      
        return toMatch.some((toMatchItem) => {
          return navigator.userAgent.match(toMatchItem);
        });
    },

    /**
     * 
     * @param {string} x name of css variable within :root
     * @param {string} [value_to_change]  if present, will set the css variable to this new value
     */
    cssVar(x,value_to_change) {
        var root = document.documentElement;
        var current_value = getComputedStyle(document.querySelector(':root')).getPropertyValue(x);
        
        if(value_to_change){
            root.style.setProperty(x,value_to_change)
        }
        var new_current_value = root.style.getPropertyValue(x)
        console.log(`${current_value} ----> ${new_current_value}`)
        return new_current_value||current_value
    },

    /**
     * @param {string} x Value that will be wrappe din <span> tags
     * @param {string} [span_attributes] Set the attributes for the span such as class. This will be inserted directly into the html text. A valid example: `class="test"`
     */
    wrapInSpan(x,span_attributes) {
        return `<span ${span_attributes||''}>${x}</span>`
    },

    getPageName() {
        return window.location.pathname.split("/").pop().replace('.html','');
    }

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







// function updateSize() {
//     document.querySelector("#height").textContent = window.innerHeight;
//     document.querySelector("#width").textContent = window.innerWidth;
// }

// j.runOnPageLoad(()=>{
    
//     j.insertHTML(`
//     <div class="modal-container">
//     <div>X:<span id="width">0</span></div>
//     <div>Y:<span id="height">0</span></div>
//     <div>${j.detectMobile()}</div>
//     </div>
//     `)
//     updateSize();
//     window.addEventListener("resize", updateSize);
// })


