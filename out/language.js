const vc = require('vscode');
const conv = require('./-converts.min.js');


function get() {
    //Get variable (but first, check if it's set!)
    let lang;
    //A minify-friendly example... if not suboptimal
    try {
        //Is language valid? Skips this if invalid.
        if (typeof vc.window.activeTextEditor.document.languageId == "string") {
            lang = vc.window.activeTextEditor.document.languageId;
            
            //Checks if language matches a key in the converts
            let keys = Object.keys(conv.data).filter(key => key.includes(lang));
            //Checks if the first match is filled (skips otherwise)
            if (conv.data[keys[0]] != undefined) {
                lang = conv.data[keys[0]];
            }

            // console.log(lang);
            return lang;
        }
    } catch(e) {
        if (e != "TypeError: Cannot read properties of undefined (reading 'document')") {
            console.warn("CLV > language.js = " + e);
        }
    }
    
    // if unsuccessful, just return it
    return false;
}

module.exports = {
    get,
}