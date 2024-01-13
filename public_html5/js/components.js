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






/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */



const tables = {

}

const navigations = {
    /**
     * 
     * @param {string} nav_type as defined in navigations, use the property that represents the menu item set
     * @returns string
     */
    generateNavigation(nav_type) {
        var page_title = document.title

        let nav = navigations[nav_type].reduce((acc,v) => {
            acc+=`<li class="${v.currentpageTitle === page_title?'active-navigation-item':''}"><a href="${v.link}">${v.display}</a></li>`
            return acc
        },'')
        return `<ul>${nav}</ul>`
    },
    
    /**
     * display - what actually is shown to the user
     * link -  destination of navigation item
     * currentpageTitle - if this property matches the current documents title, it styles that list item with active-navigation-item
     */
    teens : [
        {display:'Teen Driving Courses',    link:'teens-home.html',                 currentpageTitle:'Ohio Teen Drivers Education'},
        {display:'Classroom Locations',     link:'teens-locations.html',            currentpageTitle:'Ohio Classroom Locations'},
        {display:'High School Classes',     link:'teens-highschool-classes.html',   currentpageTitle:'Ohio High School Drivers Ed'},
        {display:'Virtual Classes',         link:'teens-virtual-classes.html',      currentpageTitle:'Ohio Virtual Driving Classes'},
        {display:'Online Classes',          link:'teens-online-classes.html',       currentpageTitle:'Ohio Online Drivers Ed'},
        {display:'Behind the Wheel',        link:'teens-btw.html',                  currentpageTitle:'Ohio Behind the Wheel Training'},
        {display:'Course Documents',        link:'teens-documents.html',            currentpageTitle:'Course Documents'}
    ],
    adults : [
        {display:'Adult Driving Courses',link:'adults-home.html',currentpageTitle:'Adult Driving Courses'},
        {display:'Abreviated Course',link:'adults-abreviated.html',currentpageTitle:'Adult Driving Courses'},
        {display:'Remedial Program',link:'adults-remedial.html',currentpageTitle:'Classroom Locations'},
        {display:'Adult Driving Lessons',link:'adults-lessons.html',currentpageTitle:'Classroom Locations'}


    ],
    disabilities : [
        {display:'Disabilities and Driving',link:'disabilities-home.html',currentpageTitle:'Disabilities and Driving'},
        {display:'ADHD/ADD',link:'disabilities-home.html',currentpageTitle:'Driving with ADHD/ADD'},
        {display:'Autism',link:'disabilities-home.html',currentpageTitle:'Driving with Autism'},
        {display:'Amputation',link:'disabilities-home.html',currentpageTitle:'Driving after Amputation'},
        {display:'Arthritis',link:'disabilities-home.html',currentpageTitle:'Driving with Arthritis'},
        {display:'Bioptics-Low Vision',link:'disabilities-home.html',currentpageTitle:'Driving with Bioptics-Low Vision'},
        {display:'Cerebral Palsy',link:'disabilities-home.html',currentpageTitle:'Driving with Cerebral Palsy'},
        {display:'Working with the Deaf',link:'disabilities-home.html',currentpageTitle:'Driving with Deafness'},
        {display:'Multiple Sclerosis',link:'disabilities-home.html',currentpageTitle:'Driving with Multiple Sclerosis'},
        {display:'Spina Bifida',link:'disabilities-home.html',currentpageTitle:'Driving with Spina Bifida'},
        {display:'Spinal Cord Injury',link:'disabilities-home.html',currentpageTitle:'Driving with a Spinal Cord Injury'},
        {display:'Stroke',link:'disabilities-home.html',currentpageTitle:'Driving after a Stroke'},
        {display:'Traumatic Brain Injury',link:'disabilities-home.html',currentpageTitle:'Driving after a Traumatic Brain Injury'}
    ],
    seniors : [
        {display:'Aging and Driving',link:'seniors-home.html',currentpageTitle:'Aging and Driving'}

    ]
}


const core_components = {

    header : `
    <a href="index.html"class="heights-logo"><img class="heights-logo" src="images/heights_logo_1.png"></a>


        <a class="call-office" href="tel:440-449-3300"><i class="fa-solid fa-phone icon"></i><span
                class="call-office phone-number">440-449-3300</span></a>
        
                <nav class="navigation-menu-container">

            <ul>
                
                
                <li class="menu-top"><a class="navigation-menu-item">Teens</a>
                    ${navigations.generateNavigation('teens')}
                </li>
                <li class="menu-top"><a class="navigation-menu-item">Adults</a>
                    ${navigations.generateNavigation('adults')}
                </li>
                <li class="menu-top"><a class="navigation-menu-item">Disabilities</a>
                    ${navigations.generateNavigation('disabilities')}
                </li>
                <li class="menu-top"><a class="navigation-menu-item">Seniors</a>
                    ${navigations.generateNavigation('seniors')}
                </li>
                <li class="menu-top"><a class="navigation-menu-item">Helpful Information</a>
                    <ul>
                        <li ><a href="#">Option 1</a></li>
                    </ul>
                </li>

                <!------>
                <!------>
            </ul>

           

        </nav>
        <button onclick="location.replace('login.html')"class="usa-button"><div class="icon-join-box"><span class="material-icons">login</span> Log In </div></button>
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
            <span>© 1999 - 2023 Heights Driving School. All rights reserved. I 440-449-3300 I info@heightsdriving.com</span>
        </div>
    `

}
