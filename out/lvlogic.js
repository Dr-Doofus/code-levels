const data = require('./data.min.js');
const levels = require('./levels.min.js');
const status = require('./status.min.js');

function userLevelCheck(mod = 10) {
  //check if EXP and level exists
  if (data.usr.exp && data.usr.lvl) {
    //calculate requirement
    var req = levels.calculateReq(data.usr.lvl, mod);
    //check if exp is above the current requirement
    if (data.usr.exp > req) {
      //good job, have another level
      data.usr.lvl++;
      status.update(0);
    }
    return;
  }
  //If this condition fails...
  console.warn("CLV > Lv Logic: User data not found.")
}

function userLanguageLevelCheck(mod = 5, language) {
  //Check if language exists at all
  if (data.usr.langs[language]) {
    // Check if language exp and level exists
    if (data.usr.langs[language].exp && data.usr.langs[language].lvl) {
      //calculate requirement
      var req = levels.calculateReq(data.usr.langs[language].lvl, mod);
      //check if exp is over current requirement
      if (data.usr.langs[language].exp > req) {
        //nice, have another level, you did good
        data.usr.langs[language].lvl++;
        status.update(0, language);
      }
      return;
    }
    console.warn("CLV > Lv Logic: " + language + " exists in ufile, but invalid format."); 
    return;
  }
  if (language != undefined) { console.warn("CLV > Lv Logic: " + language + " in ufile not found."); 
  }
}

function workspaceLevelCheck(mod = 10) {
  //check if EXP and level exists
  if (data.wsp.exp && data.wsp.lvl) {
    //calculate requirement
    var req = levels.calculateReq(data.wsp.lvl, mod);
    //check if exp is above the current requirement
    if (data.wsp.exp > req) {
      //good job, have another level
      data.wsp.lvl++;
      status.update(0);
    }
    return;
  }
  //If this condition fails...
  console.warn("CLV > Lv Logic: Workspace data not found.")
}

function workspaceLanguageLevelCheck(mod = 5, language) {
  //check if language exists at all
  if (data.wsp.langs[language]) {
    //check if language exp + level exists
    if (data.wsp.langs[language].exp && data.wsp.langs[language].lvl) {
      //calculate requirements
      var req = levels.calculateReq(data.wsp.langs[language].lvl, mod);
      //check if exp is over current requirement
      if (data.wsp.langs[language].exp > req) {
        //nice. another level for you.
        data.wsp.langs[language].lvl++;
        status.update(0, language);
      }
    }
  }
}

function userLevelFix(mod = 10) {
  if (data.usr.exp && data.usr.lvl) {
    data.usr.lvl = 1;
    console.log("CLV: Fixing USER level...");
    var skipped = 0;
    while (data.usr.exp >= levels.calculateReq(data.usr.lvl, mod)) {
      data.usr.lvl++;
      skipped++;
    }
    console.log("> Done! Skipped " + skipped + " levels");
  }
  return;
}

function userLanguageLevelFix(mod = 5) {
  if (data.usr.langs) {
    //iterate through all languages, check for exp+level, and set level to 1
    const keys = Object.keys(data.usr.langs);
    
    for (let i = 0; i < keys.length; i++) {
      if (data.usr.langs[keys[i]].lvl && data.usr.langs[keys[i]].exp) {
        data.usr.langs[keys[i]].lvl = 1;
        var skipped = 1;
        while (data.usr.langs[keys[i]].exp >= levels.calculateReq(data.usr.langs[keys[i]].lvl, mod)) {
          data.usr.langs[keys[i]].lvl++;
          skipped++;
        }
        console.log("CLV: Fixed USER LANG level of " + keys[i] + "... 1 > " + skipped);
      }
    }
  }
}

function workspaceLevelFix(mod = 10) {
  if (data.wsp.exp && data.wsp.lvl) {
    data.wsp.lvl = 1;
    console.log("CLV: Fixing WORKSPACE level...");
    var skipped = 0;
    while (data.wsp.exp >= levels.calculateReq(data.wsp.lvl, mod)) {
      data.wsp.lvl++;
      skipped++;
    }
    console.log("> Done! Skipped " + skipped + " levels");
  }
  return;
}

function workspaceLanguageLevelFix(mod = 5) {
  if (data.wsp.langs) {
    //iterate through all languages, check for exp+level, and set level to 1
    const keys = Object.keys(data.wsp.langs);
    
    for (let i = 0; i < keys.length; i++) {
      if (data.wsp.langs[keys[i]].lvl && data.wsp.langs[keys[i]].exp) {
        data.wsp.langs[keys[i]].lvl = 1;
        var skipped = 1;
        while (data.wsp.langs[keys[i]].exp >= levels.calculateReq(data.wsp.langs[keys[i]].lvl, mod)) {
          data.wsp.langs[keys[i]].lvl++;
          skipped++;
        }
        console.log("CLV: Fixed USER LANG level of " + keys[i] + "... 1 > " + skipped);
      }
    }
  }
}

module.exports = {
  userLevelCheck,
  userLanguageLevelCheck,
  userLevelFix,
  userLanguageLevelFix,
  workspaceLevelCheck,
  workspaceLanguageLevelCheck,
  workspaceLevelFix,
  workspaceLanguageLevelFix
}