//For commands.
const vc = require('vscode');
const conf = require('./config.min.js');
const language = require('./language.min.js');
const status = require('./status.min.js');
const lvlogic = require('./lvlogic.min.js');
const views = require('./views.min.js');

function register(c) {
    //profile views (user/workspace)
    let profile = vc.commands.registerCommand('code-levels.openuserview', () => {
        views.viewU = views.userOpen();
    });
    let profileW = vc.commands.registerCommand('code-levels.openworkspaceview', () => {
        views.viewW = views.workspaceOpen();
    });
    //change exp type
    let expType1 = vc.commands.registerCommand('code-levels.changebar.user', () => {
        const cfg = conf.load();
        target = !cfg.other.barCommandsAffectWorkspaceSettingsInstead;
        cfg.update("status.displayExperienceType", 1, target);
        status.update(0, language.get());
    });
    let expType2 = vc.commands.registerCommand('code-levels.changebar.workspace', () => {
        const cfg = conf.load();
        target = !cfg.other.barCommandsAffectWorkspaceSettingsInstead;
        cfg.update("status.displayExperienceType", 2, target);
        status.update(0, language.get());
    });
    let expType3 = vc.commands.registerCommand('code-levels.changebar.userlang', () => {
        const cfg = conf.load();
        target = !cfg.other.barCommandsAffectWorkspaceSettingsInstead;
        cfg.update("status.displayExperienceType", 3, target);
        status.update(0, language.get());
    });
    let expType4 = vc.commands.registerCommand('code-levels.changebar.workspacelang', () => {
        const cfg = conf.load();
        target = !cfg.other.barCommandsAffectWorkspaceSettingsInstead;
        cfg.update("status.displayExperienceType", 4, target);
        status.update(0, language.get());
    });
    //force recalculation
    let forceRecalcUser = vc.commands.registerCommand('code-levels.recalculate.user', () => {
        const cfg = conf.load();
        mod = cfg.user.levelMod;
        lvlogic.userLevelFix(mod);
        status.update(0, language.get());
    });
    let forceRecalcWorkspace = vc.commands.registerCommand('code-levels.recalculate.workspace', () => {
        const cfg = conf.load();
        mod = cfg.workspace.levelMod;
        //lvlogic.workspaceLevelFix(mod);
        status.update(0, language.get());
    });
    let forceRecalcUserLang = vc.commands.registerCommand('code-levels.recalculate.userlang', () => {
        const cfg = conf.load();
        mod = cfg.user.levelModLanguage;
        lvlogic.userLanguageLevelFix(mod);
        vc.window.showInformationMessage("User language levels fixed! Any change updates the status bar.");
    });
    let forceRecalcWorkspaceLang = vc.commands.registerCommand('code-levels.recalculate.workspacelang', () => {
        const cfg = conf.load();
        mod = cfg.workspace.levelModLanguage;
        lvlogic.workspaceLanguageLevelFix(mod);
        vc.window.showInformationMessage("Workspace language levels fixed! Any change updates the status bar.");
    })
    c.subscriptions.push(profile, profileW, 
        expType1, expType2, expType3, expType4,
        forceRecalcUser, forceRecalcWorkspace,
        forceRecalcUserLang, forceRecalcWorkspaceLang);
}

module.exports = {
    register
}