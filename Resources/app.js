var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var Helper = require("Helper");

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
    splashBackgroundImage = "earth_space_android.png";
    backgroundImage = "background_android.png";
    bigButtonHeight = 100;
    bigButtonWidth = "80%";
}

if (IPHONE) {
    splashBackgroundImage = "earth_space_iphone.png";
    backgroundImage = "background_iphone.png";
    bigButtonHeight = 100;
    bigButtonWidth = "80%";
}

if (true === Helper.IPAD) {
    splashBackgroundImage = "earth_space_ipad.png";
    backgroundImage = "background_ipad.png";
    bigButtonHeight = 130;
    bigButtonWidth = 408;
}

if (BLACKBERRY) {
    splashBackgroundImage = "earth_space_blackberry.png";
    backgroundImage = "background_blackberry.png";
}

Ti.API.warn("iPad images being selecgted chosen background image !!! " + splashBackgroundImage);

Alloy.CFG.splashBackground = "/images/" + splashBackgroundImage;

Alloy.CFG.backgroundImage = "/images/" + backgroundImage;

Alloy.CFG.bigButtonHeight = bigButtonHeight;

Alloy.CFG.bigButtonWidth = bigButtonWidth;

Ti.API.warn(Alloy.CFG.splashBackground + " chosen background image");

Alloy.CFG.addButton = "#0060C0";

Alloy.CFG.bgBlue = "#0060C0";

Alloy.CFG.nextPassListPadding = 20;

Alloy.CFG.locationsListPadding = 14;

Alloy.CFG.cloudSliderTop = 40;

Alloy.CFG.weatherCheckTimeOffset = 15;

Alloy.createController("index");