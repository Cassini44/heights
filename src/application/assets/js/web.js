const web = {

    copyToClipBoard(x) {
        navigator.clipboard.writeText(x).then(() => {
            console.log("Text copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    },

    /**
     * Adds a class to any selectors that match a selector
     * @param {*} css_selector If it matches this selector, the class will be added to it
     * @param {*} classname Classname to add to matches
     */
    addClassTo(css_selector,classname) {
        web.q(css_selector).map((v)=>{
            v.classList.add(classname)
        })
    },

    /**
     * Any element with this class will have it removed
     * @param {string} x class name without a dot
     */
    removeClassFromAll(classname) {
        web.q(`.${classname}`).map((v)=>{
            v.classList.remove(classname)
        })
    },


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

    debug_css : {
        
        traceParentHeights(css_selector) {
            let currentElement = document.querySelector(css_selector);
        
            while (currentElement) {
                // Get computed styles for the element
                const computedStyle = window.getComputedStyle(currentElement);
        
                // Extract box model details
                const marginTop = parseFloat(computedStyle.marginTop);
                const marginBottom = parseFloat(computedStyle.marginBottom);
                const paddingTop = parseFloat(computedStyle.paddingTop);
                const paddingBottom = parseFloat(computedStyle.paddingBottom);
                const borderTopWidth = parseFloat(computedStyle.borderTopWidth);
                const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth);
        
                // Log detailed information about the element
                console.log({
                    tagName: currentElement.tagName,
                    id: currentElement.id || "(no id)",
                    className: currentElement.className || "(no class)",
                    offsetHeight: currentElement.offsetHeight, // Total visible height (padding + content + border)
                    computedHeight: computedStyle.height, // CSS height (content only, no padding/border/margin)
                    margin: {
                        top: marginTop,
                        bottom: marginBottom,
                        total: marginTop + marginBottom,
                    },
                    padding: {
                        top: paddingTop,
                        bottom: paddingBottom,
                        total: paddingTop + paddingBottom,
                    },
                    border: {
                        top: borderTopWidth,
                        bottom: borderBottomWidth,
                        total: borderTopWidth + borderBottomWidth,
                    },
                    totalHeight: currentElement.offsetHeight + marginTop + marginBottom, // Includes margin
                });
        
                // Move to the parent element
                currentElement = currentElement.parentElement;
            }
        }

    }





}



export default web
window.web = web
