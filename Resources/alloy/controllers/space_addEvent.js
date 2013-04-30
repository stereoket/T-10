function Controller() {
    function open() {
        $.spaceAddEvent.open();
        $.spaceAddEvent.addEventListener("swipe", function(e) {
            Ti.API.info(JSON.stringify(e, null, 2));
            if ("right" === e.direction && "spaceAddEvent" === e.source.id && 50 > e.y) {
                spaceWin = Alloy.createController("space");
                setTimeout(function() {
                    spaceWin.open();
                    $.spaceAddEvent.close();
                }, 50);
            }
        });
        $.day.selected && ($.day.backgroundImage = "/images/timeButtonSelected.png");
        $.night.selected && ($.night.backgroundImage = "/images/timeButtonSelected.png");
        $.either.selected && ($.either.backgroundImage = "/images/timeButtonSelected.png");
    }
    function setTimeOfDay(e) {
        Ti.API.warn("Setting Time of day for lookup to: " + e.source.id);
        $.buttonView.timeOfDay = e.source.id;
        var tbg = "/images/timeButtons.png";
        $.day.backgroundImage = tbg;
        $.night.backgroundImage = tbg;
        $.either.backgroundImage = tbg;
        switch (e.source.id) {
          case "day":
            $.day.backgroundImage = "/images/timeButtonSelected.png";
            break;

          case "night":
            $.night.backgroundImage = "/images/timeButtonSelected.png";
            break;

          case "either":
            $.either.backgroundImage = "/images/timeButtonSelected.png";
        }
    }
    function sendAlertData() {
        Ti.API.warn(JSON.stringify($.cityTextField, [ "value" ], 2));
        if (!$.cityTextField.value) {
            alert("Error, missing location");
            return false;
        }
        Ti.API.warn(JSON.stringify($.cloudSlider, null, 2));
        if (void 0 === $.cloudSlider.value) {
            alert("Error, missing cloud");
            return false;
        }
        var url = "http://localhost:8000/add_event/" + $.cityTextField.value + "/" + (1 - $.cloudSlider.value) + "/" + $.buttonView.timeOfDay + "/" + Ti.App.Properties.getString("acsUserID");
        Ti.API.warn(url);
        var c = Ti.Network.createHTTPClient();
        c.setTimeout(25e3);
        c.onload = function(e) {
            Ti.API.warn(e.response);
            Ti.API.info(JSON.stringify(e, null, 2));
            Ti.API.warn(this.status);
            Ti.API.warn(this.responseText);
            var returnData = JSON.parse(this.responseText);
            if (0 === returnData.length) {
                alert("No PASSES scheduled");
                return;
            }
            var newAlert = Ti.UI.createAlertDialog({
                title: "T-10 Response",
                buttonNames: [ "OK", "Cancel" ],
                cancel: 1,
                message: returnData.length + " Passes scheduled, \n ISS over " + returnData[0].location + " next: \n" + returnData[0].time_str
            });
            newAlert.show();
        };
        c.onerror = function() {
            Ti.API.error("ERROR:" + JSON.stringify(this.responseText, null, 2));
        };
        c.open("POST", url);
        c.send();
    }
    function settingsPage() {
        var prefs = require("tiprefs");
        prefs.init("T-10 Settings");
        prefs.addSwitch({
            id: "SAVE_ON_QUIT",
            caption: "Alarm"
        });
        prefs.addSwitch({
            id: "HIDE_ALERTS",
            caption: "Push Alerts"
        });
        prefs.addChoice({
            id: "DAY_OF_WEEK",
            caption: "Day of Week",
            choices: [ {
                title: "Every Monday",
                value: 1
            }, {
                title: "Every Tuesday",
                value: 2
            }, {
                title: "Every Wednesday",
                value: 3
            }, {
                title: "Every Thursday",
                value: 4
            }, {
                title: "Every Friday",
                value: 5
            }, {
                title: "Every Saturday",
                value: 6
            }, {
                title: "Every Sunday",
                value: 7
            } ]
        });
        prefs.addTextInput({
            id: "USERNAME",
            caption: "username",
            value: "myuser"
        });
        prefs.addTextInput({
            id: "API_KEY",
            caption: "API Key",
            value: "1234"
        });
        prefs.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    if (true && Alloy.isTablet) {
        $.__views.spaceAddEvent = Ti.UI.createWindow({
            backgroundImage: Alloy.CFG.backgroundImage,
            bubbleParent: false,
            id: "spaceAddEvent"
        });
        $.__views.spaceAddEvent && $.addTopLevelView($.__views.spaceAddEvent);
        $.__views.cityLabel = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "left",
            color: "#fff",
            top: 64,
            left: 100,
            text: "Add a location to photograph:",
            id: "cityLabel"
        });
        $.__views.spaceAddEvent.add($.__views.cityLabel);
        $.__views.cityTextField = Ti.UI.createTextField({
            left: 80,
            right: 80,
            height: 60,
            top: 140,
            hintText: "Search for a City",
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            keyboardType: Titanium.UI.KEYBOARD_ASCII,
            paddingLeft: 60,
            id: "cityTextField"
        });
        $.__views.spaceAddEvent.add($.__views.cityTextField);
        $.__views.magnify = Ti.UI.createImageView({
            top: 146,
            left: 86,
            width: 50,
            height: 50,
            image: "/images/magnify.png",
            id: "magnify"
        });
        $.__views.spaceAddEvent.add($.__views.magnify);
        $.__views.buttonView = Ti.UI.createView({
            top: 250,
            left: 80,
            right: 80,
            height: 140,
            layout: "horizontal",
            cancelBubble: true,
            id: "buttonView",
            timeOfDay: "either"
        });
        $.__views.spaceAddEvent.add($.__views.buttonView);
        $.__views.__alloyId9 = Ti.UI.createView({
            height: 100,
            width: "33%",
            bubbleParent: false,
            id: "__alloyId9"
        });
        $.__views.buttonView.add($.__views.__alloyId9);
        $.__views.day = Ti.UI.createButton({
            left: 10,
            right: 10,
            height: 100,
            width: Ti.UI.FILL,
            borderRadius: 12,
            backgroundImage: "/images/timeButtons.png",
            bubbleParent: false,
            id: "day"
        });
        $.__views.__alloyId9.add($.__views.day);
        setTimeOfDay ? $.__views.day.addEventListener("click", setTimeOfDay) : __defers["$.__views.day!click!setTimeOfDay"] = true;
        $.__views.__alloyId10 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            text: "Daytime",
            id: "__alloyId10"
        });
        $.__views.__alloyId9.add($.__views.__alloyId10);
        $.__views.__alloyId11 = Ti.UI.createView({
            height: 100,
            width: "33%",
            bubbleParent: false,
            id: "__alloyId11"
        });
        $.__views.buttonView.add($.__views.__alloyId11);
        $.__views.night = Ti.UI.createButton({
            left: 10,
            right: 10,
            height: 100,
            width: Ti.UI.FILL,
            borderRadius: 12,
            backgroundImage: "/images/timeButtons.png",
            bubbleParent: false,
            id: "night"
        });
        $.__views.__alloyId11.add($.__views.night);
        setTimeOfDay ? $.__views.night.addEventListener("click", setTimeOfDay) : __defers["$.__views.night!click!setTimeOfDay"] = true;
        $.__views.__alloyId12 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            text: "Nightime",
            id: "__alloyId12"
        });
        $.__views.__alloyId11.add($.__views.__alloyId12);
        $.__views.__alloyId13 = Ti.UI.createView({
            height: 100,
            width: "33%",
            bubbleParent: false,
            id: "__alloyId13"
        });
        $.__views.buttonView.add($.__views.__alloyId13);
        $.__views.either = Ti.UI.createButton({
            left: 10,
            right: 10,
            height: 100,
            width: Ti.UI.FILL,
            borderRadius: 12,
            backgroundImage: "/images/timeButtons.png",
            bubbleParent: false,
            id: "either",
            selected: "true"
        });
        $.__views.__alloyId13.add($.__views.either);
        setTimeOfDay ? $.__views.either.addEventListener("click", setTimeOfDay) : __defers["$.__views.either!click!setTimeOfDay"] = true;
        $.__views.__alloyId14 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            text: "Either",
            id: "__alloyId14"
        });
        $.__views.__alloyId13.add($.__views.__alloyId14);
        $.__views.sliderView = Ti.UI.createView({
            top: 400,
            width: "100%",
            height: Ti.UI.SIZE,
            layout: "vertical",
            id: "sliderView"
        });
        $.__views.spaceAddEvent.add($.__views.sliderView);
        $.__views.__alloyId15 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "left",
            color: "#fff",
            text: "Visibility Required:",
            id: "__alloyId15"
        });
        $.__views.sliderView.add($.__views.__alloyId15);
        $.__views.cloudSliderView = Ti.UI.createView({
            width: "100%",
            left: 0,
            top: 5,
            height: Ti.UI.SIZE,
            id: "cloudSliderView"
        });
        $.__views.sliderView.add($.__views.cloudSliderView);
        $.__views.pickStartLabel = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 84
            },
            textAlign: "center",
            color: "#fff",
            top: 10,
            left: 4,
            width: "20%",
            height: Ti.UI.SIZE,
            text: "0%",
            id: "pickStartLabel"
        });
        $.__views.cloudSliderView.add($.__views.pickStartLabel);
        $.__views.cloudSlider = Ti.UI.createSlider({
            width: "60%",
            left: "20%",
            height: 20,
            top: 20,
            id: "cloudSlider",
            max: "1",
            min: "0",
            value: "0.5"
        });
        $.__views.cloudSliderView.add($.__views.cloudSlider);
        $.__views.pickEndLabel = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 84
            },
            textAlign: "center",
            color: "#fff",
            top: 10,
            right: 4,
            width: "20%",
            height: Ti.UI.SIZE,
            text: "100%",
            id: "pickEndLabel"
        });
        $.__views.cloudSliderView.add($.__views.pickEndLabel);
        $.__views.actionButtonView = Ti.UI.createView({
            top: 20,
            left: 0,
            width: "100%",
            height: Ti.UI.SIZE,
            id: "actionButtonView"
        });
        $.__views.sliderView.add($.__views.actionButtonView);
        $.__views.leftAction = Ti.UI.createView({
            left: 66,
            top: 0,
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            layout: "vertical",
            id: "leftAction"
        });
        $.__views.actionButtonView.add($.__views.leftAction);
        $.__views.settingsBtn = Ti.UI.createButton({
            width: 184,
            height: 170,
            backgroundImage: "/images/settingsBtn.png",
            top: "3",
            id: "settingsBtn"
        });
        $.__views.leftAction.add($.__views.settingsBtn);
        settingsPage ? $.__views.settingsBtn.addEventListener("click", settingsPage) : __defers["$.__views.settingsBtn!click!settingsPage"] = true;
        $.__views.__alloyId16 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "center",
            color: "#fff",
            text: "Settings",
            top: "10",
            id: "__alloyId16"
        });
        $.__views.leftAction.add($.__views.__alloyId16);
        $.__views.rightAction = Ti.UI.createView({
            right: 66,
            top: 0,
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            layout: "vertical",
            id: "rightAction"
        });
        $.__views.actionButtonView.add($.__views.rightAction);
        $.__views.saveBtn = Ti.UI.createButton({
            width: 184,
            height: 170,
            backgroundImage: "/images/saveBtn.png",
            top: "3",
            id: "saveBtn"
        });
        $.__views.rightAction.add($.__views.saveBtn);
        sendAlertData ? $.__views.saveBtn.addEventListener("click", sendAlertData) : __defers["$.__views.saveBtn!click!sendAlertData"] = true;
        $.__views.__alloyId17 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "center",
            color: "#fff",
            text: "Save",
            top: "10",
            id: "__alloyId17"
        });
        $.__views.rightAction.add($.__views.__alloyId17);
    }
    if (!Alloy.isTablet) {
        $.__views.spaceAddEvent = Ti.UI.createWindow({
            backgroundImage: Alloy.CFG.backgroundImage,
            bubbleParent: false,
            id: "spaceAddEvent"
        });
        $.__views.spaceAddEvent && $.addTopLevelView($.__views.spaceAddEvent);
        $.__views.cityLabel_hh = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 30
            },
            textAlign: "center",
            color: "#fff",
            text: "Add a location to photograph:",
            id: "cityLabel_hh"
        });
        $.__views.spaceAddEvent.add($.__views.cityLabel_hh);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.open = open;
    __defers["$.__views.day!click!setTimeOfDay"] && $.__views.day.addEventListener("click", setTimeOfDay);
    __defers["$.__views.night!click!setTimeOfDay"] && $.__views.night.addEventListener("click", setTimeOfDay);
    __defers["$.__views.either!click!setTimeOfDay"] && $.__views.either.addEventListener("click", setTimeOfDay);
    __defers["$.__views.settingsBtn!click!settingsPage"] && $.__views.settingsBtn.addEventListener("click", settingsPage);
    __defers["$.__views.saveBtn!click!sendAlertData"] && $.__views.saveBtn.addEventListener("click", sendAlertData);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;