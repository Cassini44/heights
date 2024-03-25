
var getId = (x) =>  document.getElementById(x)
var getDim = (x) => document.getElementById(x).getBoundingClientRect()



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

        let nav = navigations.sections[nav_type].reduce((acc,v) => {
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

function t() {

       /* The title of the html page should have a coresponding entry in one of the objects currentpageTitle properties
            If the entry matches the current page title, it assigns a class that highlights that menu entry to show the user is currently on that page
         */ 
            var page_title = document.title 

            var sections = Object.keys(navigations.sections)//?


            let nav = sections.reduce((acc,v) => {
                var {section_title,links} = navigations.sections[v]


                var block = links.reduce((acc2,v2)=>{
                    // v2
                    var {isHome,currentpageTitle,link,display} = v2
                    var currentpage = currentpageTitle === page_title ? 'mnav-item-active' : ''
                    var linkblock = `<div class="${currentpage} mnav-item"> <a href="${link}">${display}</a> </div>`
                    acc2+=linkblock 
                    return acc2
                },'')
                acc+=`
                <div onclick="" class="mnav-section"> 
                    <div class="mnav-section-toggle">
                        <span class="mnav-section-title">${section_title}</span> 
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="mnav-block">${block}</div>  
                </div>`

                return acc
            },'')

            
            return nav



}



t()