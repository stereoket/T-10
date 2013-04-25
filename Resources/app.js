var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var Helper = require("Helper");

var ANDROID = Helper.ANDROID;

var IPHONE = Helper.IPHONE;

var IPAD = Helper.IPAD;

var BLACKBERRY = Helper.BLACKBERRY;

Ti.API.warn(" Device: " + Helper.device);

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

if (IPAD) {
    splashBackgroundImage = "earth_space_ipad.png";
    backgroundImage = "background_ipad.png";
    bigButtonHeight = 130;
    bigButtonWidth = 408;
}

if (BLACKBERRY) {
    splashBackgroundImage = "earth_space_blackberry.png";
    backgroundImage = "background_blackberry.png";
}

Alloy.CFG.splashBackground = "/images/" + splashBackgroundImage;

Alloy.CFG.backgroundImage = "/images/" + backgroundImage;

Alloy.CFG.bigButtonHeight = bigButtonHeight;

Alloy.CFG.bigButtonWidth = bigButtonWidth;

Alloy.CFG.addButton = "#0060C0";

Alloy.createController("index");