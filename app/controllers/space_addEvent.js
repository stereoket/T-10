/**
 * Allows user to add a new city/location to the device and store schedlued lookups 
 * @module space_addEvent
 * @todo  document methods
 */

var apiURL = "http://" + Ti.App.Properties.getString('Settings_API_DOMAIN') + ":" + Ti.App.Properties.getString('Settings_API_PORT');
var editLocation = null;
var editIndex = null;
var bodyData;

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

/**
 * Time fo day button click processing, alters the data for the body data API post and the image of the button
 * keeping the state in the UI and in the data.
 * @param {Object} e Click Event Handler call back data for TiUIButton Objects
 */

function setTimeOfDay(e) {
	// First Toggle the value of the button
	e.source.value = !e.source.value;

	Ti.API.warn("Button clicked " + e.source.id + ": " + e.source.value);
	if ($.day.value === $.night.value) {
		$.buttonView.timeOfDay = 'either';
	} else {
		if ($.day.value) {
			$.buttonView.timeOfDay = 'day';
		} else {
			$.buttonView.timeOfDay = 'night';
		}

	}
	Ti.API.warn(" >>> Setting Time of day for lookup to: " + $.buttonView.timeOfDay);
	var tbg = '/images/blueButton.png'

	switch (e.source.id) {
	case 'day':
		$.day.backgroundImage = (e.source.value) ? '/images/redButton.png' : tbg;
		// $.day.value = !$.day.value;
		break;

	case 'night':
		$.night.backgroundImage = (e.source.value) ? '/images/redButton.png' : tbg;
		// $.night.value = !$.night.value;
		break;
	}
}

function validationChecks() {
	// First Check Network State

}

/**
 * Send the data input on the screen to the API server expecting the return of the next 10 passes of the ISS,
 * performs a network check and dispalys message notifications on the state of the process
 * @param  {Object} e [description]
 * @return {void}   [description]
 * @todo needs a validation method put in place to manage the porper sanitisation and checking of input data types
 * @todo device_id label in the body data type && server should in fact refelct the user_id - update so as not to confuse in future
 */

function sendAlertData(e) {
	var that = this;
	var Helper = require('Helper');
	var network = require('/Helper').checkNetwork();
	var notify = require('bencoding.localnotify');
	var locationManager = require('locationManager');
	var XHR = require("xhr");

	if (!network.online) {
		$.messageViewWidget.createIndicator({
			indicator: false,
			message: 'There is no network connection, you can not add a city',
			timeoutVal: 2500
		});
		return;
	}


	$.messageViewWidget.createIndicator({
		indicator: true,
		message: 'Searching for ISS passes'
	});

	// Ti.API.warn(JSON.stringify($.cityTextField, ["value"], 2));

	if (!$.cityTextField.value) {
		$.messageViewWidget.createMessageView({
			message: "You must enter a City/Location",
			timeoutVal: 1400,
			disableIndicator: true
		});
		return false;
	}

	bodyData = {
		location: {
			city: $.cityTextField.value
		},
		max_cloud_cover: ($.cloudSlider.value),
		time_of_day: $.buttonView.timeOfDay,
		device_id: Ti.App.Properties.getString('acsUserID')
	};

	Ti.API.warn("*** JSON BODY DATA ***");
	Ti.API.warn(JSON.stringify(bodyData, null, 2));
	var dataJSON = JSON.stringify(bodyData);
	var url = apiURL + '/alerts';
	// var urlParams = ["city="+$.cityTextField.value, ]
	// var url = 'http://scifilondontv.com/api/channel/list/otr';
	// alert(url);

	Ti.API.warn(url);
	var options = {
		contentType: "application/json",
		ttl: 5
	};

	var xhr = new XHR();
	xhr.put(apiURL + "/alerts", dataJSON, alertsSuccessCallback, alertsErrorCallback, options);
}

/**
 * Success Callback from the T10 API on alerts/ processes the returned data response, writing the data into
 * the local filesystem and opens the tracked locations screen
 * @param  {Object} e [description]
 * @return {void}
 * @example
 * // Example data response from the API response for alerts/
 * <pre>{
	"trigger_time": "2013-07-28 22:39:31",
	"cloudcover": 0.92,
	"location": {
		"timezone": "Europe/London",
		"city": "London",
		"utc_offset": 0,
		"country": "GB"
	},
	"time": 1375052071,
	"duration": 233,
	"time_str": "2013-07-28 22:54:31"
}</pre>
 */

function alertsSuccessCallback(e) {
	// ************* SUCCESSFUL DATA RESPONSE ***************
	// ******************************************************
	Ti.API.warn("Successful API Call");
	$.messageViewWidget.createMessageView({
		message: "Pass data found, storing in the app"
	});
	// ******************************************************
	// ******************************************************

	var data = JSON.parse(e.data);
	var response = data.response;
	Ti.API.warn(JSON.stringify(response, null, 2));
	if (response[0] === undefined) {
		$.messageViewWidget.createMessageView({
			message: "No scheduled passes for your parameters, please change parameters",
			timeoutVal: 1400,
			disableIndicator: true
		});
		return;
	}

	var responseData = {
		data: response
	}
	var responseJSON = JSON.stringify(responseData);
	// Merge this individual city data block into a master alllaerts object for the passes screen.
	Helper.writeToAppDataDirectory('cityData', response[0].location.city, responseJSON, bodyData, $.buttonView.timeOfDay);
	var trackedLocations = Alloy.createController("tracked_locations");
	trackedLocations.open();
	$.messageViewWidget.hideIndicator();
}

/**
 * Error Callback from the T10 API on alerts/
 * @param  {Object} e [description]
 * @return {void}
 */

function alertsErrorCallback(e) {
	Ti.API.error("Error in API Call");
	$.messageViewWidget.createMessageView({
		message: "Data Error reposnse from API, please contact support",
		timeoutVal: 2000,
		disableIndicator: true
	});

	Ti.API.error(JSON.stringify(e));
}

/**
 * Edit the text that appears in the Visibility slider channel as its moved. Updates a TiUILabel with id: #cloudSliderTitle
 * @param  {Object} e Event Callback Object
 * @return {void}
 */

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