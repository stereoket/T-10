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
	// Ti.API.warn(currentLocations);
	
	

	// perform lookup to get the next batch of cities 
	//  
	
	var passData = [{
		city: "London",
		country: "UK",
		cloud_cover:0.3,
		time_of_day: "day",
		duration: 477,
		altitude: 0.5323976278305054,
		risetime: 1368371060,
		azimuth: 6.013176918029785
	}, {
		city: "Paris",
		country: "FR",
		cloud_cover:0.9,
		time_of_day: "night",
		duration: 261,
		altitude: 0.13898998498916626,
		risetime: 1368376955,
		azimuth: 4.616965293884277
	}, {
		city: "Bangkok",
		country: "THA",
		cloud_cover:0.3,
		time_of_day: "night",
		duration: 374,
		altitude: 0.233658567070961,
		risetime: 1368454549,
		azimuth: 0.09984401613473892
	}, {
		city: "Madrid",
		country: "ES",
		cloud_cover:0.8,
		time_of_day: "day",
		duration: 419,
		altitude: 0.32581275701522827,
		risetime: 1368460316,
		azimuth: 5.085291385650635
	}, {
		city: "London",
		country: "UK",
		cloud_cover:0.3,
		time_of_day: "night",
		duration: 493,
		altitude: 0.7858693599700928,
		risetime: 1368543724,
		azimuth: 5.447075366973877
	}];

	var nextData = locationManager.getMergedLocations(10);
	// Ti.API.warn(nextData);
	var nextPassView = $.nextPassesList.init({
		data: nextData
	});
	if(nextPassView){
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

function addLocation(e){
	var addEvent = Alloy.createController("space_addEvent");
	addEvent.open();
}

function viewLocations(e){
	var trackedLocations = Alloy.createController("tracked_locations");
	trackedLocations.open();
	// var addEvent = Alloy.createController("space_addEvent");
	// addEvent.open();
}

function settings(e){
	var appPreferences = require('appPrefs');
	appPreferences.open();
}
exports.open = open;