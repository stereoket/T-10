// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var Helper = require('Helper');
var ANDROID = Helper.ANDROID;
var IPHONE = Helper.IPHONE;
var IPAD = Helper.IPAD;
var BLACKBERRY = Helper.BLACKBERRY;
Ti.API.warn(" Device: " + Helper.device);
Ti.API.warn(" Device: " + Helper.ANDROID);
Ti.API.warn(" Device: " + Helper.IPHONE);
Ti.API.warn(" Device: " + Helper.IPAD);
Ti.API.warn(" Device: " + Helper.BLACKBERRY);


var splashBackgroundImage;
var backgroundImage;
var bigButtonHeight;
var bigButtonWidth;

if (ANDROID) {
	splashBackgroundImage = 'earth_space_android.png';
	backgroundImage = "background_android.png";
	bigButtonHeight = 100;
	bigButtonWidth = '80%';
}

if (IPHONE) {
	splashBackgroundImage = 'earth_space_iphone.png';
	backgroundImage = "background_iphone.png";
	bigButtonHeight = 100;
	bigButtonWidth = '80%';
}

if (Helper.IPAD === true) {

	splashBackgroundImage = 'earth_space_ipad.png';
	backgroundImage = "background_ipad.png";
	bigButtonHeight = 130;
	bigButtonWidth = 408


}

if (BLACKBERRY) {
	splashBackgroundImage = 'earth_space_blackberry.png';
	backgroundImage = "background_blackberry.png";
}

	Ti.API.warn("iPad images being selecgted chosen background image !!! " + splashBackgroundImage);


Alloy.CFG.splashBackground = '/images/'+ splashBackgroundImage;
Alloy.CFG.backgroundImage = '/images/'+ backgroundImage;

Alloy.CFG.bigButtonHeight = bigButtonHeight;
Alloy.CFG.bigButtonWidth = bigButtonWidth;

Ti.API.warn(Alloy.CFG.splashBackground + " chosen background image");

/**
 * Colours
 */
Alloy.CFG.addButton = "#0060C0";


