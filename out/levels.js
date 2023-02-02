//Level & Progress rendering logic.
//Also supports exp bar for status bar.

function calculateReq(level, mod = 5) {
  let lv = level + 1;
  let result = ((lv*5-5) + Math.pow(lv, 2) + Math.pow(lv, 3)-2) * mod;
  return result;
}

function calculatePct(level, mod = 5, tExp, decimals = 0) {
  //initial calculations
  let tReq = calculateReq(level, mod);
  let last = calculateReq(level-1, mod);
  let req = tReq - last;
  let exp = tExp - last;

  //make percentage of it
  let pct = Math.floor(exp / req * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return pct;
}
module.exports = {
  calculateReq,
  calculatePct
}