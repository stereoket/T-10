/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */

var apiURL = "http://" + Ti.App.Properties.getString('Settings_API_DOMAIN') + ":" + Ti.App.Properties.getString('Settings_API_PORT');
var editLocation = null;
var editIndex = null;

Ti.API.warn("*** URL API = " + apiURL);
$.spaceAddEvent.addEventListener("blur", resetLocation);
$.cloudSlider.addEventListener("change", slideChange);

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

	var network = require('/Helper').checkNetwork();
	if (!network.online) {

		$.messageViewWidget.createIndicator({
			indicator: false,
			message: 'There is no network connection, the app will not function',
			timeoutVal: 2500
		});
	}

	$.spaceAddEvent.open();
	$.spaceAddEvent.addEventListener('blur', function (e) {
		Ti.API.warn("spaceAddEvent window closed");
		if (!Ti.App.Properties.getBool('settingsFlag')) {
			$.spaceAddEvent.close();
		}
	});

	$.spaceAddEvent.addEventListener("swipe", function (e) {
		// Ti.API.info(JSON.stringify(e, null, 2));

		if (e.direction === "right" && e.source.id === "spaceAddEvent" && e.y < 90) {
			var nextPasses = Alloy.createController('next_passes');
			setTimeout(function () {
				nextPasses.open();
				$.spaceAddEvent.close();
			}, 50);
		}
	});

	if ($.day.selected) {
		$.day.backgroundImage = '/images/redButton.png';
	}

	if ($.night.selected) {
		$.night.backgroundImage = '/images/redButton.png';
	}

	// if ($.either.selected) {
	// 	$.either.backgroundImage = '/images/redButton.png';
	// }

	$.cloudSlider.value = 0.5;

	if (editLocation !== null) {
		Ti.API.warn("editing location");
		$.cityTextField.value = editLocation.city + ", " + editLocation.country;
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
	Ti.API.warn(JSON.stringify(e, null, 2));


	// First Toggle the value of the button
	e.source.value = !e.source.value;



	if ($.day.value === $.night.value) {
		$.buttonView.timeOfDay = 'either';
	} else {
		$.buttonView.timeOfDay = e.source.id;
	}
	Ti.API.warn("Setting Time of day for lookup to: " + $.buttonView.timeOfDay);
	var tbg = '/images/blueButton.png'

	switch (e.source.id) {
	case 'day':
		$.day.backgroundImage = (e.source.value) ? '/images/redButton.png' : tbg;
		break;

	case 'night':
		$.night.backgroundImage = (e.source.value) ? '/images/redButton.png' : tbg;
		break;

		// case 'either':
		// 	$.either.backgroundImage = '/images/redButton.png';
		// 	break;
	}
}

function sendAlertData(e) {
	var that = this;
	var locationManager = require('locationManager');
	var Helper = require('Helper');
	var notify = require('bencoding.localnotify');

	var network = require('/Helper').checkNetwork();
	// if (!network.online) {
	// 	$.messageViewWidget.createIndicator({
	// 		indicator: false,
	// 		message: 'There is no network connection, you can not add a city',
	// 		timeoutVal: 2500
	// 	});
	// 	return;
	// }


	$.messageViewWidget.createIndicator({
		indicator: true,
		message: 'Searching for ISS passes',
		timeoutVal: 3000
	});



	function errorCheck() {

	}

	// Ti.API.warn(JSON.stringify($.cityTextField, ["value"], 2));

	if (!$.cityTextField.value) {
		$.messageViewWidget.createMessageView({
			message: "You must enter a City/Location",
			timeoutVal: 700
		});

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
		device_id: Ti.App.Properties.getString('acsUserID') // TODO this should be the user ID - but he server is confused with deviceID - label to change
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
		$.messageViewWidget.hideIndicator();
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


		var trackedLocations = Alloy.createController("tracked_locations");
		trackedLocations.open();

	}

	function onErrorCallback(e) {
		Ti.API.error("Error in API Call");
		$.messageViewWidget.createMessageView({
			message: "Data Error Occurred.",
			timeoutVal: 700
		});

		Ti.API.error(JSON.stringify(e));
	}
}

function slideChange(e) {
	// Ti.API.warn(JSON.stringify(e));
	$.cloudSliderTitle.text = "Visibility (Cloud Cover: " + parseInt((e.value * 100)) + "%)";
}

function home(e) {
	var nextPasses = Alloy.createController("next_passes");
	nextPasses.open();
}

function settingsButton(e) {
	Ti.API.error("Settings Clicked");
	Ti.App.Properties.setBool('settingsFlag', true);
	var appPreferences = require('appPrefs');
	appPreferences.open();
}
exports.setEditData = setEditData;
exports.open = open;