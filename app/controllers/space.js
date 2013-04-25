/**
 * Add Event/Space section opening controller file
 */

var Helper = require('Helper');
var log = Helper.log;


/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */
function open(){
	$.space.open();
}

function addEvent(){
	log("WARN", "Add Event Clicked");
	var addSapceEvent = Alloy.createController('space_addEvent');
	addSapceEvent.open();
	$.space.close();
}


exports.open = open;