//Module w/ objects to store data.
//Actual saving and loading happens in files.js

//initialize saved objects
//usr is also the template for the rest
const usr = {exp:0, lvl:1, langs:{}};
const wsp = {};

//paste the template here
Object.assign(wsp, usr);

module.exports = {
    usr,
    wsp,
}