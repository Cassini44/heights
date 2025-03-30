import params from '../application/ui/parameters.js'
import {ejsFcns,n} from '../utility/misc.js'
import ejs from 'ejs'












export default async function(req,res) {

    const {USER_ID,FIRST_NAME,USER_TYPE} = req.user

    var config = params.ui_config[USER_TYPE]


    var {SIDEBAR,VIEWPORT} = await gen.forms(config.forms)
   

    var HEAD = params.ui_config.all.head(USER_TYPE)

    var USER_DETAILS = JSON.stringify({FIRST_NAME,USER_TYPE,USER_ID})


    res.render('dashboard',{
        HEAD,
        USER_DETAILS,
        FIRST_NAME,
        SIDEBAR,
        VIEWPORT
    })
}




/* --------------------------------------------- */

const gen = {



  async forms(x) {
    // Initialize the accumulator object
    const acc = { SIDEBAR: "", VIEWPORT: ""};


    var isfirst = true;

    // Use a for...of loop to iterate over each element in x
    
    for (const v of x) {
      try{
      var displaystatus = isfirst ? "form-active" : "";
      isfirst = false;
      // Wait for renderForm to complete for each item
      
      // Generate the HTML for the sidebar item and the form
      const li = `<li onclick="navigateTo('${v.id}')"><div class='icon-join-box'><span class='material-icons'>${v.icon}</span>${v.name}</div></li>`;
      const form = `<div class="form-container ${displaystatus}" id="${v.id}"> ${v.html()||''}</div>`;

      // Append the generated HTML to the accumulator
      acc.SIDEBAR += li;
      acc.VIEWPORT += form;

      
    
      }catch(e){

        console.log(`${JSON.stringify(v)} sidebar item didnt load${e}`)
      }
    }
    

    // Return the accumulated result
    return acc;
  }

 
};



