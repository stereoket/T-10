/**
 * Next Passes controller file, immediately after the opening screen
 */

var Helper = require('Helper');
var log = Helper.log;


/**
 * Open the Next Pass window
 * @return {[type]} [description]
 */

function open() {
	var locationManager = require('locationManager');
	var currentLocations = locationManager.getAllLocations();

	var nextData = locationManager.getMergedLocations(20);
	var nextPassView = $.nextPassesList.init({
		data: nextData
	});
	if (nextPassView) {
		$.nextPasses.addEventListener('blur', function (e) {
			Ti.API.warn("new passes window closed");
			if (!Ti.App.Properties.getBool('settingsFlag')) {
				$.nextPasses.close();
			}
		});
		$.nextPasses.open();
	} else {
		var addEvent = Alloy.createController('space');
		addEvent.open();
	}
}

function addEvent() {

}

function listEvents() {

}

function addLocation(e) {
	var addEvent = Alloy.createController("space_addEvent");
	addEvent.open();
}

function viewLocations(e) {
	var trackedLocations = Alloy.createController("tracked_locations");
	trackedLocations.open();
	// var addEvent = Alloy.createController("space_addEvent");
	// addEvent.open();
}

function settings(e) {
	Ti.App.Properties.setBool('settingsFlag', true);
	var appPreferences = require('appPrefs');
	appPreferences.open();
}
exports.open = open;