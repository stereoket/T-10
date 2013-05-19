var Helper = require('Helper');
var log = Helper.log;
var push = require('push_notification');
var localNotice = require('localNotifications');

Ti.API.warn("Testing for push service");
/**
 * Only activate push notice sequence and login if not on sim (testing only)
 */
push.activatePush();
// if (!Helper.isSimulator) {

// 	push.activatePush();
// }

localNotice.tidyUpLocalNotifications();

// on app boot - alert notification initialisation
// check for alerts that are in ID:1 (pre-weather checked) that are less than 15 mins
// (now - 15) > (starttime -15) - if true then delete this 

function letsGo(params) {
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn(params.city + " IN T-10");
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn("T10: **** ***** **** ***** ****");
	Ti.API.warn("T10: Trigger the countdown screen option button");
}

/**
 * Local notification Handler - for all city wide alerts - lookup or fire alert screen
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Ti.App.iOS.addEventListener('notification', function (e) {
	// Ti.API.info(JSON.stringify(e, null, 2));

	if (e.userInfo.id === 2) {
		Ti.API.warn("trigger alert screen");
		letsGo(e.userInfo);
		return;
	}

	// A fail safe system to not trigger alerts that are stale or in the past.
	// If (now - 10 ) > (starttime -10)
	var todayTimestamp = (new Date().getTime() / 1000);
	// if (todayTimestamp > ((e.userInfo.time * 1000) - ((60 * 1000) * Alloy.CFG.weatherCheckTimeOffset))) {
	// 	Ti.API.warn("Alert time taken too long to trigger - pass time is in the past")
	// 	return;
	// } else 

	if (e.userInfo !== undefined && e.userInfo.city !== undefined && e.userInfo.country !== undefined && e.userInfo.starttime !== undefined) {
		// monitor weather patterns for the cloud cover or better for chosen city/
		var city = e.userInfo.city;
		var country = e.userInfo.country;

		Ti.API.warn("**** **** ALARM CHECK **** ****");
		Ti.API.warn("**** **** ----- ----- **** ****");
		Ti.API.warn("**** **** ----- ----- **** ****");
		Ti.API.warn("**** **** " + city + " **** ****");
		Ti.API.warn("**** **** " + country + " **** ****");
		Ti.API.warn("**** **** " + new Date(e.userInfo.starttime * 1000) + " **** ****");
		Ti.API.warn("**** **** ----- ----- **** ****");
		Ti.API.warn("**** **** ----- ----- **** ****");

		// http://api.openweathermap.org/data/2.5/weather?q=London,uk

		var XHR = require("xhr");
		var xhr = new XHR();
		xhr.get("http://api.openweathermap.org/data/2.5/weather?q=" + e.userInfo.city + ", " + e.userInfo.country, onSuccessCallback, onErrorCallback);

		function onSuccessCallback(ev) {
			Ti.API.warn("Successful API Call");
			Ti.API.info(JSON.stringify(ev, null, 2));
			var data = JSON.parse(ev.data);
			// var response = data.response;

			Ti.API.info("weather lookup info for: " + city + ", " + country);

			var cityData = require('locationManager').checkCity(city, function (evt) {
				if (evt.exists) {
					Ti.API.info("Notificaion Trigger City Lookup:");
					Ti.API.warn("stored cloud value: " + evt.data.alertParams.max_cloud_cover);
					var cloudcover = evt.data.alertParams.max_cloud_cover;
					var curCloudCover = data.clouds.all / 100;
					Ti.API.warn("checking against current weather conditions: " + curCloudCover);
					if (curCloudCover < cloudcover) {
						var notify = require('bencoding.localnotify');
						Ti.API.warn("data: " + JSON.stringify(data, null, 2));
						// Add local notify parameters here (cloud/country/city/starttime/lat/lng)
						notify.scheduleLocalNotification({
							alertBody: data.alertParams.location.city + " IN T-10!",
							alertAction: "Let's Go!",
							userInfo: {
								"id": 2,
								"t10": true,
								"city": data.alertParams.location.city,
								"country": data.alertParams.location.country,
								"starttime": data.alertParams.time
							},
							date: new Date((data.alertParams.time * 1000) - ((60 * 1000) * 10)) // time minus 10mins 
						});
						Ti.API.info("T10: **** Notification added");
						Ti.API.warn("weather look up for : " + data.alertParams.location.city);
					}
				}
				// If weather lookup matches, schedule an alert on diff channel for T10
				// if not - then remove/delete this notification. - silently ignore.
			});

		}

		function onErrorCallback(e) {

		}

		// setup a notification that runs
	}

	// alert(e);
})

Ti.App.Properties.setBool('allowPush', true);
if (!Ti.App.Properties.hasProperty('Settings_API_DOMAIN')) {
	Ti.App.Properties.setString('Settings_API_DOMAIN', "api.teeminus10.com");
	Ti.App.Properties.setString('Settings_API_PORT', "80");
}
Ti.API.warn("API server being used: " + Ti.App.Properties.getString('Settings_API_DOMAIN') + ":" + Ti.App.Properties.getString('Settings_API_PORT'));

function incrementAppLaunchCount() {
	var spCount = Ti.App.Properties.getInt('appLaunchCount');

	Ti.App.Properties.setInt('appLaunchCount', spCount += 1);
	log("DEBUG", "appLaunchCount:" + Ti.App.Properties.getInt('appLaunchCount'));
}

function checkSplashLaunch() {
	log("DEBUG", "Checking App Launch Count");
	// Check persData for previous launch
	incrementAppLaunchCount();



}

function launchSpaceApp() {
	log("INFO", "Launching Space App");
	Ti.App.Properties.setString('appmode', 'space');
	checkSplashLaunch();
	nextPasses = Alloy.createController('next_passes');
	nextPasses.open();

	// SETUP SWIPE GESTURES
	// 
}


function launchEarthApp() {
	log("INFO", "Launching Earth App");
	alert("This app was Designed to work in\nS P A C E !");
	// Ti.App.Properties.setString('appmode', 'earth');
	// checkSplashLaunch();
	// firstWin = Alloy.createController('earth');

}

// Check index launch value, leave a small gap before launching the main window - so splash screen has some visibility
setTimeout(function () {


	$.index.open();


	// if (Ti.App.Properties.getInt('appLaunchCount') > 3) {
	// 	var firstWin;
	// 	switch (Ti.App.Properties.getString('appmode')) {
	// 		case 'space':
	// 			launchSpaceApp();
	// 			break;

	// 		case 'earth':
	// 			launchEarthApp();
	// 			break;
	// 	}
	// } else {

	// 	$.index.open();


	// }
}, 1500);