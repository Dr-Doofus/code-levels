const texts = require('./-texts.min.js');

function prettify(language) {
    //Checks if language matches a key in the converts
    let keys = Object.keys(texts.data).filter(key => key.includes(language));
    //Checks if the first match is filled (skips otherwise)
    if (texts.data[keys[0]] != undefined) {
        lang = texts.data[keys[0]];
    } else {
        lang = prettifyFallback(language);
    }

    // console.log(lang);
    return lang;
}

function prettifyFallback(language) {
	const r = language;
	var sf = "err";
	if (typeof r == "string") {
		const c = r.charAt(0);
		const cf = c.toUpperCase();
		const s = r.substring(1);
		sf = cf + s;
	}
	return sf;
}

module.exports = {
    prettify
}