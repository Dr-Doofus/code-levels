//Alternate viewing style for levels. Can be toggled in settings.
const grd = require('./-grades.js');
const conf = require('./config.min.js');

function get(level = 1, multiline = false) {
  //get config
  const cfg = conf.load();

  if (grd.data && !cfg.grades.customSequence) {
    //make it array-friendly
    let index = level - 1;
    //initialize return variable
    let output;
    //Arrays don't start at -1, you know
    if (index < 0) { output = "???"; return output;}
    //Get array data
    output = grd.data[index];
    //If you exhaust the grade data... 
    //just take the last index and slap a number on it
    if (index >= grd.data.length) { output = grd.data[grd.data.length-1] + " + " + (level - grd.data.length); }

    let output2 = output.replace(/[<>"'\\&$]/g, "") //make safe?

    if (multiline === false) { result = output2.replace("\n", ""); return result;}
    if (multiline === true) { result = output2.replace("\n", "<br>"); return result;}
  }
  if (cfg.grades.customSequence) {
    var cGrd = "";
    try {
      let str = cfg.grades.customSequence;
      let str2 = str.replace(/[<>"'&$]/g, ""); //make safe?
      var cGrd = str2.split(',');
    } catch(e) {
      console.warn("CLV > Level format > Custom grade data invalid?");
    }
    //make it array-friendly
    let index = level - 1;
    //initialize return variable
    let output;
    //Arrays don't start at -1, you know
    if (index < 0) { output = "???"; return output;}
    //Get array data
    output = String(cGrd[index]);
    //If you exhaust the grade data... 
    //just take the last index and slap a number on it
    if (index >= cGrd.length) { output = cGrd[cGrd.length-1] + " + " + (level - cGrd.length); }

    let result = "";
    if (multiline === false) { result = output.replace("\\n", "");}
    if (multiline === true) { result = output.replace("\\n", "<br>");}

    //finally remove all slashes
    result2 = result.replace(/\\/g, "");

    //lastly, return
    return result2;
  }
  console.warn("CLV > Level format > Grade data not found.");
}

module.exports = {
  get
}