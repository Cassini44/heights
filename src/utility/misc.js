import params from '../application/ui/parameters.js'
import ejs from 'ejs'
import path from 'path'
import fs from 'fs'

export const n = {
    /**
     * @param {string} x Value that will be wrappe din <span> tags
     * @param {string} [span_attributes] Set the attributes for the span such as class. This will be inserted directly into the html text. A valid example: `class="test"`
     */
    wrapInSpan(x,span_attributes) {
        return `<span ${span_attributes||''}>${x}</span>`
    },

    /**
     * 
     * @param {string} x  
     * @param {string} attributes places the text directly after <script so be careful  
     * @returns 
     */
    creatScriptTag(x,attributes) {
        return `<script ${attributes} src='${x}'></script>`
    },

    createStyleTag(x) {
        return `<link rel="stylesheet" href="${x}">`
    },




    /**
     * 
     * @param  {...any} x Starting at the root (src.. shared.. ssl) enter the directory path. For example: filePath('src/application/components')
     */
    filePath(x) {
        x = x.split('/')
        return path.join(process.cwd(),...x)
    },
}



// TIGHTLY COUPLED TO THE UI
export const ejsFcns = {

  async renderForm(formName,data={}) {
    const formspath = params.filepaths.forms
    // Render the file with data and capture the output in a variable
  //   console.log(`${formspath}${formName}`)
    const renderedHtml = await ejs.renderFile(n.filePath(`${formspath}${formName}`), data);
    
  
    return renderedHtml
  },

  /**
   * 
   * @param {string} user_type_and_form params.filepaths.forms + whatever you put here. For example, admin/vehicles.ejs would be valid
   * @param {object} [data] key value pairs to load into ejs template 
   * @returns html
   */
  renderFormSync(user_type_and_form,data) {

    var filepath = n.filePath(`${params.filepaths.forms}${user_type_and_form}`)
    const templateStr = fs.readFileSync(filepath, 'utf-8'); // Read the file synchronously

    return ejs.render(templateStr, data);
  }







}







