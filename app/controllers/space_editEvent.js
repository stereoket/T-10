/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */
var notify = require('bencoding.localnotify');
var apiURL = "http://" + Ti.App.Properties.getString('Settings_API_DOMAIN') + ":" + Ti.App.Properties.getString('Settings_API_PORT');
var editLocation = null;
var editIndex = null;

$.spaceEditEvent.addEventListener('blur', resetLocation);

function resetLocation() {
	editLocation = null;
	editIndex = null;
	editTimeOfDay = null;
	editSlider = null;
}

function setEditData(e) {
	Ti.API.info("editLocation(e)");
	Ti.API.info(JSON.stringify(e, null, 2));
	editLocation = e.location;
	editIndex = e.index;
	editTimeOfDay = e.time_of_day;
	editSlider = 1 - e.max_cloud_cover;
}

function open() {

	var trackedLocations = Alloy.createController('tracked_locations');
	$.spaceEditEvent.addEventListener('blur', function (e) {
		Ti.API.warn("spaceEditEvent window closed");
		if(!Ti.App.Properties.getBool('settingsFlag')){
			$.spaceEditEvent.close();
		}
		
	});
	$.spaceEditEvent.open();
	$.spaceEditEvent.addEventListener("swipe", function (e) {
		// Ti.API.info(JSON.stringify(e, null, 2));
		if (e.direction === "right" && e.source.id === "spaceEditEvent" && e.y < 90) {

			setTimeout(function () {
				trackedLocations.open();
				$.spaceEditEvent.close();
			}, 50);
		}
	});

	if ($.day.selected) {
		$.day.backgroundImage = '/images/redButton.png';
	}

	if ($.night.selected) {
		$.night.backgroundImage = '/images/redButton.png';
	}

	if ($.either.selected) {
		$.either.backgroundImage = '/images/redButton.png';
	}

	$.cloudSlider.value = 0.75;

	if (editLocation !== null) {
		Ti.API.warn("editing location");
		$.cityLabel.text = editLocation.city + ", " + editLocation.country;
		setTimeOfDay({
			source: {
				id: editTimeOfDay
			}
		});
		Ti.API.warn("set slider value to : " + editSlider);
		$.cloudSlider.value = editSlider;
		Ti.API.warn("slider value to : " + $.cloudSlider.value);
	}
}

function setTimeOfDay(e) {
	// Ti.API.warn(JSON.stringify(e,null,2));
	Ti.API.warn("Setting Time of day for lookup to: " + e.source.id);
	$.buttonView.timeOfDay = e.source.id;
	var tbg = '/images/blueButton.png'
	$.day.backgroundImage = tbg;
	$.night.backgroundImage = tbg;
	$.either.backgroundImage = tbg;


	switch (e.source.id) {
	case 'day':
		$.day.backgroundImage = '/images/redButton.png';
		break;

	case 'night':
		$.night.backgroundImage = '/images/redButton.png';
		break;

	case 'either':
		$.either.backgroundImage = '/images/redButton.png';
		break;
	}
}

function saveData(e) {
	Ti.API.warn("Update EVENT data only - post new settings to SERVER");
	//TODO - new endpoint on server to update a location

	//Call this method to return a collection with information on your scheduled notifications
	var results = notify.returnScheduledNotifications();
	Ti.API.info("Let's how many local notifications we have scheduled'");
	Ti.API.info("Scheduled LocalNotification = " + results.scheduledCount);
	alert("You have " + results.scheduledCount + " Scheduled LocalNotification");
	var test = JSON.stringify(results, null, 2);
	Ti.API.warn("results stringified" + test);

	return;


	var that = this;
	var locationManager = require('locationManager');
	var Helper = require('Helper');

	function errorCheck() {

	}

	// Ti.API.warn(JSON.stringify($.cityTextField, ["value"], 2));

	if (!$.cityTextField.value) {
		alert('Error, missing location');
		return false;
	}

	// Ti.API.warn(JSON.stringify($.cloudSlider, null, 2));
	if ($.cloudSlider.value === undefined) {
		alert('Error, missing cloud');
		return false;
	}

	var bodyData = {
		location: {
			city: $.cityTextField.value
		},
		max_cloud_cover: ($.cloudSlider.value),
		time_of_day: $.buttonView.timeOfDay,
		device_id: "foo"
	};



	Ti.API.warn("JSON BODY DATA");

	var dataJSON = JSON.stringify(bodyData);
	Ti.API.warn(dataJSON);
	var url = apiURL + '/alerts';
	// var urlParams = ["city="+$.cityTextField.value, ]
	// var url = 'http://scifilondontv.com/api/channel/list/otr';
	// alert(url);

	Ti.API.warn(url);
	var options = {
		contentType: "application/json",
		ttl: 5
	};
	var XHR = require("xhr");
	var xhr = new XHR();
	xhr.put(apiURL + "/alerts", dataJSON, onSuccessCallback, onErrorCallback, options);

	function onSuccessCallback(e) {
		Ti.API.warn("Successful API Call");
		var data = JSON.parse(e.data);
		var response = data.response;
		if (response[0] === undefined) {
			alert("No scheduled passes for your parameters");
			return;
		}
		Ti.API.warn(response);
		var responseData = {
			data: response
		}
		var responseJSON = JSON.stringify(responseData);

		Helper.writeToAppDataDirectory('cityData', response[0].location.city, responseJSON, bodyData, $.buttonView.timeOfDay);


		// Ti.API.warn(JSON.stringify(response, null, 2));


		// we Have city data - now store this on filesystem for call back later

		// Merge this individual city data block into a master alllaerts object for the passes screen.
		// 
		// Load up the tracked locations screen

		trackedLocations.open();

	}

	function onErrorCallback(e) {
		Ti.API.error("Error in API Call");
		Ti.API.error(JSON.stringify(e));
	}
}

function newLocation(e) {
	Ti.API.info("New Location setup");
	var addEvent = Alloy.createController("space_addEvent");
	addEvent.open();
}

function settings(e) {
	Ti.App.Properties.setBool('settingsFlag', true);
	var appPreferences = require('appPrefs');
	appPreferences.open();
}

function home(e) {
	var nextPasses = Alloy.createController("next_passes");
	nextPasses.open();
}
exports.setEditData = setEditData;
exports.open = open;