/**
 * Helper
 */

/**
 * Platform Constants
 */

var ANDROID = (Ti.Platform.osname === "android") ? true : false;
var IPHONE = (Ti.Platform.osname === "iphone") ? true : false;
var IPAD = (Ti.Platform.osname === "ipad") ? true : false;
var BLACKBERRY = (Ti.Platform.osname === "blackberry") ? true : false;
var logMode = "verbose";
var device = Ti.Platform.osname;



/**
 * system wide Log utility that can be switched on / off in the config.
 * logMode controls how the method call behaves. Pass in quiet and all the logs
 * are not sent to the Titanium log API. info selects a single level.
 * @param  {String} level   The log level WARN, INFO, DEBUG, ERROR (or custom).
 * @param  {String} message Description string that gets passed to the API log
 * @return {bool}
 */

function log(level, message) {
	"use strict";
	var msg;
	try {
		msg = "\t\t***** " + message + ' ***** ';
		// Add your own custom log levels to the switch
		switch (logMode) {
			case 'quiet':
				if (level === 'DEBUG' || level === 'WARN' || level === 'INFO') {
					return;
				}
				break;
			case 'info':
				if (level !== 'INFO') {
					return;
				}
				break;
			case 'debug':
				if (level !== 'DEBUG') {
					return;
				}
				break;
			case 'warn':
				if (level !== 'WARN') {
					return;
				}
				break;
			case 'verbose':

				break;

		}

		Ti.API.log(level, msg);
	} catch (err) {
		Ti.API.error('Could not trigger the log method' + err.message);
	}
	return true;
}

function isSimulator() {
	if (Ti.Platform.model === 'Simulator') {
		log("warn", '  Simulator Detected  ');
		return true;
	} else {
		return false;
	}
}



function writeToAppDataDirectory(folder, filename, data, alertParams, timeOfDay) {
	// var data = data;
	//check folder exists
	Ti.API.info("Helper method - writeToAppDataDirectory()");
	function _checkFolder(folder) {
		Ti.API.warn("_checkFolder(): " + folder);
		var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folder);
		if(!dir.exists()){
			var newDir = dir.createDirectory();
			if(!newDir){
				Ti.API.error("Error creating folder for data in AppData Directory");
				return false;
			} else {
				Ti.API.warn("New folder '"+ folder+"'' created in App Data Dir");
				return true;
			}
		} else {
			return true;
		}
	}

	function _writeDataToFile(data){
		Ti.API.warn("writing this data:");
		Ti.API.warn(data);
		var filePath = folder + Ti.Filesystem.separator + filename + '.json';
		Ti.API.info("_writeDataToFile(): " + filePath);
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filePath);
		var dataWrite = file.write(data);
		if(!dataWrite){
			Ti.API.error("Problems writing the data to the file: " + filePath);
		} else {
			var data = JSON.parse(data);
			var len = data.data.length - 1;
			return {location: data.data[0].location, filePath: filePath, lastTimeEntry: data.data[len].time};
		}
	}
	_checkFolder(folder);
	Ti.API.info("time_of_day: " + alertParams.time_of_day);
	data.timeOfDay = alertParams.time_of_day;
	var fileData = _writeDataToFile(data);
	
	// Write data into folder
	// Create randomized string for filename and return this
	
	// store reference of this entry into the main location persistent list with a reference to the file
	var locationManager = require('locationManager');
	

	function locationCheck(e){
		Ti.API.info("locationCheck() <- callback");
		Ti.API.info(JSON.stringify(e));
		if(!e.exists){
			locationManager.addNewLocation({location: fileData.location, filePath: fileData.filePath, alertParams: alertParams, lastTimeEntry: fileData.lastTimeEntry});
			locationManager.createNextPassArray();
		} else {
			Ti.API.warn("entry already exists, don't need to duplicate");
		}
	}

	locationManager.checkCity(fileData.cityName, locationCheck);
	
	// cityName | filePath | timeOfDay (inside alertParams) | lastTimeEntry | cloudCover | risetime | duration
	
	// add new location arry into persMemory

}

exports.log = log;
exports.isSimulator = isSimulator;
exports.device = device;
exports.ANDROID = ANDROID;
exports.IPHONE = IPHONE;
exports.IPAD = IPAD;
exports.BLACKBERRY = BLACKBERRY;
exports.writeToAppDataDirectory = writeToAppDataDirectory;