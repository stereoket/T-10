var Alloy = require('alloy'),
	_ = require("alloy/underscore")._;
var notify = require('bencoding.localnotify');

//This is our callback for our scheduled local notification query

function localNotificationCallback(e) {
	Ti.API.info("Let's how many local notifications we have scheduled'");
	Ti.API.info("Scheduled LocalNotification = " + e.scheduledCount);
	Ti.API.warn("You have " + e.scheduledCount + " Scheduled LocalNotification");

	var test = JSON.stringify(e);
	Ti.API.info("results stringified" + test);
};

/**
 * Retrieve and return all of the locations currently stored
 * @return {object} response object with a summary count and data Array of all the locations in memory
 */

function getAllLocations() {
	var locations, check;
	// check for existing property

	check = Ti.App.Properties.hasProperty('T10_Locations');
	if (!check) {
		return {
			count: 0
		};
	} else {
		locations = Ti.App.Properties.getList('T10_Locations');
		var response = {
			count: locations.length,
			data: locations
		}
	}
	return response;
}

function getMergedLocations(count) {
	var count = count || 15;
	var filePath = 'cityData' + Ti.Filesystem.separator + 'MergedCities.json';
	Ti.API.info("getMergedLocations(): " + filePath);
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filePath);
	if (!file.exists()) {
		return [];
	}
	var rawData = file.read();
	var dataJSON = JSON.parse(rawData);
	var returnArray = [];
	var todayTimestamp = new Date().getTime() / 1000;
	for (var i = 0; i < count; i++) {
		if (dataJSON[i] === undefined) {
			break;
		}
		Ti.API.warn("date checks: today:" + todayTimestamp + " -- and ISS: " + dataJSON[i].time);
		if (todayTimestamp > dataJSON[i].time) {
			count++;
			Ti.API.warn("** EVENT in PAST - MOVE to next record! **");
			continue;
		}
		returnArray.push(dataJSON[i]);
	};

	return returnArray;
}
/**
 * Adds a new location created through the app and all parameters into stored memory
 * @param {object} params data for the location to be added
 * @param {string} params.city Name of the City
 * @param {float} params.cloud_cover percentage of max cloud cover
 * @param {float} params.lat latitiude for given city
 * @param {float} params.lon longitude for given city
 * @param {string} params.time_of_day time of the day for alert [day|night|either]
 */

function addNewLocation(params) {
	Ti.API.info("addNewLocation(params):");
	var locations;

	locations = getAllLocations();

	var locationData = locations.data || [];

	// check against existing locations

	locationData.push(params);
	Ti.API.info(JSON.stringify(locationData, null, 2));
	// append new location to the existing list


	_saveLocation(locationData);
}

/**
 * Save the array of locations into the new pers Memory list
 * @param  {[type]} locationArray [description]
 * @return {[type]}               [description]
 */

function _saveLocation(locationArray) {
	Ti.API.info("_saveLocation");
	//ensure all fields exist as required for the location list (error management)
	// add list to pers Memory
	try {
		Ti.App.Properties.setList('T10_Locations', locationArray);
		createNextPassArray();
	} catch (err) {
		Ti.API.error("Problem saving the location entry:" + err.message);
	}
}

/**
 * Each city has its own array of next passes, this method will ensure it is upto date and current
 * @param  {[type]} cityPasses [description]
 * @return {[type]}            [description]
 */

function updateCityPasses(cityPasses) {

}

function deleteCity(e) {
	Ti.API.info("Location Managert deleting city");
	Ti.API.info(JSON.stringify(e));
	var curCities = getAllLocations(),
		newCities = [];
	for (var i = 0; i < curCities.count; i++) {
		if (curCities.data[i].location.city === e.location.city) {
			Ti.API.info("deleting city: " + e.location.city);


			var filePath = 'cityData' + Ti.Filesystem.separator + e.location.city + '.json';
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filePath);
			var dataDelete = file.deleteFile();
			if (!dataDelete) {
				Ti.API.error("Problems deletingthe file: " + filePath);
			} else {
				Ti.API.info("File deleted ok");
			}
			continue;
		}
		Ti.API.info("Storing city: " + curCities.data[i].location.city);
		newCities.push(curCities.data[i]);
	};
	_saveLocation(newCities);
}

/**
 * Merge all city arrays together, used when adding a new city for a current list
 * @return {[type]} [description]
 */

function createNextPassArray() {
	Ti.API.info("createNextPassArray():");

	//We are going to remove all of the LocalNotifications scheduled with a userInfo id value of 1
	var canceledCount = notify.cancelLocalNotification(1);
	Ti.API.warn("You have canceled " + canceledCount + " notifications");
	//Now query the scheduled notifications to make sure our local notification was canceled
	notify.activeScheduledNotifications(localNotificationCallback);


	var locations = getAllLocations();
	var mergeFilePath = 'cityData' + Ti.Filesystem.separator + 'MergedCities.json';
	var mergeFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mergeFilePath);
	if (locations.count > 0) {
		Ti.API.info("More than 1 entry, stuff to merge");
		Ti.API.info(JSON.stringify(locations.data, ["filePath", "alertParams"], 2));
		var merged = [];
		for (var i = 0; i < locations.count; i++) {
			// read file for this city into memory
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, locations.data[i].filePath);
			var data = file.read();
			var cityJSON = JSON.parse(data);
			Ti.API.info("**** Reading DATA ****");
			var cLen = cityJSON.data.length;
			for (var j = cLen - 1; j >= 0; j--) {
				// Ti.API.info(JSON.stringify(cityJSON.data[j], null, 2));

				// only add entry if greater than current time
				var todayTimestamp = new Date().getTime() / 1000;
				// Ti.API.warn("date checks: today:" + todayTimestamp + " -- and ISS: " + cityJSON.data[j].time);
				if (todayTimestamp > cityJSON.data[j].time) {
					Ti.API.warn("** EVENT in PAST - MOVE to next record! **");
					continue;
				}



				if ((todayTimestamp * 1000) + ((60 * 1000) * Alloy.CFG.weatherCheckTimeOffset) < (cityJSON.data[j].time * 1000)) {



					// Add local notify parameters here (cloud/country/city/starttime/lat/lng)
					notify.scheduleLocalNotification({
						alertBody: "An Weather check needs to be setup now.",
						alertAction: "T-15",
						userInfo: {
							"id": 1,
							"hello": "world",
							"city": cityJSON.data[j].location.city,
							"country": cityJSON.data[j].location.country,
							"starttime": cityJSON.data[j].time
						},
						date: new Date((cityJSON.data[j].time * 1000) - ((60 * 1000) * Alloy.CFG.weatherCheckTimeOffset)) // time minus 15mins
					});
					Ti.API.info("T10: **** Notification added");

				} else {
					Ti.API.info("T10: **** Notification NOT NEEDED");
				}

				merged.push(cityJSON.data[j]);
			};

			Ti.API.warn("current merge count: " + merged.length);

		}
		Ti.API.warn("FINAL merge count: " + merged.length);
		var orderedPass = _.sortBy(merged, function (obj) {
			return obj.time;
		});

		// Ti.API.warn("FINAL sorted array: " + JSON.stringify(orderedPass, null, 2));
		var mergedCityJSON = JSON.stringify(orderedPass);


		Ti.API.info("_writeDataToFile(): " + mergeFilePath);

		var dataWrite = mergeFile.write(mergedCityJSON);
		if (!dataWrite) {
			Ti.API.error("Problems writing the data to the file: " + mergeFilePath);
		} else {
			Ti.API.warn("Merged Data Written");
		}
	} else {
		if (mergeFile.exists()) {
			Ti.API.warn("Deleting Merged File as there are no more cities stored");
			mergeFile.deleteFile();
		}
	}
}

/**
 * Performs a check against a cityName, looking for an entry in persistent Memory. This check is to ensure duplicates are not stored.
 * @param  {string}   cityName
 * @param  {Function} callback decides whether or not to add this city into the storedLocations array
 * @return {boolean}            boolean value in the callback
 */

function checkCity(cityName, callback) {
	Ti.API.info("checkCity():");
	try {
		var locations = getAllLocations();

		function storeCity() {
			callback({
				exists: false
			});
			return true;
		}
		if (locations.count > 0) {
			for (var x in locations.data) {
				Ti.API.warn(JSON.stringify(locations.data[x], ["location"], 2));
				Ti.API.warn(locations.data[x].location.city);
				if (locations.data[x].location.city === cityName) {
					Ti.API.warn("Match Found - ignore");
					callback({
						exists: true,
						data: locations.data[x]
					});
					return true;
					break;
				}
			}
			storeCity();
		} else {
			storeCity();
		}
	} catch (err) {
		Ti.API.error("Problem checking city: " + err.message);
	}
}
exports.getMergedLocations = getMergedLocations;
exports.deleteCity = deleteCity;
exports.getAllLocations = getAllLocations;
exports.addNewLocation = addNewLocation;
exports.checkCity = checkCity;
exports.createNextPassArray = createNextPassArray;