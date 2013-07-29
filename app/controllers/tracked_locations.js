/**
 * Tracked Locations section opening controller file
 */

var Helper = require('Helper');
var log = Helper.log;


/**
 * Open the tracked locations window
 * @return {void} [description]
 */

function open() {
	$.trackedLocations.addEventListener('blur', function (e) {
		Ti.API.warn("trackedLocations window closed");
		if (!Ti.App.Properties.getBool('settingsFlag')) {
			$.trackedLocations.close();
		}
	});

	$.trackedLocations.open();

}

/**
 * [close description]
 * @return {void} [description]
 */

function close() {
	Ti.API.info("Closing window");
	$.trackedLocations.close();

}

/**
 * [addLocation description]
 * @param {void} e [description]
 */

function addLocation(e) {
	var addEvent = Alloy.createController("space_addEvent");
	addEvent.open();
	// Ti.API.warn("SAVE LOCATION CHANGES");
}

/**
 * [home description]
 * @param  {Object} e [description]
 * @return {void}   [description]
 */

function home(e) {
	var nextPasses = Alloy.createController("next_passes");
	nextPasses.open();
}

/**
 * [editLocation description]
 * @param  {Object} e [description]
 * @return {void}   [description]
 */

function editLocation(e) {
	Ti.API.warn("editLocation click");
	if ($.editLocations.action === "edit") {
		$.editLocations.backgroundImage = "none";
		$.editLocations.title = "Done";
		$.editLocations.action = "done"
		actionDeleteButtons(1);
	} else {
		$.editLocations.backgroundImage = "/images/blueBg.png";
		$.editLocations.title = "Edit";
		$.editLocations.action = "edit"
		actionDeleteButtons(0);
	}
}



/**
 * Will show or hide all of the delete button options in the list view
 * @param  {number} state 0 or 1 for disable or enable
 * @return {void}
 */

function actionDeleteButtons(state) {
	Ti.API.warn('actionDeleteButtons(' + state + ')');
	var i, l = $.locationsList.children[0].children.length;
	for (i = l - 1; i >= 0; i--) {
		$.locationsList.children[0].children[i].children[2].visible = (state) ? true : false;
		$.locationsList.children[0].children[i].children[3].visible = (state) ? true : false;
		// $.locationsListView.children[i].children[3].visible = true; 
	};
}

function triggerNotification(e) {
	Ti.API.warn("tracked_locations.js > trigger notification()");
	// starttime must equal the current time + the notification delay + countdown time
	var city = Ti.App.Properties.getString('Settings_SIM_ALARM_CITY');
	var trigger = Ti.App.Properties.getString('Settings_SIM_ALARM_TRIGGER', "2");
	Ti.API.info(trigger + " time to wait for alert");
	var nowtime = new Date().getTime() / 1000;
	var newStartTime = (
		nowtime + (60 * Number(trigger)) + (60 * Number(Ti.App.Properties.getString('Settings_SIM_MIN_COUNTDOWN', "2")))
	);

	var newAlertTime = (
		nowtime + (60 * Number(trigger))
	);
	var newAlertDate = new Date(newAlertTime * 1000) ;

	var notificationParams = {
		alertBody: city + " IN T-10!",
		alertAction: "Let's Go!",
		userInfo: {
			id: 2,
			city: city,
			country: Ti.App.Properties.getString('Settings_SIM_ALARM_COUNTRY', "GB"),
			clouds: "50",
			starttime: newStartTime
		},
		date: newAlertDate // New time to trigger alarm, modified
	}
	Ti.API.warn(JSON.stringify(notificationParams, null, 2));
	var notify = require('bencoding.localnotify');
	notify.scheduleLocalNotification(notificationParams);
	alert("notification set for " + city + " in " + trigger + " minute(s)");
	// Ti.App.iOS.fireEvent('notification', notificationParams);
}

exports.open = open;
exports.close = close;