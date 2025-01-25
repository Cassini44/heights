import params from '../application/ui/parameters.js'
import {ejsFcns,n} from '../utility/misc.js'














export default async function(req,res) {

    const {USER_ID,FIRST_NAME,USER_TYPE} = req.user

    var config = params.ui_config[USER_TYPE]

    var {SIDEBAR,VIEWPORT,SCRIPTS,STYLES} = await gen.forms(config.forms)
    

    var HEAD = params.ui_config.all.head(STYLES)

    var USER_DETAILS = JSON.stringify({FIRST_NAME,USER_TYPE,USER_ID})

    res.render('dashboard',{
        HEAD,
        USER_DETAILS,
        FIRST_NAME,
        SIDEBAR,
        VIEWPORT,
        SCRIPTS
    })

}




/* --------------------------------------------- */

const gen = {

  async forms(x) {
    // Initialize the accumulator object
    const acc = { SIDEBAR: "", VIEWPORT: "", SCRIPTS: [],STYLES:[]};
    var isfirst = true;

    // Use a for...of loop to iterate over each element in x
    console.log(x)
    for (const v of x) {
      try{
      var displaystatus = isfirst ? "form-active" : "";
      isfirst = false;
      // Wait for renderForm to complete for each item
      
      
      const script = v.scriptfile ? 
      v.scriptfile.map(f => n.creatScriptTag(`${params.filepaths.scripts}/${f}.js`,`type="module" defer`) )
      : ''

      const style =  v.cssfile ? 
      v.scriptfile.map(f => n.createStyleTag(`${params.filepaths.styles}/${v.cssfile}.css`)  )
      : ''

      // Generate the HTML for the sidebar item and the form
      const li = `<li onclick="navigateTo('${v.id}')"><div class='icon-join-box'><span class='material-icons'>${v.icon}</span>${v.name}</div></li>`;
      const form = `<div class="form-container ${displaystatus}" id="${v.id}"> ${v.html()||''}</div>`;

      
      

      

      // Append the generated HTML to the accumulator
      acc.SIDEBAR += li;
      acc.VIEWPORT += form;

      if(script){  script.map(f => { acc.SCRIPTS.push(f)  }) }
      if(style) {  style.map(f => { acc.STYLES.push(style)  }) }
     


      }catch(e){

        console.log(`${JSON.stringify(v)} sidebar item didnt load${e}`)
      }
    }
    try{
      acc.STYLES = [...new Set(acc.STYLES)]
      acc.STYLES = acc.STYLES.join("")
    }catch{

    }

    try{
      acc.SCRIPTS = [...new Set(acc.SCRIPTS)]
      acc.SCRIPTS = acc.SCRIPTS.join("")
    }catch{

    }

    // Return the accumulated result
    return acc;
  },

 
};



