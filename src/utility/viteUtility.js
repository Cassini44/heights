import path from 'path'
import fs from 'fs';


/**
Must be imported at server start 
*/


let viteManifest = {};
const manifestPath = path.join(process.cwd(), 'dist', '.vite' ,'manifest.json');
if (fs.existsSync(manifestPath)) {
  viteManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}




export function getManifest(x) {

  if(global.isDev) {
    return {
      js: `<script type="module" src="http://localhost:5173/${x}.js"></script>`,
      css:''
    }
    
  }

  let manifest = viteManifest[`${x}.js`]
  let js='',css=''

   js = `<script type="module" src="/${manifest.file}"></script>`

  if(manifest.css){
    
    css = manifest.css.reduce((acc,v)=>{
      acc+=`<link rel="stylesheet" href="/${v}">`
      return acc
    },'')
   
  }


  return {js,css}
};









/*
{
  '_admin.js': {
    file: 'assets/admin-DISAiE2M.js',
    name: 'admin',
    src: '_admin.js',
    isEntry: true
  },
  '_instructor.js': {
    file: 'assets/instructor-l0sNRNKZ.js',
    name: 'instructor',
    src: '_instructor.js',
    isEntry: true
  },
  '_student.js': {
    file: 'assets/student-l0sNRNKZ.js',
    name: 'student',
    src: '_student.js',
    isEntry: true
  },
  'main.js': {
    file: 'assets/main-DKEEX5L8.js',
    name: 'main',
    src: 'main.js',
    isEntry: true,
    css: [ 'assets/main-CHrCs3m6.css' ]
  }
}

*/