var notify = require('bencoding.localnotify');

function localNotificationCallback(e) {
	Ti.API.info("Let's how many local notifications we have scheduled'");
	Ti.API.info("Scheduled LocalNotification = " + e.scheduledCount);
	Ti.API.warn("You have " + e.scheduledCount + " Scheduled LocalNotification");

	var test = JSON.stringify(e, null, 2);
	Ti.API.info("results stringified" + test);
};

function getTimeMinusMinutes(timestamp, minOffset) {
	timestamp = (timestamp !== null) ? timestamp * 1000 : new Date().getTime();
	//convert mins to milliseconds
	var offset = (minOffset * 60) * 1000;
	var localeOffset = new Date(timestamp).getTimezoneOffset(); //minutes
	localeOffset = (localeOffset * 60) * 1000;


	var newTimestamp = (timestamp - offset - localeOffset) / 1000;
	return newTimestamp;
}

function tidyUpLocalNotifications() {
	// on app boot - alert notification initialisation
	// check for alerts that are in ID:1 (pre-weather checked) that are less than 15 mins
	// (now - 15) > (starttime -15) - if true then delete this 
	// 
	// For astro's this may need to all be UTC only, for demo we use local TImezone

	var currentTimestamp = getTimeMinusMinutes(null, 15);

	Ti.API.warn("Tidy up local notices");
	Ti.API.warn("NOW:");
	Ti.API.warn(currentTimestamp);

	//Call this method to return a collection with information on your scheduled notifications
	var results = notify.returnScheduledNotifications();
	Ti.API.info("Let's how many local notifications we have scheduled'");
	Ti.API.info("Scheduled LocalNotification = " + results.scheduledCount);
	Ti.API.warn("You have " + results.scheduledCount + " Scheduled LocalNotification");

	for (var i = results.scheduledCount - 1; i >= 0; i--) {
		var alertTimestamp = getTimeMinusMinutes(results.notifications[i].userInfo.starttime, 15);
		if (currentTimestamp > alertTimestamp) {
			Ti.API.warn("this alert needs to be removed");

			//We are going to remove all of the LocalNotifications scheduled with a userInfo id value of 1
			var canceledCount = notify.cancelLocalNotificationByKey(results.notifications[i].userInfo.starttime, "starttime");
			Ti.API.warn("You have canceled " + canceledCount + " notifications");
			//Now query the scheduled notifications to make sure our local notification was canceled
			notify.activeScheduledNotifications(localNotificationCallback);

			continue;
		}
		Ti.API.warn(alertTimestamp);

		Ti.API.info(JSON.stringify(results.notifications[i], ["userInfo"], 2));

	};

	var test = JSON.stringify(results);



}

exports.tidyUpLocalNotifications = tidyUpLocalNotifications