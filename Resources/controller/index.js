/**
 * index.js controller
 */
var ui = require('/ui/index');


function getWindow(params){
	var indexWin = ui.buildLayout(params);
	return indexWin;
};

exports.getWindow = getWindow;