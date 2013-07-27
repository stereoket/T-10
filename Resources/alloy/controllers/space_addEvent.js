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
        var network = require("/Helper").checkNetwork();
        network.online || $.messageViewWidget.createIndicator({
            indicator: false,
            message: "There is no network connection, the app will not function",
            timeoutVal: 2500
        });
        $.spaceAddEvent.open();
        $.spaceAddEvent.addEventListener("blur", function() {
            Ti.API.warn("spaceAddEvent window closed");
            Ti.App.Properties.getBool("settingsFlag") || $.spaceAddEvent.close();
        });
        $.spaceAddEvent.addEventListener("swipe", function(e) {
            if ("right" === e.direction && "spaceAddEvent" === e.source.id && 90 > e.y) {
                var nextPasses = Alloy.createController("next_passes");
                setTimeout(function() {
                    nextPasses.open();
                    $.spaceAddEvent.close();
                }, 50);
            }
        });
        $.day.selected && ($.day.backgroundImage = "/images/redButton.png");
        $.night.selected && ($.night.backgroundImage = "/images/redButton.png");
        $.cloudSlider.value = .5;
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
        Ti.API.warn(JSON.stringify(e, null, 2));
        e.source.value = !e.source.value;
        $.buttonView.timeOfDay = $.day.value === $.night.value ? "either" : e.source.id;
        Ti.API.warn("Setting Time of day for lookup to: " + $.buttonView.timeOfDay);
        var tbg = "/images/blueButton.png";
        switch (e.source.id) {
          case "day":
            $.day.backgroundImage = e.source.value ? "/images/redButton.png" : tbg;
            break;

          case "night":
            $.night.backgroundImage = e.source.value ? "/images/redButton.png" : tbg;
        }
    }
    function sendAlertData() {
        function onSuccessCallback(e) {
            Ti.API.warn("Successful API Call");
            $.messageViewWidget.createMessageView({
                message: "Pass data found, storing in the app"
            });
            var data = JSON.parse(e.data);
            var response = data.response;
            if (void 0 === response[0]) {
                $.messageViewWidget.createMessageView({
                    message: "No scheduled passes for your parameters, please change parameters",
                    timeoutVal: 1400,
                    disableIndicator: true
                });
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
            $.messageViewWidget.hideIndicator();
        }
        function onErrorCallback(e) {
            Ti.API.error("Error in API Call");
            $.messageViewWidget.createMessageView({
                message: "Data Error reposnse from API, please contact support",
                timeoutVal: 2e3,
                disableIndicator: true
            });
            Ti.API.error(JSON.stringify(e));
        }
        require("locationManager");
        var Helper = require("Helper");
        require("bencoding.localnotify");
        var network = require("/Helper").checkNetwork();
        if (!network.online) {
            $.messageViewWidget.createIndicator({
                indicator: false,
                message: "There is no network connection, you can not add a city",
                timeoutVal: 2500
            });
            return;
        }
        $.messageViewWidget.createIndicator({
            indicator: true,
            message: "Searching for ISS passes"
        });
        if (!$.cityTextField.value) {
            $.messageViewWidget.createMessageView({
                message: "You must enter a City/Location",
                timeoutVal: 1400,
                disableIndicator: true
            });
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
            max_cloud_cover: $.cloudSlider.value,
            time_of_day: $.buttonView.timeOfDay,
            device_id: Ti.App.Properties.getString("acsUserID")
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
    function slideChange(e) {
        $.cloudSliderTitle.text = "Visibility (Cloud Cover: " + parseInt(100 * e.value) + "%)";
    }
    function home() {
        var nextPasses = Alloy.createController("next_passes");
        nextPasses.open();
    }
    function settingsButton() {
        Ti.API.error("Settings Clicked");
        Ti.App.Properties.setBool("settingsFlag", true);
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
        $.__views.messageViewWidget = Alloy.createWidget("uk.co.spiritquest.customActivityMessageIndicator", "widget", {
            id: "messageViewWidget",
            __parentSymbol: $.__views.spaceAddEvent
        });
        $.__views.messageViewWidget.setParent($.__views.spaceAddEvent);
        $.__views.windowTitle = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "left",
            color: "#fff",
            top: 64,
            left: 78,
            text: "Add a location:",
            id: "windowTitle"
        });
        $.__views.spaceAddEvent.add($.__views.windowTitle);
        $.__views.cityTextField = Ti.UI.createTextField({
            left: 64,
            right: 64,
            height: 40,
            top: 150,
            hintText: "Search",
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 24
            },
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            keyboardType: Titanium.UI.KEYBOARD_ASCII,
            paddingLeft: 60,
            id: "cityTextField"
        });
        $.__views.spaceAddEvent.add($.__views.cityTextField);
        $.__views.magnify = Ti.UI.createImageView({
            top: 150,
            left: 74,
            width: 30,
            height: 30,
            image: "/images/magnify.png",
            id: "magnify"
        });
        $.__views.spaceAddEvent.add($.__views.magnify);
        $.__views.buttonView = Ti.UI.createView({
            top: 240,
            height: 100,
            left: 74,
            right: 74,
            cancelBubble: true,
            id: "buttonView",
            timeOfDay: "either"
        });
        $.__views.spaceAddEvent.add($.__views.buttonView);
        $.__views.__alloyId21 = Ti.UI.createView({
            height: 100,
            width: 182,
            bubbleParent: false,
            left: 40,
            id: "__alloyId21"
        });
        $.__views.buttonView.add($.__views.__alloyId21);
        $.__views.day = Ti.UI.createButton({
            width: 128,
            height: 64,
            borderRadius: 8,
            backgroundImage: "/images/blueButton.png",
            bubbleParent: false,
            value: false,
            id: "day"
        });
        $.__views.__alloyId21.add($.__views.day);
        setTimeOfDay ? $.__views.day.addEventListener("click", setTimeOfDay) : __defers["$.__views.day!click!setTimeOfDay"] = true;
        $.__views.dayLabel = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            width: Ti.UI.SIZE,
            center: {
                x: "50%",
                y: "50%"
            },
            shadowColor: "#000",
            shadowOffset: {
                x: 2,
                y: 1
            },
            text: "Daytime",
            id: "dayLabel"
        });
        $.__views.__alloyId21.add($.__views.dayLabel);
        $.__views.__alloyId22 = Ti.UI.createView({
            height: 100,
            width: 182,
            bubbleParent: false,
            right: 40,
            id: "__alloyId22"
        });
        $.__views.buttonView.add($.__views.__alloyId22);
        $.__views.night = Ti.UI.createButton({
            width: 128,
            height: 64,
            borderRadius: 8,
            backgroundImage: "/images/blueButton.png",
            bubbleParent: false,
            value: false,
            id: "night"
        });
        $.__views.__alloyId22.add($.__views.night);
        setTimeOfDay ? $.__views.night.addEventListener("click", setTimeOfDay) : __defers["$.__views.night!click!setTimeOfDay"] = true;
        $.__views.nightLabel = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 34
            },
            textAlign: "center",
            color: "#fff",
            touchEnabled: false,
            width: Ti.UI.SIZE,
            center: {
                x: "50%",
                y: "50%"
            },
            shadowColor: "#000",
            shadowOffset: {
                x: 2,
                y: 1
            },
            text: "Nightime",
            id: "nightLabel"
        });
        $.__views.__alloyId22.add($.__views.nightLabel);
        $.__views.sliderView = Ti.UI.createView({
            top: 340,
            width: "100%",
            height: Ti.UI.SIZE,
            layout: "vertical",
            id: "sliderView"
        });
        $.__views.spaceAddEvent.add($.__views.sliderView);
        $.__views.cloudSliderTitle = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium",
                fontSize: 44
            },
            textAlign: "left",
            color: "#fff",
            top: 60,
            left: 78,
            width: Ti.UI.FILL,
            text: "Visibility (Cloud Cover: )",
            id: "cloudSliderTitle"
        });
        $.__views.sliderView.add($.__views.cloudSliderTitle);
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
                fontFamily: "OstrichSans-Black",
                fontSize: 22
            },
            textAlign: "center",
            color: "#fff",
            top: Alloy.CFG.cloudSliderTop,
            left: 70,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            text: "Clear",
            id: "pickStartLabel"
        });
        $.__views.cloudSliderView.add($.__views.pickStartLabel);
        $.__views.cloudSlider = Ti.UI.createSlider({
            left: 122,
            right: 122,
            height: 30,
            top: Alloy.CFG.cloudSliderTop,
            id: "cloudSlider",
            max: "1",
            min: "0"
        });
        $.__views.cloudSliderView.add($.__views.cloudSlider);
        $.__views.pickEndLabel = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 22
            },
            textAlign: "center",
            color: "#fff",
            top: Alloy.CFG.cloudSliderTop,
            right: 68,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            text: "Cloudy",
            id: "pickEndLabel"
        });
        $.__views.cloudSliderView.add($.__views.pickEndLabel);
        $.__views.actionButtonView = Ti.UI.createView({
            top: 724,
            left: 0,
            width: "100%",
            height: Ti.UI.SIZE,
            id: "actionButtonView"
        });
        $.__views.spaceAddEvent.add($.__views.actionButtonView);
        $.__views.leftAction = Ti.UI.createView({
            left: 72,
            top: 0,
            width: 172,
            height: Ti.UI.SIZE,
            zIndex: 100,
            id: "leftAction"
        });
        $.__views.actionButtonView.add($.__views.leftAction);
        $.__views.alarmSettingsBtn = Ti.UI.createButton({
            width: 172,
            height: 172,
            top: "3",
            backgroundImage: "/images/buttons/alarm_settings.png",
            id: "alarmSettingsBtn"
        });
        $.__views.leftAction.add($.__views.alarmSettingsBtn);
        settingsButton ? $.__views.alarmSettingsBtn.addEventListener("click", settingsButton) : __defers["$.__views.alarmSettingsBtn!click!settingsButton"] = true;
        $.__views.__alloyId23 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 20
            },
            textAlign: "center",
            color: "#fff",
            top: 187,
            text: "Alarm Settings",
            id: "__alloyId23"
        });
        $.__views.leftAction.add($.__views.__alloyId23);
        $.__views.middleAction = Ti.UI.createView({
            id: "middleAction"
        });
        $.__views.actionButtonView.add($.__views.middleAction);
        $.__views.homeBtn = Ti.UI.createButton({
            width: 172,
            height: 172,
            top: "3",
            backgroundImage: "/images/buttons/home.png",
            id: "homeBtn"
        });
        $.__views.middleAction.add($.__views.homeBtn);
        home ? $.__views.homeBtn.addEventListener("click", home) : __defers["$.__views.homeBtn!click!home"] = true;
        $.__views.__alloyId24 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 20
            },
            textAlign: "center",
            color: "#fff",
            top: 187,
            text: "Home",
            id: "__alloyId24"
        });
        $.__views.middleAction.add($.__views.__alloyId24);
        $.__views.rightAction = Ti.UI.createView({
            right: 72,
            top: 0,
            width: 172,
            height: Ti.UI.SIZE,
            id: "rightAction"
        });
        $.__views.actionButtonView.add($.__views.rightAction);
        $.__views.saveBtn = Ti.UI.createButton({
            width: 172,
            height: 172,
            top: "3",
            backgroundImage: "/images/buttons/add_location.png",
            id: "saveBtn"
        });
        $.__views.rightAction.add($.__views.saveBtn);
        sendAlertData ? $.__views.saveBtn.addEventListener("click", sendAlertData) : __defers["$.__views.saveBtn!click!sendAlertData"] = true;
        $.__views.__alloyId25 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Black",
                fontSize: 20
            },
            textAlign: "center",
            color: "#fff",
            top: 187,
            text: "Add Location",
            id: "__alloyId25"
        });
        $.__views.rightAction.add($.__views.__alloyId25);
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
    Ti.API.warn("*** URL API = " + apiURL);
    $.spaceAddEvent.addEventListener("blur", resetLocation);
    $.cloudSlider.addEventListener("change", slideChange);
    exports.setEditData = setEditData;
    exports.open = open;
    __defers["$.__views.day!click!setTimeOfDay"] && $.__views.day.addEventListener("click", setTimeOfDay);
    __defers["$.__views.night!click!setTimeOfDay"] && $.__views.night.addEventListener("click", setTimeOfDay);
    __defers["$.__views.alarmSettingsBtn!click!settingsButton"] && $.__views.alarmSettingsBtn.addEventListener("click", settingsButton);
    __defers["$.__views.homeBtn!click!home"] && $.__views.homeBtn.addEventListener("click", home);
    __defers["$.__views.saveBtn!click!sendAlertData"] && $.__views.saveBtn.addEventListener("click", sendAlertData);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;