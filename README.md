# code-levels README

![Extension demonstration](imgs/01.png)

**NOTE:** The source code was uploaded here by request. As a hobby project, this code **_sucks_**. You have been warned. I am not held liable for any brain damage caused by looking at this.

**NOTE 2 THE SEQUEL:** You may use the issue tracker to ask for support under any of the given labels. I will primarily only fix major bugs that negatively impact the usage experience. I do however have plenty of time to add support for as many languages as possible, though I prefer to remain within the scope of VS Code Marketplace extensions. Please do give me the language identifier (i.e. **code-text-binary**, not just "Binary"), so it skips having to test it.

~

VS Code Levels (aka code-levels or clv) is an extension that counts how many times you've typed in files. It also helps visualizing it using an experience and level system.

Technically, code-levels is a sequel to a previous extension, called vsc-levels.

**NOTE: Opening Code in multiple instances with the <u>same user</u> is <u>NOT</u> compatible, due to them being treated as completely separate instances. I cannot pass information between them, so I can't fix it. I apologize for any inconveniences caused by this. Consider disabling the extension on a workspace scope in one instance to circumvent this.** 

__To minimize the risk of data loss, before closing, save a file on the active instance with the most user progress. Also consider making workspace settings that disable user tracking or disable the extension entirely in that other instance.__

# Features

* A functional leveling system with your keypresses as experience points.
* Optional workspace-specific level tracking.
* Optional per-language level tracking for workspace and user.
* A webview visualizing all your progress in one package.
* Optional special coloring/medal per language at set levels.
* Absurd degree of customization: just about anything is configurable for a strictly personal experience.

# Requirements

* Visual Studio Code 1.73.0.
* Because of its format, only the distributed versions of Code can make use of the VSIX format.

# Installation (VSIX)
* Get the latest VSIX from the releases tab.
* With an open instance of Code, open the Command Palette (`Ctrl+Shift+P`, or `Command+Shift+P` on Mac) and choose `Extensions: Install from VSIX...`. 
* Use the file dialog to point Code to the freshly downloaded VSIX.
* (Optional, but recommended: Open the Settings with `Ctrl+,`, or `Command+,` on Mac, and search for `@ext:drdoofus.code-levels`. Configure the extension to your liking.)

# Commands
This extension contributes the following commands:
* `code-levels.openuserview`: Show the user profile webview. Opens to the side.
_Bound to Ctrl+Alt+5 by default, or Command+Option+5 for Mac._
* `code-levels.openworkspaceview`: Show the workspace profile webview. Opens to the side.
_Bound to Ctrl+Alt+6 by default, or Command+Option+6 for Mac._
* `code-levels.changebar.user`: Change the status bar to show user level. Hides level if user tracking is disabled.  
_Bound to Ctrl+Alt+1 by default, or Command+Option+1 for Mac._
* `code-levels.changebar.workspace`: Change the status bar to show workspace level. Hides level if workspace tracking is disabled.  
_Bound to Ctrl+Alt+2 by default, or Command+Option+2 for Mac._
* `code-levels.changebar.userlang`: Change the status bar to show current language level (for user). Hides level if language tracking is disabled or doesn't show a valid language.  
_Bound to Ctrl+Alt+3 by default, or Command+Option+3 for Mac._
* `code-levels.changebar.workspacelang`: Change the status bar to show current language level (for workspace) level. Hides level if language tracking is disabled or doesn't show a valid language.  
_Bound to Ctrl+Alt+4 by default, or Command+Option+4 for Mac._
* `code-levels.recalculate.user`: Forces a level recalculation on the user. Useful if you want to fix your level in case it looks off (i.e. experience in negatives).
* `code-levels.recalculate.userlang`: Forces a level recalculation on all known languages in the user file. Useful if any language have strange numbers. Otherwise similar to `code-levels.recalculate.user`.
* `code-levels.recalculate.workspace`: Exactly the same as `code-levels.recalculate.user`, but targets the workspace file instead. 
* `code-levels.recalculate.workspacelang`: Exactly the same as `code-levels.recalculate.userlang`, but targets the workspace file instead. 

# Extension Settings
Check the "Feature Contributions" tab for details.
You can fine-tune literally almost every aspect of this extension to your personal preference.

# Known Issues

* __This extension will not track if you have no workspace open.__
* On first usage, it will return an empty bar. Typing anything solves the problem. This also happens when typing in a language that the userfile hasn't recognized yet.  
* Saving can possibly be finicky while editing in multiple instances of Code. Effort has been made to fix this behavior but I cannot guarantee its behavior to be perfectly normal...  
**ESPECIALLY IN MULTIPLE INSTANCES WITH THE SAME USER, I CAN'T VOUCH FOR YOUR USERFILE'S INTEGRITY.**  
* After changing the language mode for a document, reopen the file to see its changes.
* Editing the settings and/or running some commands also gives you free points because they seem to make changes to documents. It's much heavier on the process itself than simply holding down a button, so I don't feel the urgent need to fix that as there's a more exploitable alternative. Remember, the only person you're ruining the experience for is yourself should you choose to exploit it anyway.  
* After using one of the commands to change the progress bar type to a language mode, it will show full experience & no level until you type. This is to prevent the settings menu to show a language that doesn't exist. Running the command twice also works to fix itself.  
* When using the tooltip to glance at a language ready to level up, it will stay at 99% to prevent taking up too much space (some languages are LONG.). One would probably not obsessively look at it and should prefer to use the webview instead for that.  
* Showing too much in the tooltip causes the scrollbar to appear. That's a VS Code thing... I can't fix that without literally styling it myself, and that's too much effort for a thing that should update a LOT.  


# Release Notes

## 1.0.0-test1
Initial release. Rebuilding the foundation of the codebase does allow for a full rerun of features - thus making the end product more customizable.

These features are inherited from the old version:
* A status bar item that shows current progress to next level, whether it'd be for the user, workspace, or the currently active language in both cases.
* Saving and loading to and from the user data.
* Earning experience with each edit.
* Support to store a lot of languages.
* Commands to switch experience bar mode.
* A copious amount of configuration options, including but not limited to level display, tooltip contents, and even on/off switches for tracking experience for each feature.
* Formatting large numbers for readability & to save space.

These features are new or built upon:
* The ability to manipulate the experience formula yourself, and automatically restore level progress on change.
* The ability to enable/disable user tooltip contents.
* Automatically detecting the language, and condensing "excessive" languages to their parent counterparts (i.e. jsonc > json)
* JSON is actually a language now.
* Beautifies existing language names (i.e. Html > HTML, latex > LaTeX),
* Large number formatting now also has multiple settings.

## 1.0.0-test2 + 1.0.0
* Enabled profile pages for user and workspace. Hotkeys & clicking on the status bar work to open it, too.
* Hard-trims saved user files to 32 characters to prevent save errors.
* Fixed number notation setting swap.
* Number notation now also works for negative numbers (in case you manage to).
* Fixed user language status not working.
* Added new config options related to the webview, as medals are now enabled.
* Webview now updates on configuration change, save and active editor change.

### 1.0.1
* Fixed Workspace language tracking webview showing incorrect information.
* Showed "vanilla Markdown" being shown incorrectly.

### 1.0.2
* Made it so that it only saves when either user tracking settings are enabled. This alleviates some risks of overwriting the data.  
__To minimize the risk of data loss, before closing, save a file on the active instance with the most user progress. Also consider making workspace settings that disable user tracking or disable the extension entirely in that other instance.__

### 1.0.3
* Fixed uncaught exceptions while saving.

### 1.0.4
* Fixed a few unnecessary requires.
* Divides all experience requirements by 5.

## 1.1.0
* Published to GitHub.
* Added convert from go.mod => go.
* Added config option to replace text at the end of tooltip point values.

### 1.1.1
* Documentation hotfix.

## 1.2.0
* Fixed an ancient CSS problem I never noticed would affect something.
* New configuration setting `code-levels.views.useAlternateStyle` that switches up the layout to use more bars.

### 1.2.1
* Fixed a small CSS issue with alternative style.

### 1.2.2
* Fixed bug where `C` actually was interpreted as `code-text-binary`.

## 1.3.0 - the upGRADE, part 1
* **NOTE: This is a big update. Issues may occur. I'll fix them when I see them.**
* Allowed users to translate their levels to "Grades", which can be customized by going inside the extension yourself and checking out `-grades.js`. Your level = your grade.
* Changes in level mods are seen in the webview.
* Added a bunch of new settings:
- - `code-levels.grade.enableForUser`
- - `code-levels.grade.enableForUserLanguage`
- - `code-levels.grade.enableForWorkspace`
- - `code-levels.grade.enableForWorkspaceLanguage`
- - `code-levels.views.medalOffsetForUser`
- - `code-levels.views.medalOffsetForLanguage`
- - `code-levels.views.medalOffsetForWorkspace`
- - `code-levels.views.medalOffsetForWorkspaceLanguage`
- - `code-levels.status.verticalBarFill`
* Made IGM look a little nicer in text, per request.
* Converted all configs to an integer to disallow decimals.
* Changed the license because I suck at legal things.

### 1.3.1
* **THIS UPDATE FIXES A SECURITY ISSUE.**
* Fixed the webview name wrapping badly.

### 1.3.2
* Fixed an issue regarding newlines in grades with the alternate styles in the webview.

## 1.4.0 - the upGRADE, part 2
* Shortened the original grade text because it's obviously overkill
* Added ability to customize the grade text. Only copy safe strings, just to be sure. This can be found as `code-levels.grades.customSequence`.
* Added support for AngelScript.

### 1.4.1
* Restored workspace level recalculation functionality.

**bonus**: for the people that want the old style back, insert this in the custom sequence option:
```
G-,G,G+,F-,F,F+,E-,E,E+,D-,D,D+,C-,C,C+,B-,B,B+,A-,A,A+,S-,S,S+,SS-,SS,SS+,SSS-,SSS,SSS+,⋆,☆,★,★⋆,★☆,★★,★★⋆,★★☆,★★★,★★★⋆,★★★☆,★★★★,★★★★⋆,★★★★☆,★★★★★,★★★★★⋆,★★★★★☆,★★★★★★,★★★★★★⋆,★★★★★★☆,★★★★★★★,★★★★★★★\n⋆,★★★★★★★\n☆,★★★★★★★\n★,★★★★★★★\n★⋆,★★★★★★★\n★☆,★★★★★★★\n★★,★★★★★★★\n★★⋆,★★★★★★★\n★★☆,★★★★★★★\n★★★,10★ ⋆,10★ ☆,11★,11★ ⋆,11★ ☆,12★,12★ ⋆,12★ ☆,13★,13★ ⋆,13★ ☆,14★,14★ ⋆,14★ ☆,15★,15★ ⋆,15★ ☆,16★,16★ ⋆,16★ ☆,17★,17★ ⋆,17★ ☆,18★,18★ ⋆,18★ ☆,19★,19★ ⋆,19★ ☆,20★,20★ ⋆,20★ ☆,21★,21★ ⋆,21★ ☆,22★,22★ ⋆,22★ ☆,23★,23★ ⋆,23★ ☆,24★,24★ ⋆,24★ ☆,25★,25★ ⋆,25★ ☆,26★,26★ ⋆,26★ ☆,27★,27★ ⋆,27★ ☆,28★,28★ ⋆,28★ ☆,29★,29★ ⋆,29★ ☆,30★
```

### 1.4.2
* Shortened mod texts in the webview.

## 1.5.0 - sortage
* Added settings to "pin" languages in the first spaces of the webview. These settings are:
`code-levels.views.pinsForUser` and `code-levels.views.pinsForWorkspace`
**NOTE**: all languages have to end with a semicolon (;) until they will be sorted!

### 1.5.1
* Fixed an age old typo in the configuration.
* It's now possible to turn off leading zeroes on percentages using the `code-levels.status.leadingZeroesOnPercentages` setting.

# Credits
**Dr-Doofus**: Programming the extension in its entirety.  
**Plasmawario**: Testing the extension in its early phase.  
**Artum**: Credited for absolutely no reason.
And you, for actually noticing this extension.