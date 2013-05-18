var Helper = require('Helper');
var log = Helper.log;
var push = require('push_notification');

/**
 * Local notification Handler - for all city wide alerts - lookup or fire alet screen
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Ti.App.iOS.addEventListener('notification', function (e) {
	Ti.API.info(JSON.stringify(e, null, 2));

	// A fail safe system to not trigger alerts that are stale or in the past.
	var todayTimestamp = (new Date().getTime() / 1000);
	if (todayTimestamp > ((e.userInfo.time * 1000) - ((60 * 1000) * Alloy.CFG.weatherCheckTimeOffset))) {
		Ti.API.warn("Alert time taken too long to trigger - pass time is in the past")
		return;
	} else if (e.userInfo !== undefined && e.userInfo.city !== undefined && e.userInfo.country !== undefined && e.userInfo.starttime !== undefined) {
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
			var data = JSON.parse(ev.data);
			var response = data.response;
			var jresp = JSON.stringify(response, null, 2);
			Ti.API.info("weather lookup info for: " + city +", " + country);
			Ti.API.info(jresp);
			var cityData = require('locationManager').checkCity(city, function(evt){
				if(evt.exists){
					Ti.API.warn(evt.data);
				}

				Ti.API.warn("checking against current weather: " + (response.clouds.all / 100));
			});
			alert("weather look up for : " + city);
		}

		function onErrorCallback(e) {

		}

		// setup a notification that runs
	}

	// alert(e);
})

Ti.App.Properties.setBool('allowPush', true);
if (!Ti.App.Properties.hasProperty('Settings_API_DOMAIN')) {
	Ti.App.Properties.setString('Settings_API_DOMAIN', "localhost");
	Ti.App.Properties.setString('Settings_API_PORT', "8000");
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
	/**
	 * Only activate push notice sequence and login if not on sim (testing only)
	 */
	if (!Helper.isSimulator) {
		push.activatePush();
	}



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