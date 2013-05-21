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
	$.space.addEventListener('blur', function (e) {
		Ti.API.warn("space window closed");
		$.space.close();
	});
	$.space.open();
}

function addEvent(){
	log("WARN", "Add Event Clicked");
	var addSapceEvent = Alloy.createController('space_addEvent');
	addSapceEvent.open();
	$.space.close();
}

function listEvents(){

}

exports.open = open;