/**
 * Helper file ot manage all local notification responses and setting new notices. This will
 * perform lookups agains the weather API for specific cities
 * @module LocalNotifications
 * @type {CommonJS}
 */
var notify = require('bencoding.localnotify');

function localNotificationCallback(e) {
	Ti.API.info("Let's how many local notifications we have scheduled'");
	Ti.API.info("Scheduled LocalNotification = " + e.scheduledCount);
	Ti.API.warn("You have " + e.scheduledCount + " Scheduled LocalNotification");

	var test = JSON.stringify(e, null, 2);
	Ti.API.info("results stringified" + test);
};

/**
 * Returns a value of  a timestamp with a variable minute offset (subtracts the offset against the timestamp),
 * if no timestamp supplied it will produce a value of now
 * @param  {number} timestamp timestamp in milisecs
 * @param  {number} minOffset Integer of the offset in minutes
 * @return {number}           timestamp
 */

function getTimeMinusMinutes(timestamp, minOffset) {
	Ti.API.warn("localNotifications.js > getTimeMinusMinutes()" + timestamp + ',' + minOffset);
	timestamp = (timestamp !== null) ? timestamp * 1000 : new Date().getTime();
	Ti.API.warn('timestamp:' + JSON.stringify(timestamp, null, 2));
	Ti.API.warn('local timezone' + new Date().getTimezoneOffset());
	//convert mins to milliseconds
	var offset = (minOffset * 60) * 1000;
	Ti.API.warn('offset:' + JSON.stringify(offset, null, 2));
	var localeOff = localeOffset();

	// This value is the trigger time - WITH local offset applied
	var newTimestamp = (timestamp - offset - localeOff) / 1000;
	Ti.API.warn('newTimestamp:' + JSON.stringify(newTimestamp, null, 2));
	return newTimestamp;
}

function convertTriggerStringToTimestamp(timeStr) {
	Ti.API.warn("localNotifications.js > convertTriggerStringToTimestamp()");
	var triggerTimestamp = Date.parse(timeStr);
	Ti.API.warn(triggerTimestamp);
	var localeOff = localeOffset();
	var newTimestamp = (triggerTimestamp - localeOff);
	Ti.API.warn(newTimestamp);
	return newTimestamp;
}

function localeOffset(){
	var localeOffset = new Date().getTimezoneOffset(); //minutes
	localeOffset = (localeOffset * 60) * 1000;
	Ti.API.warn('localeOffset:' + JSON.stringify(localeOffset, null, 2));
	return localeOffset;
}

function tidyUpLocalNotifications() {
	Ti.API.warn("localNotifications.js > tidyUpLocalNotifications()");
	// on app boot - alert notification initialisation
	// check for alerts that are in ID:1 (pre-weather checked) that are less than 15 mins
	// (now - 15) > (starttime -15) - if true then delete this 
	// 
	// For astro's this may need to all be UTC only, for demo we use local TImezone

	var currentTimestamp = getTimeMinusMinutes(null, 15);


	Ti.API.warn("TRIGGER TIME w/Offset:" + currentTimestamp);

	//Call this method to return a collection with information on your scheduled notifications
	var results = notify.returnScheduledNotifications();
	Ti.API.info("Let's how many local notifications we have scheduled'");
	Ti.API.info("Scheduled LocalNotification = " + results.scheduledCount);
	Ti.API.warn("You have " + results.scheduledCount + " Scheduled LocalNotification");

	for (var i = results.scheduledCount - 1; i >= 0; i--) {
		// var alertTimestamp = getTimeMinusMinutes(results.notifications[i].userInfo.starttime, 15);
		var alertTimeStr = convertTriggerStringToTimestamp(results.notifications[i].fireDate);

		if (currentTimestamp > alertTimeStr) {
			Ti.API.warn("this alert needs to be removed");

			//We are going to remove all of the LocalNotifications scheduled with a userInfo id value of 1
			var canceledCount = notify.cancelLocalNotificationByKey(results.notifications[i].userInfo.starttime, "starttime");
			Ti.API.warn("You have canceled " + canceledCount + " notifications");
			//Now query the scheduled notifications to make sure our local notification was canceled
			notify.activeScheduledNotifications(localNotificationCallback);

			continue;
		}
		

		Ti.API.info(JSON.stringify(results.notifications[i], null, 2));

	};

	var test = JSON.stringify(results);



}

exports.tidyUpLocalNotifications = tidyUpLocalNotifications