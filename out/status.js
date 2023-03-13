const vc = require('vscode');

//custom reqs
const conf = require('./config.min.js');
const data = require('./data.min.js');
const number = require('./number.min.js');
const levels = require('./levels.min.js');
const nlang = require('./nicelang.min.js');
const grade = require('./nicelevel.min.js');

//assign status bar item
let status;

//other vars
var cfg = {};
let displayMode = 0;
let displayDeci = 2;
let displaySize = 10;
let levelMode = 0;
let levelDeci = 1;
let levelTarget = 0;
let usrMod = 10;
let usrModLang = 5;
let wspMod = 10;
let wspModLang = 5;

let expSuffix = "";

let usrCap = Infinity;
let usrCapL = Infinity;
let wspCap = Infinity;
let wspCapL = Infinity;

let splitTooltip = false;
let numberStyle = 1;

function create(c) {
    //Assign status bar item so we can mess with it soon
    status = vc.window.createStatusBarItem(vc.StatusBarAlignment.Left, 1);
    //load config
    cfg = conf.load();
    //add status bar to subscriptions
    c.subscriptions.push(status);

    //lastly, refresh to make sure everything's 100% working
    refresh();
}

function refresh() {
    //reset caps just in case
    usrCap = Infinity;
    usrCapL = Infinity;
    wspCap = Infinity;
    wspCapL = Infinity;
    //reset tooltip just in case
    splitTooltip = false;

    //reload config as cfg
    cfg = conf.load();

    //apply config on refresh
    //progress bar type
    if (cfg.status.displayProgress) {
        if (cfg.status.levelDisplayType == "Disabled") { displayMode = -1; }
        if (cfg.status.displayProgress == "Bar") { displayMode = 1; }
        if (cfg.status.displayProgress == "Percentage") { displayMode = 2; }
    }
    //progress % precision
    if (cfg.status.displayPercentPrecision) {
        displayDeci = cfg.status.displayPercentPrecision;
    }
    //progress bar length
    if (cfg.status.displayBarLength) {
        displaySize = cfg.status.displayBarLength;
    }
    //level display type
    if (cfg.status.levelDisplayType) {
        if (cfg.status.levelDisplayType == "Disabled") { levelMode = -1; }
        if (cfg.status.levelDisplayType == "Level") { levelMode = 1; }
        if (cfg.status.levelDisplayType == "Level (Short)") { levelMode = 2; }
        if (cfg.status.levelDisplayType == "Level (Type)") { levelMode = 3; }
        if (cfg.status.levelDisplayType == "Level (Short Type)") { levelMode = 4; }
        if (cfg.status.levelDisplayType == "Percentage") { levelMode = 5; }
        if (cfg.status.levelDisplayType == "Grade") { levelMode = 6; }
    }
    //level % precision
    if (cfg.status.levelPercentPrecision) {
        levelDeci = cfg.status.levelPercentPrecision;
    }
    //level target - aka which exp/level should it point at
    if (cfg.status.displayExperienceType) {
        levelTarget = cfg.status.displayExperienceType;
    }

    //level mods for each type (should be self-explanatory?)
    if (cfg.user.levelMod) {
        usrMod = cfg.user.levelMod;
    }
    if (cfg.workspace.levelMod) {
        wspMod = cfg.workspace.levelMod;
    }
    if (cfg.user.levelModLanguage) {
        usrModLang = cfg.user.levelModLanguage;
    }
    if (cfg.workspace.levelModLanguage) {
        wspModLang = cfg.workspace.levelModLanguage;
    }

    //level caps
    if (cfg.caps.mainUser > 0) {
        usrCap = cfg.caps.mainUser;
    }
    if (cfg.caps.userLanguage > 0) {
        usrCapL = cfg.caps.userLanguage;
    }
    if (cfg.caps.mainWorkspace > 0) {
        wspCap = cfg.caps.mainWorkspace;
    }
    if (cfg.caps.workspaceLanguage > 0) {
        wspCapL = cfg.caps.workspaceLanguage;
    }

    //split tooltip? (checks whether both config settings are enabled 
    //+ whether both are actively tracked)
    if (cfg.tooltip.enableUser && cfg.tooltip.enableWorkspace) {
        if (cfg.user.tracking || cfg.user.trackLanguage) {
            if (cfg.workspace.tracking || cfg.workspace.trackLanguage) {
                splitTooltip = true;
            }
        }
    }

    //big number style
    if (cfg.other.bigNumberFormat) {
        if (cfg.other.bigNumberFormat == "Normal") { numberStyle = 1;}
        if (cfg.other.bigNumberFormat == "SI") { numberStyle = 2;}
    }

    //status config commands (1/3 = user profile, 2/4 = workspace profile)
    if (levelTarget == 1 || levelTarget == 3) { status.command = "code-levels.openuserview" }
    if (levelTarget == 2 || levelTarget == 4) { status.command = "code-levels.openworkspaceview" }

    //exp suffix (For the one who wants this, you know who you are)
    if (cfg.tooltip.experienceSuffix) { expSuffix = cfg.tooltip.experienceSuffix }


    //update it instantly
    update(0);
}

function update(value, language = false) {
    status.show();

    //base texts
    var content = "";
    const tip = new vc.MarkdownString();
    tip.supportHtml = true;
    tip.value = "";

    ///
    // UPDATE EXP VALUES
    // not if they don't exist though.
    ///

    // main user exp
    if (cfg.user.tracking && language) {
        if (data.usr) {
            if (typeof data.usr.exp !== undefined) {
                data.usr.exp += value;
            }
        }
    }
    // main workspace exp
    if (cfg.workspace.tracking && language) {
        if (data.wsp) {
            if (typeof data.wsp.exp !== undefined) {
                data.wsp.exp += value;
            }
        }
    }
    // user language exp
    if (cfg.user.trackLanguage && language) {
        if (data.usr) {
            if (data.usr.langs[language] === undefined) {
                data.usr.langs[language] = {exp:0, lvl: 1};
            }
            data.usr.langs[language].exp += value;
        }
    }
    // workspace workspace exp
    if (cfg.workspace.trackLanguage && language) {
        if (data.wsp) {
            if (data.wsp.langs[language] === undefined) {
                data.wsp.langs[language] = {exp:0, lvl: 1};
            }
            data.wsp.langs[language].exp += value;
        }
    }

    ///
    // PREPARE STATUS TEXT BITS
    // this used to be a lot more complex
    ///

    var exp = 0;
    var level = 0;
    var cap = Infinity;
    var mod = 5; 

    // console.log(data.wsp.lvl);

    switch (levelTarget) {
        // main user exp/level/cap
        case 1:
            if (data.usr.exp && data.usr.lvl && cfg.user.tracking) {
                exp = data.usr.exp;
                level = data.usr.lvl;
                mod = usrMod;
                cap = usrCap;
            }
            break;
        // main workspace exp/level/cap
        case 2:
            if (data.wsp.exp && data.wsp.lvl && cfg.workspace.tracking) {
                exp = data.wsp.exp;
                level = data.wsp.lvl;
                mod = wspMod;
                cap = wspCap;
            }
            break;
        // language user exp/level/cap
        case 3:
            if (language != false && data.usr.langs[language]) {
                if (data.usr.langs[language].exp && data.usr.langs[language].lvl && cfg.user.trackLanguage) {
                    exp = data.usr.langs[language].exp;
                    level = data.usr.langs[language].lvl;
                    mod = usrModLang;
                    cap = usrCapL;
                }
            }
            break;
        // workspace language exp/level/cap
        case 4:
            if (language != false && data.wsp.langs[language]) {
                if (data.wsp.langs[language].exp && data.usr.langs[language].lvl && cfg.workspace.trackLanguage) {
                    exp = data.wsp.langs[language].exp;
                    level = data.wsp.langs[language].lvl;
                    mod = wspModLang;
                    cap = wspCapL;
                }
            }
    }

    /// 
    // RENDERING CONTENT PART 1
    // aka, the bar, percentage, etc
    ///

    //bar mode (run the bar function w/ different params based on target)
    if (displayMode == 1) {
        let lv = Math.min(level,cap-1);
        content += bar(lv, mod, exp, displaySize);
    }
    //percent mode
    if (displayMode == 2) {
        let lv = Math.min(level,cap-1);
        let pct = Math.min(levels.calculatePct(lv, mod, exp, displayDeci-1),100);
        let pct2 = parseFloat(pct).toFixed(displayDeci-1);
        if (Math.abs(pct) < 10) {
            let pct3 = pct2.toString();
            if (cfg.status.leadingZeroesOnPercentages) {
                pctF = "0" + pct3;
            }
            else {
                pctF = pct3;
            }
        } else {
            pctF = pct2;
        }
        content += pctF;
        content += "% | ";
    }

    ///
    // RENDERING CONTENT PART 2
    // aka the level bits or percentage
    // also is skipped if no language is present in a non-lang bar
    ///
    let skip = false;
    if (levelTarget == 3 && !language || levelTarget == 4 && !language) {
        skip = true;
    }

    if (!skip) {
        // Display Level (Basic)
        if (levelMode == 1 && level > 0) {
            let lv = Math.min(level,cap);
            content += "Lv. " + Math.min(lv, cap);
        }
        // Display Level (Short)
        if (levelMode == 2 && level > 0) {
            let lv = Math.min(level, cap);
            content += Math.min(lv, cap);
        }
        // Display Level (Type)
        if (levelMode == 3 && level > 0) {
            let lv = Math.min(level, cap);
            switch (levelTarget) {
                case 1:
                    content += "ULv" + Math.min(lv, cap);
                    break;
                case 2:
                    content += "WLv" + Math.min(lv, cap);
                    break;
                case 3:
                    content += "ULL" + Math.min(lv, cap);
                    break;     
                case 4:
                    content += "WLL" + Math.min(lv, cap);
                    break;       
            }
        }
        // Display Level (Short Type)
        if (levelMode == 4 && level > 0) {
            let lv = Math.min(level,cap);
            switch (levelTarget) {
                case 1:
                    content += "U" + Math.min(lv, cap);
                    break;
                case 2:
                    content += "W" + Math.min(lv, cap);
                    break;
                case 3:
                    content += "u" + Math.min(lv, cap);
                    break;     
                case 4:
                    content += "w" + Math.min(lv, cap);

            }
        }
        // Display Level (Percentage)
        if (levelMode == 5 && level > 0) {
            let lv = Math.min(level,cap-1);
            let pct = Math.min(levels.calculatePct(lv, mod, exp, levelDeci-1),100);
            let pct2 = parseFloat(pct).toFixed(levelDeci-1);
            if (Math.abs(pct) < 10) {
                let pct3 = pct2.toString();
                if (cfg.status.leadingZeroesOnPercentages) {
                    pctF = "0" + pct3;
                }
                else {
                    pctF = pct3;
                }
            } else {
                pctF = pct2;
            }
            content += pctF;
            content += "%";
        }
        // Display Level (Grade)
        if (levelMode == 6 && level > 1) {
            let lv = Math.min(level,cap);
            content += grade.get(lv);
        }
    }

    ///
    // RENDERING CONTENT: PART 3
    // aka the funny little icon when you are about to level
    ///

    if (cfg.status.levelReadySymbol && level < cap && level > 0) {
        let req = levels.calculateReq(level, mod);
        if (exp >= req) {
            content += String(cfg.status.levelReadySymbolType);
        }
    }
    

    //finally, apply it to status element
    status.text = content;

    ///
    // TOOLTIP
    // Well, this is also a lot of magic happening at once...
    ///

    if (cfg.tooltip.enableTooltip) {
        //user end
        if (cfg.tooltip.enableUser && data.usr && cfg.user.tracking) {
            //check requirements (the vars seem self-explanatory?)
            //level text
            if (data.usr.lvl && !cfg.grades.enableForUser) {
                let lv = Math.min(data.usr.lvl,usrCap);
                tip.value += `<b><u><code>User Lv. ` + String(lv) + `</code></u></b>`;
            }
            //alt version in case grades are used
            if (data.usr.lvl && cfg.grades.enableForUser) {
                let lv = Math.min(data.usr.lvl,usrCap);
                let grd = grade.get(lv);
                tip.value += `<b><u><code>User (` + String(grd) + `)</code></u></b>`;
            }
            //exp text (+ total if enabled)
            if (data.usr.exp && data.usr.lvl) {
                //calculations, calculations
                let lv = Math.min(data.usr.lvl,usrCap);
                let exp = data.usr.exp;
                let last = levels.calculateReq(lv-1, usrMod);
                let next = levels.calculateReq(lv, usrMod);

                //prettify, prettify
                let expF = number.format(exp-last, numberStyle, true);
                let nextF = number.format(next-last, numberStyle, true);
                let expTxt;
                if (lv >= usrCap) {
                    if (cfg.grades.enableForUser) {
                        expTxt = "<b>MAX</b>";
                    } else {
                        expTxt = "<b>MAX LEVEL</b>";
                    }
                } else {
                    expTxt = `<b>` + String(expF) + `</b> / ` + String(nextF) + expSuffix;
                }

                tip.value += `<br>` + expTxt;
                if (cfg.tooltip.enableUserTotal) {
                    let total = number.format(exp, numberStyle, true);
                    tip.value += `<br><code>` + String(total) + ` total</code>`;
                }
            }
            //language level text (if enabled)
            if (cfg.tooltip.enableUserLanguage && data.usr.langs && language && cfg.user.trackLanguage) {
                //does the language itself even exist?
                if (data.usr.langs[language]) {
                    //does the current language exp/level exist?
                    if (data.usr.langs[language].exp && data.usr.langs[language].lvl) {
                        //calculations, calculations
                        let lv = Math.min(data.usr.langs[language].lvl,usrCapL)
                        let pct = levels.calculatePct(data.usr.langs[language].lvl, usrModLang, data.usr.langs[language].exp, 0);
                        
                        //prettify language, exp percent & change it if cap is reached
                        let pct2;
                        if (lv >= usrCapL) {
                            pct2 = "MAX";
                        } else {
                            pct2 = Math.min(pct, 99) + "%";
                        }
                        let lang = nlang.prettify(language);
                        
                        //custom grade text if it's enabled. Otherwise just show level.
                        if (cfg.grades.enableForUserLanguage) {
                            let grd = grade.get(lv);
                            tip.value += `<br><i><b>` + lang + `</b> | ` + String(grd) + ` (` + String(pct2) + `)</i>`;
                        } else {
                            tip.value += `<br><i><b>` + lang + `</b> Lv. ` + String(lv) + ` (` + String(pct2) + `)</i>`;
                        }
                    }
                }
            }
        }
        //middle end (splits if both settings are enabled)
        if (splitTooltip) { tip.value += `<br>════════════════════<br>` }
    
        //workspace end
        if (cfg.tooltip.enableWorkspace && data.wsp && cfg.workspace.tracking) {
            //check requirements (the vars seem self-explanatory?)
            //level text
            if (data.wsp.lvl && !cfg.grades.enableForWorkspace) {
                let lv = Math.min(data.wsp.lvl,wspCap);
                tip.value += `<b><u><code>Workspace Lv. ` + String(lv) + `</code></u></b>`
            }
            //alt version in case grades are used
            if (data.wsp.lvl && cfg.grades.enableForWorkspace) {
                let lv = Math.min(data.wsp.lvl,wspCap);
                let grd = grade.get(lv);
                tip.value += `<b><u><code>Workspace (` + String(grd) + `)</code></u></b>`;
            }
            //exp text (+ total if enabled)
            if (data.wsp.exp && data.wsp.lvl) {
                //calculations, calculations
                let lv = Math.min(data.wsp.lvl,wspCap);
                let exp = data.wsp.exp;
                let last = levels.calculateReq(lv-1, wspMod);
                let next = levels.calculateReq(lv, wspMod);

                //prettify, prettify
                let expF = number.format(exp-last, numberStyle, true);
                let nextF = number.format(next-last, numberStyle, true);
                let expTxt;
                if (lv >= wspCap) {
                    if (cfg.grades.enableForWorkspace) {
                        expTxt = "<b>MAX</b>";
                    } else {
                        expTxt = "<b>MAX LEVEL</b>";
                    }
                } else {
                    expTxt = `<b>` + String(expF) + `</b> / ` + String(nextF) + expSuffix;
                }

                tip.value += `<br>` + expTxt;
                if (cfg.tooltip.enableWorkspaceTotal) {
                    let total = number.format(exp, numberStyle, true);
                    tip.value += `<br><code>` + String(total) + ` total</code>`;
                }
            }
            //language level text (if enabled)
            if (cfg.tooltip.enableWorkspaceLanguage && data.wsp.langs && language && cfg.workspace.trackLanguage) {
                //does the language even exist?
                if (data.wsp.langs[language]) {
                    //does the current language exp/level exist?
                    if (data.wsp.langs[language].exp && data.wsp.langs[language].lvl) {
                        //calculations, calculations
                        let lv = Math.min(data.wsp.langs[language].lvl,wspCapL)
                        let pct = levels.calculatePct(data.wsp.langs[language].lvl, wspModLang, data.wsp.langs[language].exp, 0);
                        
                        //prettify language, exp percent & change it if cap is reached
                        let pct2;
                        if (lv >= wspCapL) {
                            pct2 = "MAX";
                        } else {
                            pct2 = Math.min(pct, 99) + "%";
                        }
                        let lang = nlang.prettify(language);
                        
                        if (cfg.grades.enableForWorkspaceLanguage) {
                            let grd = grade.get(lv);
                            tip.value += `<br><i><b>` + lang + `</b> | ` + String(grd) + ` (` + String(pct2) + `)</i>`;
                        } else {
                            tip.value += `<br><i><b>` + lang + `</b> Lv. ` + String(lv) + ` (` + String(pct2) + `)</i>`;
                        }
                    }
                }
            }
        }

        //lastly, add the tooltip
        status.tooltip = tip;
    }
}

function bar(level, mod = 5, tExp, length = 10) {
    //Initial variables
    var count = 0;
    let tReq = levels.calculateReq(level, mod);
    let last = levels.calculateReq(level-1, mod);
    let req = tReq - last;
    let exp = tExp - last;
    var bar = "▕"

    //If the new bar is enabled, use that instead (returns)
    if (cfg.status.advancedBar) {
        //startup
        var segments = length*8;
        var remain = length;

        //calculate full segments
        for (let i = 0; i < segments; i++) {
            if (exp >= req / segments * (i+1)) {
                count++;
            }
        }
        //add whole segments
        for (let i = 0; i < Math.floor(count/8); i++) {
            bar = bar + "█";
            remain--;
        }
        var bits = count % 8;
			switch (bits) {
				case 0:
					break;
				case 1:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▁"; break;}
                    bar = bar + "▏";
					break;
				case 2:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▂"; break;}
					bar = bar + "▎";
					break;
				case 3:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▃"; break;}
					bar = bar + "▍";
					break;
				case 4:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▄"; break;}
					bar = bar + "▌";
					break;
				case 5:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▅"; break;}
					bar = bar + "▋";
					break;
				case 6:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▆"; break;}
					bar = bar + "▊";
					break;
				case 7:
					remain--;
                    if (cfg.status.verticalBarFill) { bar = bar + "▇"; break;}
					bar = bar + "▉";
					break;
			}
			for (let i = 0; i < remain; i++) {
				//ISSUE: Every two full bars of so, the width increases by 0.1px. 
                //It's because spaces suck donkey butt, and I'm a bad coder.
				bar = bar + "       ";
			}

        //lastly, add the "closing thing" and return it
        bar += "▏";
        return bar;
    }

    //legacy (windows-friendly) bar
    //startup
    var segments = length*3;
    var remain = length;

    //calculate full segments
    for (let i = 0; i < segments; i++) {
        if (exp >= req / segments * (i+1)) {
            count++;
        }
    }
    //add whole bars
    for (let i = 0; i < Math.floor(count/3); i++) {
        bar = bar + "█";
        remain--;
    }
    //for the "half" bits
    var bits = count % 3;
    switch (bits) {
        case 0:
            break;
        case 1:
            bar = bar + "▒";
            remain--;
            break;
        case 2:
            bar = bar + "▓";
            remain--;
            break;
    }
    //fill all the remaining bits
    for (let i = 0; i < remain; i++) {
        bar = bar + "▁";
    }

    //lastly, add the "closing thing" and return it
    bar += "▏";
    return bar;
  }



module.exports = {
    create,
    refresh,
    update,
    bar
}