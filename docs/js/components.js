/**------------------------------------------
Author : Nick Janosky - nyden1414@gmail.com


Basic flow:
<hds-footer></hds-footer>
<div> PAGE BEIGNS HERE WITHIN THIS DIV </div>
<hds-header></hds-header>

-----------------------------------------*/

class HdsHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `${core_components.header}`
        this.id = 'c-header'
        this.className = 'header-flex'
       
    }
}
customElements.define('hds-header', HdsHeader);


class HdsFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `${core_components.footer}`
        this.id = 'c-footer'
    }
}
customElements.define('hds-footer', HdsFooter);


class SiteNavigation extends HTMLElement {
    connectedCallback() {
        let page_group = this.getAttribute("data-page_group")
        this.innerHTML = `${navigations.generateNavigation(page_group)}`
    }
}
customElements.define('site-navigation', SiteNavigation);


// ==========================================

class MobileNavigation extends HTMLElement {
    connectedCallback() {
        let page_group = this.getAttribute("data-page_group")
        this.className = 'mobile-navigation-container'
        this.innerHTML = `${mobileMenu.generateMobileNavigation(page_group)}`
    }
}
customElements.define('mobile-navigation', MobileNavigation);








/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
const j = {




}


const tables = {

}

const navigations = {
    /**
     * ---
     * @description Used for keeping consistent naviagtions across the website
     * 
     * Contact nyden1414@gmail.com if you need any more info on this
     * @param {string} nav_type As defined in navigations, use the property that represents the menu item set
     * @param {boolean} isHeaders tells the script that this navigation exists in the header and thus has a parent element already with that link
     * @returns HTML string
     */
    generateNavigation(nav_type,isHeaders) {

         /* The title of the html page should have a coresponding entry in one of the objects currentpageTitle properties
            If the entry matches the current page title, it assigns a class that highlights that menu entry to show the user is currently on that page
         */ 
        var page_title = document.title 


        let nav = navigations.sections[nav_type].links.reduce((acc,v) => {
            if(isHeaders && v.isHome){return acc} // This prevents the menu in the header from containing the 'home' link, since its accesbile by clicking on the menus parent element
            var isactive = v.currentpageTitle === page_title?'active-navigation-item':''
            var subnav = (!v.isHome) && (!isHeaders) ? 'sub-navigation-item' : ''

            
            acc+=`<li class="${isactive} ${subnav}"><a href="${v.link}">${v.display}</a></li>`
            return acc
        },'')
        return `<ul>${nav}</ul>`
    },
    
    /**
     * display - what actually is shown to the user
     * link -  destination of navigation item
     * currentpageTitle - if this property matches the current documents title, it styles that list item with active-navigation-item
     */

    /**
     * display - what actually is shown to the user
     * link -  destination of navigation item
     * currentpageTitle - if this property matches the current documents title, it styles that list item with active-navigation-item
     */

    sections: {
        teens: {
            section_title: 'Teens',
            links: [

                {
                    display: 'Teen Drivers Education',
                    link: 'teens-home.html',
                    currentpageTitle: 'Ohio Teen Drivers Education',
                    isHome: true
                },
                {
                    display: 'Classroom Locations',
                    link: 'teens-locations.html',
                    currentpageTitle: 'Ohio Classroom Locations'
                },
                {
                    display: 'High School Classes',
                    link: 'teens-highschool-classes.html',
                    currentpageTitle: 'Ohio High School Drivers Ed'
                },
                {
                    display: 'Virtual Classes',
                    link: 'teens-virtual-classes.html',
                    currentpageTitle: 'Ohio Virtual Driving Classes'
                },
                {
                    display: 'Online Classes',
                    link: 'teens-online-classes.html',
                    currentpageTitle: 'Ohio Online Drivers Ed'
                },
                {
                    display: 'Behind the Wheel',
                    link: 'teens-btw.html',
                    currentpageTitle: 'Ohio Behind the Wheel Training'
                }
            ]
        },


        adults: {

            section_title: 'Adults',

            links: [{
                    display: 'Adult Driving Courses',
                    link: 'adults-home.html',
                    currentpageTitle: 'Ohio Adult Driving Courses',
                    isHome: true
                },
                {
                    display: 'Abreviated Program',
                    link: 'adults-abreviated.html',
                    currentpageTitle: 'Ohio Adult Abbreviated Program'
                },
                {
                    display: 'Remedial Program',
                    link: 'adults-remedial.html',
                    currentpageTitle: 'Ohio Adult Remedial Program'
                },
                {
                    display: 'Driving Lessons',
                    link: 'adults-lessons.html',
                    currentpageTitle: 'Ohio Adult Driving Lessons'
                }
            ]

        },

        disabilities: {

            section_title: 'Disabilities',
            links: [{
                    display: 'Disabilities and Driving',
                    link: 'disabilities-home.html',
                    currentpageTitle: 'Disabilities and Driving',
                    isHome: true
                },
                {
                    display: 'ADHD/ADD',
                    link: 'disabilities-adhd.html',
                    currentpageTitle: 'Driving with ADHD/ADD'
                },
                {
                    display: 'Autism',
                    link: 'disabilities-autism.html',
                    currentpageTitle: 'Driving with Autism'
                },
                {
                    display: 'Amputation',
                    link: 'disabilities-amputees.html',
                    currentpageTitle: 'Driving after Amputation'
                },
                {
                    display: 'Arthritis',
                    link: 'disabilities-arthritis.html',
                    currentpageTitle: 'Driving with Arthritis'
                },
                {
                    display: 'Bioptics',
                    link: 'disabilities-bioptics.html',
                    currentpageTitle: 'Driving with Bioptics'
                },
                {
                    display: 'Cerebral Palsy',
                    link: 'disabilities-cerebral-palsy.html',
                    currentpageTitle: 'Driving with Cerebral Palsy'
                },
                {
                    display: 'Working with the Deaf',
                    link: 'disabilities-deafness.html',
                    currentpageTitle: 'Driving while Deaf'
                },
                {
                    display: 'Multiple Sclerosis',
                    link: 'disabilities-ms.html',
                    currentpageTitle: 'Driving with Multiple Sclerosis'
                },
                {
                    display: 'Spina Bifida',
                    link: 'disabilities-spina-bifida.html',
                    currentpageTitle: 'Driving with Spina Bifida'
                },
                {
                    display: 'Spinal Cord Injury',
                    link: 'disabilities-spinal-cord-injury.html',
                    currentpageTitle: 'Driving with a Spinal Cord Injury'
                },
                {
                    display: 'Stroke',
                    link: 'disabilities-stroke.html',
                    currentpageTitle: 'Driving after a Stroke'
                },
                {
                    display: 'Traumatic Brain Injury',
                    link: 'disabilities-tbi.html',
                    currentpageTitle: 'Driving after a Traumatic Brain Injury'
                }
            ]
        },


        seniors: {
            section_title: 'Seniors',
            links: [{
                display: 'Aging and Driving',
                link: 'seniors-home.html',
                currentpageTitle: 'Aging and Driving',
                isHome: true
            }]
        }
    },
}


const core_components = {

    header : `
    <a href="index.html"class="heights-logo"><img class="heights-logo" src="images/heights_logo_1.png"></a>


        <a class="call-office" href="tel:440-449-3300"><i class="fa-solid fa-phone icon"></i><span
                class="call-office phone-number">440-449-3300</span></a>
        
                <nav class="navigation-menu-container">

            <ul>
                
                
                <li class="menu-top"><a href="teens-home.html" class="navigation-menu-item">Teens </a>
                    ${navigations.generateNavigation('teens',true)}
                </li>
                <li class="menu-top"><a href="adults-home.html" class="navigation-menu-item">Adults</a>
                    ${navigations.generateNavigation('adults',true)}
                </li>
                <li class="menu-top"><a href="disabilities-home.html" class="navigation-menu-item">Disabilities</a>
                    ${navigations.generateNavigation('disabilities',true)}
                </li>
                <li class="menu-top"><a href="seniors-home.html" class="navigation-menu-item">Seniors</a>
                    ${navigations.generateNavigation('seniors',true)}
                </li>
                <li class="menu-top"><a href="teens-home.html" class="navigation-menu-item">Helpful Information</a>
                    <ul>
                        <li ><a href="#">Option 1</a></li>
                    </ul>
                </li>

                <!------>
                <!------>
            </ul>

           

        </nav>
        <button id="login-button-text" onclick="location.replace('login.html')"class="login-button"><div class="icon-join-box"><span class="material-icons">login</span> Log In </div></button>

        <button id="login-button-no-text" onclick="location.replace('login.html')"class="login-button"><div class="icon-join-box"><span class="material-icons">login</span></div></button>
    `,
    footer: `
        
        <div class="footer-1">
            <h3>Contact <hr> </h3>


            
            <div class="footer-info-container">
            
            <div class="footer-info-section"><span class="footer-info-title">Main Office<hr></span>
            <div class="footer-info-box">
                <div><span class="material-icons location-icon footer-icon">place</span></div>
                <div  class="footer-info-text">771 Beta Dr. Mayfield Village, OH 44143<br>Mayfield Village, OH 44143</div>
            </div></div>

            <div class="footer-info-section"><span class="footer-info-title">Phone<hr></span>

            <div class="footer-info-box">
                <div><span class="material-icons phone-icon footer-icon">contact_phone</span></div>
                <div class="footer-info-text"><a class="footer-info-text" href="tel:440-449-3300">440-449-3300</a></div>
            </div></div>

            <div class="footer-info-section"><span class="footer-info-title">Email<hr></span>
            <div class="footer-info-box">
                <div><span class="material-icons email-icon footer-icon">email</span></div>
                <div ><a  class="footer-info-text" href = "Heightsdriving@gmail.com ">Heightsdriving@gmail.com </a></div>
            </div></div>

            <div class="footer-info-section"><span class="footer-info-title">Office Hours<hr></span>
            <div class="footer-info-box">
                <div><span class="material-icons hours-icon footer-icon">schedule</span></div>
                <div class="footer-info-text"> Mon-Thur: 10:00AM - 5:00PM <br> Fri: 10:00AM - 4:00PM </div>

            </div></div>
        
        </div>
        </div>
        <div class="footer-2">
            <ul>
                
            </ul>
        </div>
        <div class="footer-3">
            <div id="logos-container">
                
            </div>
        </div>
        <div class="footer-4">
            <span>© 1999 - 2024 Heights Driving School. All rights reserved. I 440-449-3300 I info@heightsdriving.com</span>
        </div>
    `,
    mobile : `

    
    
    
    `

}




/*〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓 */
/*//!〓〓〓〓〓〓〓            MOBILE          〓〓〓〓〓〓〓〓〓〓〓 */
/*〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓 */

var l = console.log





const mobileMenu = {

    toggle : false,

    submenu_closed: 'fa-chevron-right',
    submenu_open : 'fa-chevron-down',



    get menu_toggle_element(){ return document.getElementById('mobile-menu-navigation')},
    get header_element() {return document.getElementById('c-header')},
    get mobile_popup_element() {return document.getElementById('mobile-navigation-popup')},


    init() {
        var menublock =  mobileMenu.menu_toggle_element

        if(!menublock){console.log('No mobile menu for this page');return}
        menublock.addEventListener('click',(e) =>  {
            mobileMenu.toggle = !mobileMenu.toggle
            if(mobileMenu.toggle){mobileMenu.open()}else{mobileMenu.close()}
        })
    },



    open() {
        var menublock =  mobileMenu.menu_toggle_element
        menublock.classList.toggle('open')
        mobileMenu.calcMenuHeight(true)
        menublock.innerHTML = `
            <i class="fa-solid fa-x"></i>
            <span>Close</span>
        `
        console.log([...menublock.classList])
        
    },




    close() {
        var menublock = mobileMenu.menu_toggle_element
        menublock.classList.toggle('open')
        mobileMenu.calcMenuHeight(false)


        menublock.innerHTML = `
            <i class="fa-solid fa-bars icon"></i>
            <span>Menu</span>
        `
    },


   calcMenuHeight(isopening) {
    var popup = mobileMenu.mobile_popup_element
    var menublock = mobileMenu.menu_toggle_element.getBoundingClientRect()
    var header = mobileMenu.header_element.getBoundingClientRect()

    if(!isopening) {
        popup.style.display = 'none' //~Close the popup
        return
    }
    var space = menublock.top - header.bottom

    popup.classList.add('menu-pop-open')
    popup.style.height = `${space}px`
    popup.style.display = 'flex' //~Opens the popup

   },
//fa-chevron-down
   menuClick(x) {
    
    var icon = x.querySelector('i')
    var block = x.querySelector('mobile-navigation-block')
    var menu = x.nextElementSibling

    var classlist = icon.classList

    //it must be getting opened if its currently closed
    if(classlist.contains(mobileMenu.submenu_closed)) {
        classlist.replace(mobileMenu.submenu_closed,mobileMenu.submenu_open)
        menu.classList.add('mobile-navigation-block-active')
    }else{
        classlist.replace(mobileMenu.submenu_open,mobileMenu.submenu_closed)
        menu.classList.remove('mobile-navigation-block-active')
    }
    

    
    

   },

   generateMobileNavigation(nav_type) {
       var page_title = document.title

       var sections = Object.keys(navigations.sections) //?




       let nav = sections.reduce((acc, v) => {

           var { section_title, links } = navigations.sections[v]


           var block = links.reduce((acc2, v2) => {
               // v2
               var { isHome, currentpageTitle, link, display } = v2
               var currentpage = currentpageTitle === page_title ? 'mobile-navigation-item-active' : ''
               var linkblock = `<div class="${currentpage} mobile-navigation-item"> <a href="${link}">${display}</a> </div>`
               acc2 += linkblock
               return acc2
           }, '')
           acc += `
                    <div onclick="mobileMenu.menuClick(this)" class="mobile-navigation-section">
                        <span class="mobile-navigation-section-title">${section_title}</span> 
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <div class="mobile-navigation-block">${block}</div>  
                `

           return acc
       }, '')


       return nav
   }


}



