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
        this.id = 'c-mobile'
        this.innerHTML = `${navigations.generateMobileNavigation(page_group)}`
    }
}
customElements.define('mobile-nav', MobileNavigation);


class HdsLocations extends HTMLElement {
    connectedCallback() {
        this.id = 'locations-container'
        this.innerHTML = `${locations.generateLocations()}`
    }
}
customElements.define('hds-locations', HdsLocations);


class HdsZoomCalendar extends HTMLElement {
    connectedCallback() {
        this.id = 'zoom-calendar'
        this.innerHTML = `${locations.generateZoomCalendar()}`
    }
}
customElements.define('hds-zoom', HdsZoomCalendar);









/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */





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




    generateMobileNavigation(nav_type) {
        var page_title = document.title
 
        var sections = Object.keys(navigations.sections) //?
 
 
 
 
        let nav = sections.reduce((acc, v) => {
         
 
            var { section_title, links } = navigations.sections[v]
 
 
            var block = links.reduce((acc2, v2) => {
                // v2
                var { isHome, currentpageTitle, link, display } = v2
                var currentpage = currentpageTitle === page_title ? 'mnav-item-active' : ''
                var ishome = isHome ? 'mnav-item-home' : 'mnav-item-not_home'
                var submenuitem = !isHome ? '<span class="material-icons">subdirectory_arrow_right</span>' : '<span></span>'

                //➕
                var linkblock = `
                <div class="${ishome} ${currentpage} mnav-item"> 
                    <a href="${link}">
                        <div class="mnav-item-display">
                        ${submenuitem} 
                        <span>${display}</span> 
                        </div>
                    </a> 
                </div>
                `
                acc2 += linkblock
                return acc2
            }, '')


            //➕
            acc += `
                     <div onclick="mobileMenu.menuClick(this)" class="mnav-section">
                         <span class="mnav-section-title">${section_title}</span> 
                         <i class="fa-solid fa-chevron-right"></i>
                     </div>
                     <div class="mnav-block">${block}</div>  
                 `
            return acc
        }, '')
 
 
        return `
        
             <div id="mnav-popup" style="display: none;">
 
 
                     <!--  -->
                     <div class="mnav-container">${nav}</div>
                     <!--  -->
                 
               
             </div>
 
 
             <div class="mobile-menu-item" id="mobile-menu-navigation">
                 <i class="fa-solid fa-bars icon"></i>
                 <span>Menu</span>
             </div>
 
              
              <a class="mobile-menu-item" href="tel:440-449-3300" id="mobile-menu-phone"> 
                 <i class="fa-solid fa-phone icon"></i> 
                 <span>Call</span>
             </a>
 
       
             <div class="footer-4" id="mobile-menu-copyright">
             <!-- <span>© 1999 - ${new Date().getFullYear()} Heights Driving School. All rights reserved. info@heightsdriving.com</span>-->
             </div>
            
 
            
         
 
        
        
        `
    },
    
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
                    display: 'In-Person Classes',
                    link: 'teens-locations.html',

                    currentpageTitle: 'Ohio Classroom Locations'
                },
                {
                    display: 'Online Classes',
                    link: 'teens-online-classes.html',
                    currentpageTitle: 'Ohio Online Drivers Ed'
                },
                
                {
                    display: 'High School Program',
                    link: 'teens-highschool-classes.html',
                    currentpageTitle: 'Ohio High School Drivers Ed'
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
                    display: 'Abbreviated Program',
                    link: 'adults-abbreviated.html',
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
    /* A bit of a design flaw, since mobile nav
      is generated with a core component existing here
     */

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
                <!-- <li class="menu-top"><a href="teens-home.html" class="navigation-menu-item">Helpful Information</a> <ul> <li ><a href="#">Option 1</a></li> </ul> </li> -->

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
            <span>© 1999 - ${new Date().getFullYear()+1} Heights Driving School. All rights reserved. I 440-449-3300 I info@heightsdriving.com</span>
        </div>
    `,
    mobile : `

    
    
    
    `

}




/*〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓 */
/*//!〓〓〓〓〓〓〓            MOBILE          〓〓〓〓〓〓〓〓〓〓〓 */
/*〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓 */







const mobileMenu = {

    toggle : false,

    submenu_closed: 'fa-chevron-right',
    submenu_open : 'fa-chevron-down',


    get menu_toggle_element(){ return document.getElementById('mobile-menu-navigation')},
    get header_element() {return document.getElementById('c-header')},
    get mobile_popup_element() {return document.getElementById('mnav-popup')},
    disable_scroll()   { document.body.style.overflow = 'hidden';},
    enable_scroll()       { document.body.style.overflow = 'scroll';},


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
        mobileMenu.disable_scroll()
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
        mobileMenu.enable_scroll()

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

    menuClick(x) {

    var icon = x.querySelector('i')
    var block = x.querySelector('mnav-block')
    var menu = x.nextElementSibling

    var classlist = icon.classList

    //it must be getting opened if its currently closed
    if(classlist.contains(mobileMenu.submenu_closed)) {
        classlist.replace(mobileMenu.submenu_closed,mobileMenu.submenu_open)
        menu.classList.add('mnav-block-active')
        
        
    }else{
        classlist.replace(mobileMenu.submenu_open,mobileMenu.submenu_closed)
        menu.classList.remove('mnav-block-active')
        
    }





    }

   

}




/**The output of this is generateLocations(), which 'programs' feeds into */
const locations = {

    


    /**Where all location data is stored */
    programs: {
        teen_classes : [

                {name: 'Mayfield Village',
                address_display: '771 Beta Dr, Mayfield Village, 44143',
                address_src : '771%20Beta%20Dr%20Mayfield%20Village%2044143',
                calender_src: '9io5lt0dqvqlsq0d8jcfdr8ohc%40group.calendar.google.com',
                calender_api: '9io5lt0dqvqlsq0d8jcfdr8ohc@group.calendar.google.com'},

                {name: 'Broadview Hts',
                address_display: '8141 Broadview, Broadview Hts, 44147',
                address_src : '8141%20Broadview%20Broadview%20Hts%2044147',
                calender_src: 'qt50os7cn06qvh5bg3s0k85u54%40group.calendar.google.com',
                calender_api: 'qt50os7cn06qvh5bg3s0k85u54@group.calendar.google.com'},

                {name: 'Cleveland Hts',
                address_display: '2000 Lee Road, Cleveland Hts, 44118',
                address_src : '2000%20Lee%20Road%20Cleveland%20Hts%2044118',
                calender_src: '12dpqf04c8ohqcu2phov5kts0o%40group.calendar.google.com',
                calender_api: '12dpqf04c8ohqcu2phov5kts0o@group.calendar.google.com'},

                {name: 'Mentor',
                address_display: '7537 Mentor Ave, Mentor, 44060',
                address_src : '7537%20Mentor%20Ave%20Mentor%2044060',
                calender_src: 'lkv5mih5kmq4bpnjm5cjubfm3c%40group.calendar.google.com',
                calender_api: 'lkv5mih5kmq4bpnjm5cjubfm3c@group.calendar.google.com'}



        ],

        zoom : {
            name:'zoom',
            calender_src : '1dm7qqo40013dne78q08avhd6c%40group.calendar.google.com',
            calender_api : '1dm7qqo40013dne78q08avhd6c@group.calendar.google.com'
        },

        adult_abbreviated: {
            ["Mayfield Villlage"] : {
                address_display: '771 Beta Dr, Mayfield Village, 44143',
                address_src : '771%20Beta%20Dr%20Mayfield%20Village%2044143'
            }
        },
        adult_remedial: {
            ["Cleveland Hts"] : {
                address_display: '2000 Lee Road, Cleveland Hts, 44118',
                address_src : '2000%20Lee%20Road%20Cleveland%20Hts%2044118',
            }
        }

    },

    

    /**Generates the html for the teens locations page */
    generateLocations() {
        
        var breakpoint = mobileCalendar.breakpointForMobileCalendar()
        var htmlForLocations = locations.programs.teen_classes.reduce((acc,v,i)=>{

            var {address_display,address_src,calender_api,calender_src,name} = v

            var src_calender = breakpoint ? `https://www.google.com/calendar/embed?src=${calender_src}` : ''
            
            var src_maps = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDtc2syrq3Ra90yZ8WoB170PT7BvUivVbQ&q=${address_src}`

            var y = `
            <div class="loc-container ${!i ? 'active-loc' : ''}" data-class_location = "${name}">
                <div class="loc-address">${address_display}</div>
                
    
                <div class="loc-calender">
                        <iframe 
                        width="100%" height="100%" onload="registerIframeLoad()" data-hds_iframe="1"
                        src="${src_calender}">
                    </iframe>
                    
                </div>
    
                
    
                <div class="loc-map">
                    <iframe width="100%" height="100%"   onload="registerIframeLoad()" data-hds_iframe="1"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade" 
                    src=" ${src_maps} ">
                    </iframe>
                </div>


                <div class="loc-calender-mobile">
                    <div ><table data-class_location_mobile_cal = "${name}" style="width:90;table-layout:fixed;"></table></div>
                </div>


            </div>
    
    
            `

            acc += y
            return acc




        },'')
        
        return htmlForLocations
    },
    /**Generates the html for the teens locations page */
    generateZoomCalendar() {
        
        var breakpoint = mobileCalendar.breakpointForMobileCalendar()
        var calendar_data = locations.programs.zoom

        var {calender_api,calender_src} = calendar_data

        var src_calender = breakpoint ? `https://www.google.com/calendar/embed?src=${calender_src}` : ''

        var htmlForLocations  = `
        
         

            <div class="loc-calender">
                    <iframe 
                    width="100%" height="100%" onload="registerIframeLoad()" data-hds_iframe="1"
                    src="${src_calender}" style="border: 1px solid #e7e5e500; filter: hue-rotate(312deg); outline-offset: 3px;">
                </iframe>
                
            </div>

            <div class="loc-calender-mobile">
                <div><table data-class_location_mobile_cal = "zoom" style="width:90;table-layout:fixed;"></table></div>
            </div>


       


        `
        
        return htmlForLocations
    


    }
}



const mobileCalendar = {
    breakpointForMobileCalendar() {return window.innerWidth >= 846},

    
    



    printCalendar(calendarId,name,formatfunction,height) {
    
    
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
                'maxResults': 50,
                'orderBy': 'startTime'
            });
        }).then(function (response) {
            // console.log(response.result.items)
            if (response.result.items) {

                var arr = [['Class','Date','Start','End']]
    
                
                response.result.items.forEach(function(entry) {
                    
                    var startsAt = entry.start.dateTime
                    var endsAt   = entry.end.dateTime
                    var date = new Date(startsAt)
                    var date2 = new Date(endsAt)
    
                    var datestring = date.toLocaleDateString('en-US',{day:"2-digit",month:"2-digit",year:"2-digit"})
                    var starttime = date.toLocaleTimeString('en-US', { hour: 'numeric',minute: '2-digit', hour12: true })
                    var endtime = date2.toLocaleTimeString('en-US', { hour: 'numeric',minute: '2-digit', hour12: true })
                    console.log(entry)
                    var location_name = entry.organizer.displayName
                    var class_number = entry.summary

                    datestring = datestring==='Invalid Date' ? '-' : datestring
                    starttime = starttime==='Invalid Date' ? '-' : starttime
                    endtime = endtime==='Invalid Date' ? '-' : endtime
                    
                    

                    //Dont show if date is invalid
                    if(datestring !== '-') {
                        arr.push([class_number,datestring,starttime,endtime])
                    }
                    
                });

                createDataTable(`[data-class_location_mobile_cal="${name}"]`,arr,formatfunction,height)
                
            }
    
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    }
}
