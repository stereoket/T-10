var Helper = require('Helper');
var log = Helper.log;
var push = require('push_notification');

Ti.App.Properties.setBool('allowPush', true);
if(!Ti.App.Properties.hasProperty('Settings_API_DOMAIN')){
	Ti.App.Properties.setString('Settings_API_DOMAIN', "localhost");
	Ti.App.Properties.setString('Settings_API_PORT', "8000");
}
Ti.API.warn("API server being used: " + Ti.App.Properties.getString('Settings_API_DOMAIN') + ":" +  Ti.App.Properties.getString('Settings_API_PORT'));

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