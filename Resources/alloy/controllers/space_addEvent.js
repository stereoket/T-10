function Controller() {
    function resetLocation() {
        editLocation = null;
        editIndex = null;
        editTimeOfDay = null;
        editSlider = null;
    }
    function setEditData(e) {
        Ti.API.info("editLocation(e)");
        Ti.API.info(JSON.stringify(e, null, 2));
        editLocation = e.location;
        editIndex = e.index;
        editTimeOfDay = e.time_of_day;
        editSlider = 1 - e.max_cloud_cover;
    }
    function open() {
        $.spaceAddEvent.open();
        $.spaceAddEvent.addEventListener("swipe", function(e) {
            if ("right" === e.direction && "spaceAddEvent" === e.source.id && 90 > e.y) {
                var nextPasses = Alloy.createController("next_passes");
                setTimeout(function() {
                    nextPasses.open();
                    $.spaceAddEvent.close();
                }, 50);
            }
        });
        $.day.selected && ($.day.backgroundImage = "/images/timeButtonSelected.png");
        $.night.selected && ($.night.backgroundImage = "/images/timeButtonSelected.png");
        $.either.selected && ($.either.backgroundImage = "/images/timeButtonSelected.png");
        $.cloudSlider.value = .75;
        if (null !== editLocation) {
            Ti.API.warn("editing location");
            $.cityTextField.value = editLocation.city + ", " + editLocation.country;
            setTimeOfDay({
                source: {
                    id: editTimeOfDay
                }
            });
            Ti.API.warn("set slider value to : " + editSlider);
            $.cloudSlider.value = editSlider;
            Ti.API.warn("slider value to : " + $.cloudSlider.value);
        }
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
        function onSuccessCallback(e) {
            Ti.API.warn("Successful API Call");
            var data = JSON.parse(e.data);
            var response = data.response;
            if (void 0 === response[0]) {
                alert("No scheduled passes for your parameters");
                return;
            }
            Ti.API.warn(response);
            var responseData = {
                data: response
            };
            var responseJSON = JSON.stringify(responseData);
            Helper.writeToAppDataDirectory("cityData", response[0].location.city, responseJSON, bodyData, $.buttonView.timeOfDay);
            var trackedLocations = Alloy.createController("tracked_locations");
            trackedLocations.open();
        }
        function onErrorCallback(e) {
            Ti.API.error("Error in API Call");
            Ti.API.error(JSON.stringify(e));
        }
        require("locationManager");
        var Helper = require("Helper");
        if (!$.cityTextField.value) {
            alert("Error, missing location");
            return false;
        }
        if (void 0 === $.cloudSlider.value) {
            alert("Error, missing cloud");
            return false;
        }
        var bodyData = {
            location: {
                city: $.cityTextField.value
            },
            max_cloud_cover: 1 - $.cloudSlider.value,
            time_of_day: $.buttonView.timeOfDay,
            device_id: "foo"
        };
        Ti.API.warn("JSON BODY DATA");
        var dataJSON = JSON.stringify(bodyData);
        Ti.API.warn(dataJSON);
        var url = apiURL + "/alerts";
        Ti.API.warn(url);
        var options = {
            contentType: "application/json",
            ttl: 5
        };
        var XHR = require("xhr");
        var xhr = new XHR();
        xhr.put(apiURL + "/alerts", dataJSON, onSuccessCallback, onErrorCallback, options);
    }
    function settings() {
        var appPreferences = require("appPrefs");
        appPreferences.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
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
            text: "Add a location:",
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
        $.__views.__alloyId12 = Ti.UI.createView({
            height: 100,
            width: "33%",
            bubbleParent: false,
            id: "__alloyId12"
        });
        $.__views.buttonView.add($.__views.__alloyId12);
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
        $.__views.__alloyId12.add($.__views.day);
        setTimeOfDay ? $.__views.day.addEventListener("click", setTimeOfDay) : __defers["$.__views.day!click!setTimeOfDay"] = true;
        $.__views.__alloyId13 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            text: "Daytime",
            id: "__alloyId13"
        });
        $.__views.__alloyId12.add($.__views.__alloyId13);
        $.__views.__alloyId14 = Ti.UI.createView({
            height: 100,
            width: "33%",
            bubbleParent: false,
            id: "__alloyId14"
        });
        $.__views.buttonView.add($.__views.__alloyId14);
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
        $.__views.__alloyId14.add($.__views.night);
        setTimeOfDay ? $.__views.night.addEventListener("click", setTimeOfDay) : __defers["$.__views.night!click!setTimeOfDay"] = true;
        $.__views.__alloyId15 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            text: "Nightime",
            id: "__alloyId15"
        });
        $.__views.__alloyId14.add($.__views.__alloyId15);
        $.__views.__alloyId16 = Ti.UI.createView({
            height: 100,
            width: "33%",
            bubbleParent: false,
            id: "__alloyId16"
        });
        $.__views.buttonView.add($.__views.__alloyId16);
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
        $.__views.__alloyId16.add($.__views.either);
        setTimeOfDay ? $.__views.either.addEventListener("click", setTimeOfDay) : __defers["$.__views.either!click!setTimeOfDay"] = true;
        $.__views.__alloyId17 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            text: "Either",
            id: "__alloyId17"
        });
        $.__views.__alloyId16.add($.__views.__alloyId17);
        $.__views.sliderView = Ti.UI.createView({
            top: 400,
            width: "100%",
            height: Ti.UI.SIZE,
            layout: "vertical",
            id: "sliderView"
        });
        $.__views.spaceAddEvent.add($.__views.sliderView);
        $.__views.__alloyId18 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "left",
            color: "#fff",
            text: "Maximum Cloud Cover:",
            left: "80",
            width: Ti.UI.FILL,
            id: "__alloyId18"
        });
        $.__views.sliderView.add($.__views.__alloyId18);
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
            text: "50%",
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
            min: "0.5"
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
            text: "0%",
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
        settings ? $.__views.settingsBtn.addEventListener("click", settings) : __defers["$.__views.settingsBtn!click!settings"] = true;
        $.__views.__alloyId19 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "center",
            color: "#fff",
            text: "Settings",
            top: "10",
            id: "__alloyId19"
        });
        $.__views.leftAction.add($.__views.__alloyId19);
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
        $.__views.__alloyId20 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "center",
            color: "#fff",
            text: "Save",
            top: "10",
            id: "__alloyId20"
        });
        $.__views.rightAction.add($.__views.__alloyId20);
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
    var apiURL = "http://" + Ti.App.Properties.getString("Settings_API_DOMAIN") + ":" + Ti.App.Properties.getString("Settings_API_PORT");
    var editLocation = null;
    var editIndex = null;
    $.spaceAddEvent.addEventListener("blur", resetLocation);
    exports.setEditData = setEditData;
    exports.open = open;
    __defers["$.__views.day!click!setTimeOfDay"] && $.__views.day.addEventListener("click", setTimeOfDay);
    __defers["$.__views.night!click!setTimeOfDay"] && $.__views.night.addEventListener("click", setTimeOfDay);
    __defers["$.__views.either!click!setTimeOfDay"] && $.__views.either.addEventListener("click", setTimeOfDay);
    __defers["$.__views.settingsBtn!click!settings"] && $.__views.settingsBtn.addEventListener("click", settings);
    __defers["$.__views.saveBtn!click!sendAlertData"] && $.__views.saveBtn.addEventListener("click", sendAlertData);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;