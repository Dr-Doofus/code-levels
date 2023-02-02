//Used to beautify big numbers.

//Per index (unit on the right), is a thousands format.
const formatsNormal = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
const formatsSI = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'];

function format(num, style, small = false) {
  //make number absolute (so it works in the negatives too)
  let sign = Math.sign(num)
  let number = Math.abs(num);
  //empty string (this will be returned soon)
  var result = "";
  //Determine number format style
  switch (style) {
    default: case 1: 
      formats = formatsNormal; break;
    case 2: 
      formats = formatsSI; break;
  }
  //Big noomba
  if (small == false) {
    //iteration count
    var count = 0;
    //if number is stil over 10 000 000
    if (number >= 1e7) {
      //iterate until this number is below a set number
      for (let i = 0; i < formats.length-1; i++) {
        //shrink number each iteration
        if (number >= 1000) {
          number /= 1000;
          count++;
        }
        //end loop if it's under 10k
        if (number < 10000) {
          break;
        }
      }
      number = Math.floor(number * 1000) / 1000;
    }
    number = number * sign;
    result = number.toLocaleString() + formats[count]
    return result;
  }
  //smol noomba
  if (small == true) {
    //iteration count
    var count = 0;
    //if number is stil over 100 000
    if (number >= 1e5) {
      //iterate until this number is below a set number
      for (let i = 0; i < formats.length-1; i++) {
        //shrink number each iteration
        if (number >= 1000) {
          number /= 1000;
          count++;
        }
      }
      number = Math.floor(number * 10) / 10;
    }
    number = number * sign;
    result = number.toLocaleString() + formats[count]
    return result;
  }
}

module.exports = {
  format
}