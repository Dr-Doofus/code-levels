//Main file. The big fish.
const vc = require('vscode');

//NOTE: this code *WILL* give you brain damage.

///
// CORE
// (happens here so its idiotproof)
///

//load important dependencies in this file
const commands = require('./commands.min.js');
const config = require('./config.min.js');
const data = require('./data.min.js');
const files = require('./files.min.js');
const language = require('./language.min.js');
// const levels = require('./levels.min.js');
const lvlogic = require('./lvlogic.min.js');
// const number = require('./number.min.js');
const status = require('./status.min.js');
const views = require('./views.min.js');

//initial variables i can't put anywhere else
var lang = false;
var cfg = {};
var user = "user";
var userf = "user";

///
// ACTIVATE
// Runs whenever any activationEvents event fires.
// This one only has "onStartupFinished". No need for more.
///
function activate(context) {
	//makes status bar
	status.create(context);
	//registers commands
	commands.register(context);

	//load config
	cfg = config.load();

	//load user/workspace data. Always loads to prevent overwriting.
	if (cfg.user.name) { 
		user = cfg.user.name }; //sets user if a setting has been found
	let usersafe = user.replace(/[^a-zA-Z0-9]/g, ""); //make safe
	userf = usersafe.substring(0, 32);
	files.usrLoad(userf);
	files.wspLoad();

	//get language on startup
	lang = language.get();

	status.update(0, lang);
}

///
// SUPPORT FUNCTIONS
// Functions that don't work elsewhere, if any.
///

///
// EVENTS
// Built-in functions that listen in on events caused by the user.
// It's used here for quicker communication.
///

//auto update configuration
vc.workspace.onDidChangeConfiguration(() => {
	let userDefault = "user";
	//set old values (skips user/workspace logic if config = false)
	if (cfg.user.name) {
		var oldUser = cfg.user.name; } 
	else { var oldUser = userDefault; }
	if (cfg.user.tracking) {
		var oldModU = cfg.user.levelMod; }
	if (cfg.user.trackLanguage) {
		var oldModUL = cfg.user.levelModLanguage; }
	if (cfg.workspace.tracking) {
		var oldModW = cfg.workspace.levelMod; }
	if (cfg.workspace.trackLanguage) {
		var oldModWL = cfg.workspace.levelModLanguage; }

	//actually load the config
	cfg = config.load();

	//set new values (skips user/workspace logic if config = false)
	if (cfg.user.name) {
		var newUser = cfg.user.name; }
	else { var newUser = userDefault; }
	if (cfg.user.tracking) {
		var newModU = cfg.user.levelMod; }
	if (cfg.user.trackLanguage) {
		var newModUL = cfg.user.levelModLanguage; }
	if (cfg.workspace.tracking) {
		var newModW = cfg.workspace.levelMod; }
	if (cfg.workspace.trackLanguage) {
		var newModWL = cfg.workspace.levelModLanguage; }

	//Finally, compare the workspace bits and recalculate if necessary.
	if (newModU != oldModU && cfg.user.tracking) {
		lvlogic.userLevelFix(newModU);
		files.usrSave(oldUser);
	}
	if (newModUL != oldModUL && cfg.user.trackLanguage) {
		lvlogic.userLanguageLevelFix(newModUL);
		files.usrSave(oldUser);
	}
	if (newModW != oldModW && cfg.workspace.tracking) {
		lvlogic.workspaceLevelFix(newModW);
		if (cfg.workspace.tracking || cfg.workspace.trackLanguage) {
			files.wspSave();
		}
	}
	if (newModWL != oldModWL && cfg.workspace.trackLanguage) {
		lvlogic.workspaceLanguageLevelFix(newModWL);
		if (cfg.workspace.tracking || cfg.workspace.trackLanguage) {
			files.wspSave();
		}
	}
	//save it just to be mega sure

	//If the username doesn't match, reload the window.
	if (newUser != oldUser) {
		vc.commands.executeCommand("workbench.action.reloadWindow");
	}

	status.refresh();

	//update webviews if they exist
	if (views.viewU) {
		try { views.userUpdate(); } catch(e) {}
	}
	if (views.viewW) {
		try { views.workspaceUpdate(); } catch(e) {}
	}
});

//on textfile change (type, delete, etc.)
vc.workspace.onDidChangeTextDocument(() => {
	status.update(1, lang);
});

//on save
vc.workspace.onDidSaveTextDocument(() => {
	///
	// MAIN USER LEVEL LOGIC
	///
	if (cfg.user.tracking) {
		if (data.usr.exp && data.usr.lvl) {
			var mod = 10;
	
			//if the config rule exists, use that instead
			if (cfg.user.levelMod) {
				mod = cfg.user.levelMod; 
			}
	
			//check if user is eligible for a level
			lvlogic.userLevelCheck(mod);
		}
	}

	///
	// MAIN WORKSPACE LEVEL LOGIC
	///
	if (cfg.workspace.tracking) {
		if (data.wsp.exp && data.wsp.lvl) {
			var mod = 10;
	
			//if the config rule exists, use that instead
			if (cfg.workspace.levelMod) {
				mod = cfg.workspace.levelMod; 
			}
	
			//check if user is eligible for a level
			lvlogic.workspaceLevelCheck(mod);
		}
	}

	///
	// MAIN USER LANGUAGE LEVEL LOGIC
	///
	if (cfg.user.trackLanguage && lang) {
		if (data.usr.langs[lang].exp && data.usr.langs[lang].lvl) {
			var mod = 5;

			//if the config exists, override it with that instead
			if (cfg.user.levelModLanguage) {
				mod = cfg.user.levelModLanguage;
			}

			//check if user is eligible for a level
			lvlogic.userLanguageLevelCheck(mod, lang);
		}
	}

	///
	// MAIN WORKSPACE LANGUAGE LEVEL LOGIC
	///
	if (cfg.workspace.trackLanguage && lang) {
		if (data.wsp.langs[lang].exp && data.wsp.langs[lang].lvl) {
			var mod = 5;

			//if the config exists, override it with that instead
			if (cfg.workspace.levelModLanguage) {
				mod = cfg.workspace.levelModLanguage;
			}

			//check if user is eligible for a level
			lvlogic.workspaceLanguageLevelCheck(mod, lang);
		}
	}

	//saves both file kinds
	if (cfg.user.tracking || cfg.user.trackLanguage) {
		files.usrSave(userf);
	}
	if (cfg.workspace.tracking || cfg.workspace.trackLanguage) {
		files.wspSave();
	}

	//update webviews if they exist
	if (views.viewU) {
		try { views.userUpdate(); } catch(e) {}
	}
	if (views.viewW) {
		try { views.workspaceUpdate(); } catch(e) {}
	}
});

//on tab change
vc.window.onDidChangeActiveTextEditor(() => {
	//save user/workspace regardless of config
	if (cfg.user.tracking || cfg.user.trackLanguage) {
		files.usrSave(userf);
	}
	if (cfg.workspace.tracking || cfg.workspace.trackLanguage) {
		files.wspSave();
	}

	lang = language.get();

	//finally update status
	status.update(0, lang);

	//update webviews if they exist
	if (views.viewU) {
		try { views.userUpdate(); } catch(e) {}
	}
	if (views.viewW) {
		try { views.workspaceUpdate(); } catch(e) {}
	}
})

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
