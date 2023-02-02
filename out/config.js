//Main manager to configure stuff.
//Used to fetch settings
const vc = require('vscode');

function load() {
    cfg = vc.workspace.getConfiguration("code-levels");
    return cfg;
}

module.exports = {
    load,
}