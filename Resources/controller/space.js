/**
 * space.js
 */
var ui = require('/ui/space');

function getWindow(params){
	var spaceWin = ui.buildLayout(params);
	return spaceWin;
};

exports.getWindow = getWindow;