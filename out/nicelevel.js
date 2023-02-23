//Alternate viewing style for levels. Can be toggled in settings.
const grd = require('./-grades.js');

function get(level = 1, multiline = false) {
  if (grd.data) {
      //make it array-friendly
    let index = level - 1;
    //initialize return variable
    let output;
    //Arrays don't start at -1, you know
    if (index < 0) { output = "???"; return output;}
    //Get array data
    output = grd.data[index];
    let output2 = output.replace(/[<>"'\\&]/g, ""); //make safe?
    //If you exhaust the grade data... 
    //just take the last index and slap a number on it
    if (index >= grd.data.length) { output2 = grd.data[grd.data.length-1] + " + " (level - grd.data.length); }

    if (multiline === false) { result = output2.replace("\n", ""); return result;}
    if (multiline === true) { result = output2.replace("\n", "<br>"); return result;}
  }
  console.warn("CLV > Level format > Grade data not found.");
}

module.exports = {
  get
}