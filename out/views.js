//Module for handling webviews.
//userUpdate & workspaceUpdate show different HTML buildups to
//allow for different layouts
const vc = require('vscode');
const data = require('./data.min.js');
const levels = require('./levels.min.js');
const number = require('./number.min.js');
const nlang = require('./nicelang.min.js');
const conf = require('./config.min.js');

var viewU;
var viewW;

var cfg = {};

///
// WEBVIEW CONTENT TO CREATE/UPDATE
// Used to display web content.
///
function userOpen() {
    if (viewU) { viewU.dispose(); }
    viewU = vc.window.createWebviewPanel(
        'clvProfileU',
        'User Profile',
        {preserveFocus = true, viewColumn: vc.ViewColumn.Two}, {} );

    //but also, get the config
    cfg = conf.load();
    
    //update this webview instantly
    userUpdate();
    
    //finally return it
    return viewU;
}

function userUpdate() {    
    //get configuration (i mean, this function is already laggy anyway...)
    cfg = conf.load();
    
    //init content
    let content = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Profile</title>
        <style>`;
        //start loading css
        content += coreStyle();
        content += userStyle();
        //end styling block
        content += `</style>
      </head>
    <body>`;

    //get date for last updated
    let date = new Date(Date.now());
    let time = date.toLocaleTimeString();
    content += `<div gt>Last updated at ` + time + `</div><br>`;

    //user info (if it exists)
    if (data.usr) {
        //Get username (this is worked in both blocks. Saves writing twice.)
        let user = "user";
        if (cfg.user.name) { user = cfg.user.name; }
        let userHtml = `<div mt>` + user + `</div>`;

        //get number format (used for later)
        let numFormat = 0;
        if (cfg.other.bigNumberFormat) { numFormat = cfg.other.bigNumberFormat; }

        //get user mod
        let mod = 10;
        if (cfg.user.levelMod) { mod = cfg.user.levelMod; }

        //get language mod
        let modLang = 5;
        if (cfg.user.levelModLanguage) { modLang = cfg.user.levelModLanguage; }
        
        //Is this config setting enabled?
        if (cfg.user.tracking) {
            //init variables
            let level = 0;
            let exp = 0;
            let currentExp = "";
            let nextExp = "";
            let totalExp = "";

            //get level cap (if it exists)
            let cap = Infinity;
            if (cfg.caps.mainUser > 0) {
                cap = cfg.caps.mainUser;
            }

            //if level exists, set it (cap it)
            if (data.usr.lvl) {
                level = Math.min(data.usr.lvl, cap);
            }
            //get experience
            if (data.usr.exp) {
                exp = data.usr.exp;
            }
            //get current, next
            if (level && level < cap) {
                let last = levels.calculateReq(level-1, mod);
                currentExp = number.format(exp - last, numFormat);
                nextExp = number.format(levels.calculateReq(level, mod) - last, numFormat);
            }
            //alternate behavior if level is capped
            if (level && level >= cap) {
                currentExp = "-----";
                nextExp = "-----";
            }
            //total exp
            if (exp) {
                totalExp = number.format(exp, numFormat);
            }
            
            //get user medal setting and apply it if possible (requires level)
            if (cfg.views.medalRequirementForUser > 0 && level) {
                let req = cfg.views.medalRequirementForUser;
                let tier = Math.min(Math.floor(level/req),10);
                content += `<div mm t` + tier + `></div>`;
            }
            //set username in webview
            content += userHtml;

            //set level & exp
            if (level && exp) {
                content += `<div ml>Level <span>` + level + `</span></div>`

                //set experience bar (start)
                content += `<div mb><div me `;
                // if level cap is reached, give it a special style
                // return to normal behavior otherwise
                if (level >= cap) {
                    content += `mx></div></div>`
                } else {
                    let bar = Math.min(levels.calculatePct(level, mod, exp, 1), 100);
                    content += `style="width:` + bar + `%"></div></div>`;
                }
            }

            //set experience values (below the bar)
            if (currentExp && nextExp && totalExp) {
                content += `<div mv><span>` + currentExp + `</span> / ` + nextExp;
                content += `<div mc>` + totalExp + ` total</div></div>`
            }

        } else {
            //set username in webview
            content += userHtml;
            //give this back
            content += `<div wn>Main User tracking disabled.</div>`;
        }

        //el seporator
        content += `<div sp></div><div cn>`

        //Is that config setting enabled & does it exist?
        if (cfg.user.trackLanguage) {
            if (data.usr.langs) {

            //configuration (taken from above thingy but altered)
            //get level cap (if it exists)
            let cap = Infinity;
            if (cfg.caps.userLanguage > 0) {
                cap = cfg.caps.userLanguage;
            }

            //You know what? We're gonna put everything in an array.
            const arr = Object.entries(data.usr.langs);
            //And we're gonna loop through it.
            for (var i = 0; i < arr.length; i++) {
                //init variables (these are all required until we can continue)
                let name = arr[i][0];
                let level = arr[i][1].lvl;
                let exp = arr[i][1].exp;
                //If all ^ this is defined, from then onwards we can do stuff.
                if (name && level && exp) {
                    //open lp tag
                    content += `<div lp>`
                    //get level (which is capped btw)
                    level = Math.min(level, cap);
                    let mode = 1; //used to determine tag
                    let tier = 0; //used to determine style
                    //get tier
                    if (cfg.views.medalRequirementForUserLanguage > 0) {
                        mode = 2;
                        let req = cfg.views.medalRequirementForUserLanguage;
                        tier = Math.min(Math.floor(level/req),10);
                    }
                    //make bar (this also determines the opening tag)
                    let bar = Math.min(levels.calculatePct(level, modLang, exp, 1), 100);
                    //determine starting tag mode
                    switch (mode) {
                        case 1: default: 
                            content += `<div l tx`;
                            break;
                        case 2:
                            content += `<div l t` + tier;
                            break;
                    }
                    //if the level has reached cap then sneak this in
                    if (level >= cap) { content += ` lx`}
                    //determine fill & close tag
                    content += ` style="--p: ` + bar + `%">`

                    //variables for lc (numbers)
                    let curr = "";
                    let next = "";

                    //variables for lc (name, exp when not cap, exp when cap)
                    let nameF = nlang.prettify(name);
                    if (level < cap) {
                        let last = levels.calculateReq(level-1, modLang);
                        curr = number.format(exp - last, numFormat, true)
                        next = " / " + number.format(levels.calculateReq(level, modLang)-last, numFormat, true);
                    }
                    if (level >= cap) {
                        curr = " MAX ";
                        next = "";
                    }
                    let totalExp = number.format(exp, numFormat, true);

                    //lc (text content)
                    content += `<div lc><div lt>` + nameF + `</div><div lo><span>` + curr + `</span>` + next + `</div>`;
                    content += `<div lv>Lv. <span>` + level + `</span</div></div></div>`
                    
                    //la content
                    content += `<div la><span>` + totalExp + `</span> total</div>`
                    
                    //close l tag
                    content += `</div></div>`
                }
            }
            }
        } else {
            //give this back
            content += `<div wn>User Language tracking disabled.</div>`;
        }
    }

    //close the content properly
    content += `</div>
      </body>
    </html>`;

    //lastly, give the content back because i (the function) am not a thief
    viewU.webview.html = content;
}

function workspaceOpen() {
    if (viewW) { viewW.dispose(); }
    viewW = vc.window.createWebviewPanel(
        'clvProfileW',
        'Workspace Profile',
        {preserveFocus = true, viewColumn: vc.ViewColumn.Two}, {} );

    //but also, get the config
    cfg = conf.load();
    
    //update this webview instantly
    workspaceUpdate();
    
    //finally return it
    return viewW;
}

function workspaceUpdate() {
    //get configuration (i mean, this function is already laggy anyway...)
    cfg = conf.load();
    
    //init content
    let content = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Workspace Profile</title>
        <style>`;
        //start loading css
        content += coreStyle();
        content += workspaceStyle();
        //end styling block
        content += `</style>
      </head>
    <body>`;

    //get date for last updated
    let date = new Date(Date.now());
    let time = date.toLocaleTimeString();
    content += `<div gt>Last updated at ` + time + `</div><br>`;

    //user info (if it exists)
    if (data.wsp) {
        //Get username (this is worked in both blocks. Saves writing twice.)
        let user = "Workspace";
        let userHtml = `<div mt>` + user + `</div>`;

        //get number format (used for later)
        let numFormat = 0;
        if (cfg.other.bigNumberFormat) { numFormat = cfg.other.bigNumberFormat; }

        //get user mod
        let mod = 10;
        if (cfg.workspace.levelMod) { mod = cfg.workspace.levelMod; }

        //get language mod
        let modLang = 5;
        if (cfg.workspace.levelModLanguage) { modLang = cfg.workspace.levelModLanguage; }
        
        //Is this config setting enabled?
        if (cfg.workspace.tracking) {
            //init variables
            let level = 0;
            let exp = 0;
            let currentExp = "";
            let nextExp = "";
            let totalExp = "";

            //get level cap (if it exists)
            let cap = Infinity;
            if (cfg.caps.mainWorkspace > 0) {
                cap = cfg.caps.mainWorkspace;
            }

            //if level exists, set it (cap it)
            if (data.wsp.lvl) {
                level = Math.min(data.wsp.lvl, cap);
            }
            //get experience
            if (data.wsp.exp) {
                exp = data.wsp.exp;
            }
            //get current, next
            if (level && level < cap) {
                let last = levels.calculateReq(level-1, mod);
                currentExp = number.format(exp - last, numFormat);
                nextExp = number.format(levels.calculateReq(level, mod) - last, numFormat);
            }
            //alternate behavior if level is capped
            if (level && level >= cap) {
                currentExp = "-----";
                nextExp = "-----";
            }
            //total exp
            if (exp) {
                totalExp = number.format(exp, numFormat);
            }
            
            //get user medal setting and apply it if possible (requires level)
            if (cfg.views.medalRequirementForWorkspace > 0 && level) {
                let req = cfg.views.medalRequirementForWorkspace;
                let tier = Math.min(Math.floor(level/req),10);
                content += `<div mm t` + tier + `></div>`;
            }
            //set username in webview
            content += userHtml;

            //set level & exp
            if (level && exp) {
                content += `<div ml>Level <span>` + level + `</span></div>`

                //set experience bar (start)
                content += `<div mb><div me `;
                // if level cap is reached, give it a special style
                // return to normal behavior otherwise
                if (level >= cap) {
                    content += `mx></div></div>`
                } else {
                    let bar = Math.min(levels.calculatePct(level, mod, exp, 1), 100);
                    content += `style="width:` + bar + `%"></div></div>`;
                }
            }

            //set experience values (below the bar)
            if (currentExp && nextExp && totalExp) {
                content += `<div mv><span>` + currentExp + `</span> / ` + nextExp;
                content += `<div mc>` + totalExp + ` total</div></div>`
            }

        } else {
            //set username in webview
            content += userHtml;
            //give this back
            content += `<div wn>Main Workspace tracking disabled.</div>`;
        }

        //el seporator
        content += `<div sp></div><div cn>`

        //Is that config setting enabled & does it exist?
        if (cfg.workspace.trackLanguage) {
            if (data.wsp.langs) {
                            //configuration (taken from above thingy but altered)
            //get level cap (if it exists)
            let cap = Infinity;
            if (cfg.caps.workspaceLanguage > 0) {
                cap = cfg.caps.workspaceLanguage;
            }

            //You know what? We're gonna put everything in an array.
            const arr = Object.entries(data.wsp.langs);
            //And we're gonna loop through it.
            for (var i = 0; i < arr.length; i++) {
                //init variables (these are all required until we can continue)
                let name = arr[i][0];
                let level = arr[i][1].lvl;
                let exp = arr[i][1].exp;
                //If all ^ this is defined, from then onwards we can do stuff.
                if (name && level && exp) {
                    //open lp tag
                    content += `<div lp>`
                    //get level (which is capped btw)
                    level = Math.min(level, cap);
                    let mode = 1; //used to determine tag
                    let tier = 0; //used to determine style
                    //get tier
                    if (cfg.views.medalRequirementForWorkspaceLanguage > 0) {
                        mode = 2;
                        let req = cfg.views.medalRequirementForWorkspaceLanguage;
                        tier = Math.min(Math.floor(level/req),10);
                    }
                    //make bar (this also determines the opening tag)
                    let bar = Math.min(levels.calculatePct(level, modLang, exp, 1), 100);
                    //determine starting tag mode
                    switch (mode) {
                        case 1: default: 
                            content += `<div l tx`;
                            break;
                        case 2:
                            content += `<div l t` + tier;
                            break;
                    }
                    //if the level has reached cap then sneak this in
                    if (level >= cap) { content += ` lx`}
                    //determine fill & close tag
                    content += ` style="--p: ` + bar + `%">`

                    //variables for lc (numbers)
                    let curr = "";
                    let next = "";

                    //variables for lc (name, exp when not cap, exp when cap)
                    let nameF = nlang.prettify(name);
                    if (level < cap) {
                        let last = levels.calculateReq(level-1, modLang);
                        curr = number.format(exp - last, numFormat, true)
                        next = " / " + number.format(levels.calculateReq(level, modLang)-last, numFormat, true);
                    }
                    if (level >= cap) {
                        curr = " MAX ";
                        next = "";
                    }
                    let totalExp = number.format(exp, numFormat, true);

                    //lc (text content)
                    content += `<div lc><div lt>` + nameF + `</div><div lo><span>` + curr + `</span>` + next + `</div>`;
                    content += `<div lv>Lv. <span>` + level + `</span</div></div></div>`
                    
                    //la content
                    content += `<div la><span>` + totalExp + `</span> total</div>`
                    
                    //close l tag
                    content += `</div></div>`
                }
            }
            }
        } else {
            //give this back
            content += `<div wn>Workspace language tracking disabled.</div>`;
        }
    }

    //close the content properly
    content += `</div>
      </body>
    </html>`;

    //lastly, give the content back because i (the function) am not a thief
    viewW.webview.html = content;
}

///
// COMMANDS TO STYLE
// Because local resource loading is a complete donkey butt still.
///

function coreStyle() {
    var css;
    if (cfg.views.useAlternateStyle) {
        css += `:root{--m-bar:gray;--l-bar:maroon}div[gt]{opacity:.66;font-size:.85rem;margin-top:8px;position:absolute}div[mm]{background-color:rgba(255,255,255,.5);width:24px;height:24px;border:2px solid rgba(255,255,255,.5);left:24px;transform:rotate(45deg);margin-top:24px;position:absolute}div[mt]{font-size:1.5rem;margin-top:21px;font-weight:700;overflow:hidden;text-overflow:ellipsis;max-width:calc(min(451px,100%));margin-left:48px}div[ml]{margin-top:4px}div[ml] span{font-size:1.25rem;font-weight:700}div[mb]{width:calc(min(500px,100%));height:20px;background-color:rgba(0,0,0,.33);border-bottom:2px solid}div[me]{width:0%;background-color:var(--m-bar);height:20px}div[me][mx]{width:100%!important;background-image:var(--m-bar-max);height:20px}div[mv]{width:calc(min(500px,100%));font-size:.9rem;text-align:center}div[mv] span{font-size:1.1rem;font-weight:700}div[mc]{opacity:.66;font-size:.75rem}div[sp]{width:calc(min(500px,100%));height:20px;border-bottom:1px solid;margin-bottom:24px;opacity:.33}div[mm]{text-align:center}div[mm][tx]{opacity:0}div[mm][t0]{background-image:linear-gradient(-15deg,#000 33%,#222 66%,#000);opacity:.33;border-color:#000}div[mm][t1]{background-image:linear-gradient(-15deg,#f92 33%,#fc4 66%,#f92 100%);border-color:#d71}div[mm][t2]{background-image:linear-gradient(-15deg,#99a 20%,#bbc 40%,#eef 66%,#bbc 100%);border-color:#668}div[mm][t3]{background-image:linear-gradient(-15deg,#a84 20%,#db6 40%,#fed 66%,#db6 100%);border-color:#972}div[mm][t4]{background-image:linear-gradient(-15deg,#99f 20%,#ddf 40%,#fff 66%,#ddf 100%);border-color:#66b}div[mm][t5]{background-image:linear-gradient(-15deg,#090 15%,#4c4 30%,#4e4 45%,#afa 65%,#4e4 100%);border-color:#070;box-shadow:0 0 2px #0a0}div[mm][t6]{background-image:linear-gradient(-15deg,#924 15%,#b24 30%,#d24 45%,#e8a 65%,#d24 100%);border-color:#802;box-shadow:0 0 3px #904}div[mm][t7]{background-image:linear-gradient(-15deg,#a3c 15%,#b4e 30%,#e6f 45%,#faf 65%,#e6f 100%);border-color:#72b;box-shadow:0 0 4px #d0d}div[mm][t8]{background-image:linear-gradient(-15deg,#49c 15%,#7ae 30%,#aef 45%,#fff 65%,#aef 100%);border-color:#27a;box-shadow:0 0 5px #7cf}div[mm][t9]{background-image:linear-gradient(-15deg,#ccf 15%,#eef 30%,#fff 45%,#fdc 60%,#cfd 70%,#dcf 80%,#fff 95%,#ccf 100%);border-color:#acc;box-shadow:0 0 6px #dff}div[mm][t10]{background-image:linear-gradient(-15deg,#cff 10%,#fff 40%,#faa 50%,#fda 60%,#cfa 70%,#aff 80%,#daf 90%,#cff 100%);border-color:#acc;box-shadow:0 0 5px #faa;animation:sr-fx-m linear 3s infinite}@keyframes sr-fx-m{0%{box-shadow:0 0 5px #faa}14%{box-shadow:0 0 5.25px #fda}28%{box-shadow:0 0 5.5px #ffa}43%{box-shadow:0 0 6px #cfa}57%{box-shadow:0 0 5.66px #afc}71%{box-shadow:0 0 5.33px #aff}85%{box-shadow:0 0 5px #daf}}div[lp]{width:calc(min(496px,100%));margin-right:8px;margin-bottom:32px}div[l]{--p:0%;width:100%;height:68px;text-align:left;background-image:linear-gradient(to right,var(--l-bar) var(--p),rgba(0,0,0,.33) 0);display:block;background-repeat:no-repeat;background-position:0 52px;background-size:auto 16px}div[l][lx]{background-image:var(--l-bar-max)}div[lc]{width:100%;height:46px;position:relative;padding-top:22px;font-size:1.2em;background-color:rgba(0,0,0,.125);background-repeat:no-repeat;background-position:0 -16px}div[lt]{font-size:125%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;transform:translateY(-20px);height:1.4em;width:100%;margin-left:6px;font-weight:700}div[lo]{font-size:50%;text-align:right;color:#fff;text-shadow:1px 1px 0 rgba(0,0,0,.75);transform:translate(-2px,4px)}div[lo] span{font-weight:700;font-size:133%}div[lv]{font-size:80%;transform:translate(2px,-34px)}div[lv] span{font-size:120%;font-weight:700}div[la]{text-align:center;width:calc(min(496px,100%));font-size:.85rem;opacity:.66;margin-top:2px;margin-bottom:25px}div[la] span{font-weight:700;font-size:.9rem;margin-left:8px}div[l][tx]{background-color:var(--vscode-editor-background)}div[l][t0] div[lc]{background-image:linear-gradient(20deg,#112 33%,#334 66%,#112);color:#ddf}div[l][t1] div[lc]{background-image:linear-gradient(20deg,#f92 33%,#fc4 66%,#f92 100%);color:#930}div[l][t2] div[lc]{background-image:linear-gradient(20deg,#99a 20%,#bbc 40%,#eef 66%,#bbc 100%);color:#556}div[l][t3] div[lc]{background-image:linear-gradient(20deg,#a84 20%,#db6 40%,#fed 66%,#db6 100%);color:#651}div[l][t4] div[lc]{background-image:linear-gradient(20deg,#99f 20%,#ddf 40%,#fff 66%,#ddf 100%);color:#55b}div[l][t5]{box-shadow:0 0 4px #0a0}div[l][t5] div[lc]{background-image:linear-gradient(20deg,#090 15%,#4c4 30%,#4e4 45%,#afa 65%,#4e4 100%);color:#060}div[l][t6]{box-shadow:0 0 8px #904}div[l][t6] div[lc]{background-image:linear-gradient(20deg,#924 15%,#b24 30%,#d24 45%,#e8a 65%,#d24 100%);color:#601}div[l][t7]{box-shadow:0 0 9px #d0d}div[l][t7] div[lc]{background-image:linear-gradient(20deg,#a3c 15%,#b4e 30%,#e6f 45%,#faf 65%,#e6f 100%);color:#606}div[l][t8]{box-shadow:0 0 10px #7cf}div[l][t8] div[lc]{background-image:linear-gradient(20deg,#49c 15%,#7ae 30%,#aef 45%,#fff 65%,#aef 100%);color:#068}div[l][t9]{box-shadow:0 0 11px #dff}div[l][t9] div[lc]{background-image:linear-gradient(20deg,#ccf 15%,#eef 30%,#fff 45%,#fdc 60%,#cfd 70%,#dcf 80%,#fff 95%,#ccf 100%);color:#488}div[l][t10]{box-shadow:0 0 9px #faa;animation:sr-fx-l linear 3s infinite}div[l][t10] div[lc]{background-image:linear-gradient(20deg,#cff 5%,#fff 50%,#faa 55%,#fda 60%,#cfa 65%,#aff 70%,#daf 75%,#fff 80%,#cff 100%);color:#577}@keyframes sr-fx-l{0%{box-shadow:0 0 9px #faa}14%{box-shadow:0 0 10px #fda}28%{box-shadow:0 0 11px #ffa}43%{box-shadow:0 0 12px #cfa}57%{box-shadow:0 0 12px #afc}71%{box-shadow:0 0 11px #aff}85%{box-shadow:0 0 10px #daf}}div[wn]{color:rgba(255,64,64,.5);font-size:.75rem;font-weight:700}div[cn]{display:flex;flex-wrap:wrap}`;
        return css;
    }
    css += `:root{--m-bar:gray;--l-bar:maroon}div[gt]{opacity:.66;font-size:.85rem;margin-top:8px;position:absolute}div[mm]{background-color:rgba(255,255,255,.5);width:24px;height:24px;border:2px solid rgba(255,255,255,.5);left:24px;transform:rotate(45deg);margin-top:24px;position:absolute}div[mt]{font-size:1.5rem;margin-top:21px;font-weight:700;overflow:hidden;text-overflow:ellipsis;max-width:calc(min(451px,100%));margin-left:48px}div[ml]{margin-top:4px}div[ml] span{font-size:1.25rem;font-weight:700}div[mb]{width:calc(min(500px,100%));height:20px;background-color:rgba(0,0,0,.33);border-bottom:2px solid}div[me]{width:0%;background-color:var(--m-bar);height:20px}div[me][mx]{width:100%!important;background-image:var(--m-bar-max);height:20px}div[mv]{width:calc(min(500px,100%));font-size:.9rem;text-align:right}div[mv] span{font-size:1.1rem;font-weight:700}div[mc]{opacity:.66;font-size:.75rem}div[sp]{width:calc(min(500px,100%));height:20px;border-bottom:1px solid;margin-bottom:24px;opacity:.33}div[mm]{text-align:center}div[mm][tx]{opacity:0}div[mm][t0]{background-image:linear-gradient(-15deg,#000 33%,#222 66%,#000);opacity:.33;border-color:#000}div[mm][t1]{background-image:linear-gradient(-15deg,#f92 33%,#fc4 66%,#f92 100%);border-color:#d71}div[mm][t2]{background-image:linear-gradient(-15deg,#99a 20%,#bbc 40%,#eef 66%,#bbc 100%);border-color:#668}div[mm][t3]{background-image:linear-gradient(-15deg,#a84 20%,#db6 40%,#fed 66%,#db6 100%);border-color:#972}div[mm][t4]{background-image:linear-gradient(-15deg,#99f 20%,#ddf 40%,#fff 66%,#ddf 100%);border-color:#66b}div[mm][t5]{background-image:linear-gradient(-15deg,#090 15%,#4c4 30%,#4e4 45%,#afa 65%,#4e4 100%);border-color:#070;box-shadow:0 0 2px #0a0}div[mm][t6]{background-image:linear-gradient(-15deg,#924 15%,#b24 30%,#d24 45%,#e8a 65%,#d24 100%);border-color:#802;box-shadow:0 0 3px #904}div[mm][t7]{background-image:linear-gradient(-15deg,#a3c 15%,#b4e 30%,#e6f 45%,#faf 65%,#e6f 100%);border-color:#72b;box-shadow:0 0 4px #d0d}div[mm][t8]{background-image:linear-gradient(-15deg,#49c 15%,#7ae 30%,#aef 45%,#fff 65%,#aef 100%);border-color:#27a;box-shadow:0 0 5px #7cf}div[mm][t9]{background-image:linear-gradient(-15deg,#ccf 15%,#eef 30%,#fff 45%,#fdc 60%,#cfd 70%,#dcf 80%,#fff 95%,#ccf 100%);border-color:#acc;box-shadow:0 0 6px #dff}div[mm][t10]{background-image:linear-gradient(-15deg,#cff 10%,#fff 40%,#faa 50%,#fda 60%,#cfa 70%,#aff 80%,#daf 90%,#cff 100%);border-color:#acc;box-shadow:0 0 5px #faa;animation:sr-fx-m linear 3s infinite}@keyframes sr-fx-m{0%{box-shadow:0 0 5px #faa}14%{box-shadow:0 0 5.25px #fda}28%{box-shadow:0 0 5.5px #ffa}43%{box-shadow:0 0 6px #cfa}57%{box-shadow:0 0 5.66px #afc}71%{box-shadow:0 0 5.33px #aff}85%{box-shadow:0 0 5px #daf}}div[lp]{margin-bottom:20px}div[l]{--p:0%;width:128px;height:128px;border-radius:100%;margin:4px;text-align:center;background-image:conic-gradient(var(--l-bar) var(--p),rgba(0,0,0,.33) 0);display:block}div[l][lx]{background-image:var(--l-bar-max)}div[lc]{width:112px;height:90px;position:relative;padding-top:22px;font-size:1.2em;left:8px;top:8px;background-color:var(--vscode-editor-background);border-radius:100%}div[lt]{overflow:hidden;font-size:95%;text-overflow:ellipsis;height:2.8em;width:98px;margin-left:6px;border-radius:8px;font-weight:700}div[lo]{font-size:50%}div[lo] span{font-weight:700;font-size:133%}div[lv]{font-size:80%}div[lv] span{font-size:120%;font-weight:700}div[la]{text-align:center;width:128px;font-size:.85rem;opacity:.66;margin-top:20px;margin-bottom:8px}div[la] span{font-weight:700;font-size:.9rem;margin-left:8px}div[l][tx]{background-color:var(--vscode-editor-background);margin:4px}div[l][t0] div[lc]{background-image:linear-gradient(20deg,#112 33%,#334 66%,#112);color:#ddf}div[l][t1] div[lc]{background-image:linear-gradient(20deg,#f92 33%,#fc4 66%,#f92 100%);color:#930}div[l][t2] div[lc]{background-image:linear-gradient(20deg,#99a 20%,#bbc 40%,#eef 66%,#bbc 100%);color:#556}div[l][t3] div[lc]{background-image:linear-gradient(20deg,#a84 20%,#db6 40%,#fed 66%,#db6 100%);color:#651}div[l][t4] div[lc]{background-image:linear-gradient(20deg,#99f 20%,#ddf 40%,#fff 66%,#ddf 100%);color:#55b}div[l][t5]{box-shadow:0 0 4px #0a0}div[l][t5] div[lc]{background-image:linear-gradient(20deg,#090 15%,#4c4 30%,#4e4 45%,#afa 65%,#4e4 100%);color:#060}div[l][t6]{box-shadow:0 0 8px #904}div[l][t6] div[lc]{background-image:linear-gradient(20deg,#924 15%,#b24 30%,#d24 45%,#e8a 65%,#d24 100%);color:#601}div[l][t7]{box-shadow:0 0 9px #d0d}div[l][t7] div[lc]{background-image:linear-gradient(20deg,#a3c 15%,#b4e 30%,#e6f 45%,#faf 65%,#e6f 100%);color:#606}div[l][t8]{box-shadow:0 0 10px #7cf}div[l][t8] div[lc]{background-image:linear-gradient(20deg,#49c 15%,#7ae 30%,#aef 45%,#fff 65%,#aef 100%);color:#068}div[l][t9]{box-shadow:0 0 11px #dff}div[l][t9] div[lc]{background-image:linear-gradient(20deg,#ccf 15%,#eef 30%,#fff 45%,#fdc 60%,#cfd 70%,#dcf 80%,#fff 95%,#ccf 100%);color:#488}div[l][t10]{box-shadow:0 0 9px #faa;animation:sr-fx-l linear 3s infinite}div[l][t10] div[lc]{background-image:linear-gradient(20deg,#cff 5%,#fff 50%,#faa 55%,#fda 60%,#cfa 65%,#aff 70%,#daf 75%,#fff 80%,#cff 100%);color:#577}@keyframes sr-fx-l{0%{box-shadow:0 0 9px #faa}14%{box-shadow:0 0 10px #fda}28%{box-shadow:0 0 11px #ffa}43%{box-shadow:0 0 12px #cfa}57%{box-shadow:0 0 12px #afc}71%{box-shadow:0 0 11px #aff}85%{box-shadow:0 0 10px #daf}}div[wn]{color:rgba(255,64,64,.5);font-size:.75rem;font-weight:700}div[cn]{display:flex;flex-wrap:wrap}`;
    return css;
}

function userStyle() {
    let css;
    css += `:root{--h:0}div{--m-bar:rgba(255,192,0,1);--m-bar-s:rgba(255,240,160,1)}div[me][mx]{--m-bar-max:linear-gradient(185deg,var(--m-bar) 20%,var(--m-bar-s) 40%,var(--m-bar) 60%)}div[l]{--l-bar:rgba(0,192,255,1);--l-bar-s:rgba(200,255,255,1)}div[l][lx]{--l-bar-max:linear-gradient(25deg,var(--l-bar) 40%,var(--l-bar-s) 60%,var(--l-bar) 80%)}`;
    return css;
}

function workspaceStyle() {
    let css;
    css += `:root{--h:0}div[me]{--m-bar:rgba(0,255,192,1);--m-bar-s:rgba(192,240,255,1)}div[me][mx]{--m-bar-max:linear-gradient(185deg,var(--m-bar) 20%,var(--m-bar-s) 40%,var(--m-bar) 60%)}div[l]{--l-bar:rgba(192,64,255,1);--l-bar-s:rgba(255,200,255,1)}div[l][lx]{--l-bar-max:linear-gradient(25deg,var(--l-bar) 40%,var(--l-bar-s) 60%,var(--l-bar) 80%)}`;
    return css;
}

module.exports = {
    userOpen,
    userUpdate,
    workspaceOpen,
    workspaceUpdate,
    viewU,
    viewW
}