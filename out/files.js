//File In/Out Service. Used to save and load stuff.
const vc = require('vscode');

const fs = require('fs');
var path = require('path');

//custom reqs
const data = require('./data.min.js');

///
// AUTOMATIC CONFIGURATION (DON'T TOUCH!)
///
var live = false; //Is this running in a live host or a dev host?
try { const { ConsoleReporter } = require('@vscode/test-electron'); } catch(e) { live = true; };
var isWindows = false; //Is this running on a Windows machine or UNIX?
if (vc.env.appRoot && vc.env.appRoot[0] !== "/") {
	isWindows = true;
}

///
// PATH CONFIGURATION
/// 
var dir = "../../clv_data/";
if (live == true) { dir = "../../../clv_data/"; }

///
// FUNCTION CALLS
// You know, the ones you're gonna use a lot.
///

function usrSave(target = "user") {
  //configure save location
  const file = String(dir) + String(target) + ".json";
  //set save content
  var content = JSON.stringify(data.usr, null, 2);
  //make folder if it doesn't exist
  fs.mkdir(path.resolve(__dirname, dir), (err) => {
    if (err.arg0) { if (err.arg0.code != "EEXIST" && err.arg0.code != "ENOENT") { console.warn("CLV > Files > User folder error: " + err); } }
  });
  //save file to folder
  fs.writeFileSync(path.resolve(__dirname, file), content, "utf8", (err) => {
    if (err) { vc.window.showErrorMessage("CLV couldn't save user file."); console.warn("CLV > Files > User save error: " + err)};
  })

}

function usrLoad(target = "user") {
  //configure save location
  const file = String(dir) + String(target) + ".json";

  //check if user data exists, if it does then set load location
  if (!data.usr) {
    console.warn("CLV > Files > Load: User data not found!");
    return;
  }
  var content = data.usr;

  //make folder if it doesn't exist yet
  fs.mkdir(path.resolve(__dirname, dir), (err) => {
    if (err.arg0) { if (err.arg0.code != "EEXIST") { console.warn("CLV > Files > User folder error: " + err); } }
  });

  //parse json content
  try {
    content = JSON.parse(fs.readFileSync(path.resolve(__dirname, file), "utf8"));
  } catch (e) {
    console.warn("CLV > Files > Load user " + e + ". If the code is ENOENT, if it's your first time as this user, there's nothing to worry about!");
  }
  
  //finally, load the into user data
  Object.assign(data.usr, content);

  // sort user langs
  const old = data.usr.langs;
	const sorted = Object.keys(old).sort().reduce(
		(obj, key) => {
			obj[key] = old[key];
			return obj;
		},{}
	);
	data.usr.langs = {};
	Object.assign(data.usr.langs, sorted);
}

function wspSave() {
  //configure save location
  const location = vc.workspace.workspaceFolders[0].uri.path;
  const file = location + "/.clvls";
  //windows fix
  let fileWin = "";
  if (isWindows) {
    fileWin = file.substring(1);
  }
  var content = JSON.stringify(data.wsp, null, 2);
  //don't do anything if no root exists
  if (location != undefined) {
    //saves in different spots depending on whether it's a Windows system or not
    if (isWindows) {
      fs.writeFileSync(fileWin, content, "utf8", (err) => {
        if (err) { vc.window.showErrorMessage("CLV couldn't save workspace file.");
        console.warn("CLV > Files > Workspace save error: " + err)}})
        return;
    } else {
      fs.writeFileSync(file, content, "utf8", (err) => {
        if (err) { vc.window.showErrorMessage("CLV couldn't save workspace file.");
        console.warn("CLV > Files > Workspace save error: " + err)}})
        return;
    }
  }
}

function wspLoad() {
  //configure load location
  const location = vc.workspace.workspaceFolders[0].uri.path;
  const file = location + "/.clvls";
  //windows fix
  let fileWin = "";
  if (isWindows) {
    fileWin = file.substring(1);
  }
  var content = data.wsp;

  //don't do anything if the path doesn't exist
  if (path != undefined) {
    //loads in different spots depending on whether it's a Windows system or not
    if (isWindows) {
      try {
        content = JSON.parse(fs.readFileSync(fileWin, "utf8"));
      } catch (e) { console.warn("CLV > Files > Workspace load error: " + e + ". If the code is ENOENT, if it never had a .clvls file, this is normal!") }
    } else {
      try {
        content = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch (e) { console.warn("CLV > Files > Workspace load error: " + e + ". If the code is ENOENT, if it never had a .clvls file, this is normal!") }
    }
  }
  
  //finally, load the into user data
  Object.assign(data.wsp, content);

  //sort workspace langs
  const old = data.wsp.langs;
	const sorted = Object.keys(old).sort().reduce(
		(obj, key) => {
			obj[key] = old[key];
			return obj;
		},{}
	);
	data.wsp.langs = {};
	Object.assign(data.wsp.langs, sorted);
}

module.exports = {
  usrSave,
  usrLoad,
  wspSave,
  wspLoad
}