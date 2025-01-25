/// <reference path="../../../../shared/js/fcns.js" />

import web from "../../assets/js/web.js"



// The auto version
window.addEventListener("popstate", () => {
    const route = window.location.pathname.match(/secure\/(?<id>.*)/).groups.id.trim()
    navigateSidebar(route)
});

window.addEventListener('DOMContentLoaded',() =>{
    const route = window.location.pathname.match(/secure\/(?<id>.*)/).groups.id.trim()
    navigateSidebar(route)
})


function navigateTo(id,listItem) {
    if(window.location.pathname.match(/secure\/(?<id>.*)/).groups.id.trim() === id){return;}
    history.pushState(null, "", `/secure/${id}`); // Change the URL without reloading
    navigateSidebar(id)
}


/* NEED TO CREAT SOMETHING THAT RUNS CODE WHEN A FORM IS NAVIGATED TO */
function navigateSidebar(x) {

    web.removeClassFromAll('active-navigation-item')
    
    web.addClassTo(`li[onclick="navigateTo('${x}')"]`,'active-navigation-item')
    
    
    web.q(".form-container").map((v) => {
    if (v.id === x) {
        v.classList.add("form-active");
    } else {
        v.classList.remove("form-active");
    }
    });
}




window.navigateTo = navigateTo


