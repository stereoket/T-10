function Controller() {
    function localNotificationCallback(e) {
        Ti.API.info("Let's how many local notifications we have scheduled'");
        Ti.API.info("Scheduled LocalNotification = " + e.scheduledCount);
        Ti.API.warn("You have " + e.scheduledCount + " Scheduled LocalNotification");
        var test = JSON.stringify(e, null, 2);
        Ti.API.info("results stringified" + test);
    }
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
        var alertT10 = Alloy.createController("alertT10");
        alertT10.open({
            city: params.city,
            starttime: params.starttime
        });
    }
    function incrementAppLaunchCount() {
        var spCount = Ti.App.Properties.getInt("appLaunchCount");
        Ti.App.Properties.setInt("appLaunchCount", spCount += 1);
        log("DEBUG", "appLaunchCount:" + Ti.App.Properties.getInt("appLaunchCount"));
    }
    function checkSplashLaunch() {
        log("DEBUG", "Checking App Launch Count");
        incrementAppLaunchCount();
    }
    function launchSpaceApp() {
        log("INFO", "Launching Space App");
        Ti.App.Properties.setString("appmode", "space");
        checkSplashLaunch();
        nextPasses = Alloy.createController("next_passes");
        nextPasses.open();
    }
    function launchEarthApp() {
        log("INFO", "Launching Earth App");
        alert("This app was Designed to work in\nS P A C E !");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    if (Alloy.isTablet) {
        $.__views.index = Ti.UI.createWindow({
            backgroundImage: Alloy.CFG.splashBackground,
            id: "index"
        });
        $.__views.index && $.addTopLevelView($.__views.index);
        $.__views.space = Ti.UI.createView({
            height: "28%",
            width: "80%",
            background: "transparent",
            top: "10%",
            id: "space"
        });
        $.__views.index.add($.__views.space);
        launchSpaceApp ? $.__views.space.addEventListener("click", launchSpaceApp) : __defers["$.__views.space!click!launchSpaceApp"] = true;
        $.__views.earth = Ti.UI.createView({
            height: "28%",
            width: "80%",
            background: "transparent",
            bottom: "10%",
            id: "earth"
        });
        $.__views.index.add($.__views.earth);
        launchEarthApp ? $.__views.earth.addEventListener("click", launchEarthApp) : __defers["$.__views.earth!click!launchEarthApp"] = true;
    }
    if (true && !Alloy.isTablet) {
        $.__views.__alloyId11 = Ti.UI.createWindow({
            id: "__alloyId11"
        });
        $.__views.__alloyId11 && $.addTopLevelView($.__views.__alloyId11);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Helper = require("Helper");
    var log = Helper.log;
    var push = require("push_notification");
    var localNotice = require("localNotifications");
    Ti.API.warn("Testing for push service");
    push.activatePush();
    localNotice.tidyUpLocalNotifications();
    Ti.App.iOS.addEventListener("notification", function(e) {
        function onSuccessCallback(ev) {
            Ti.API.warn("Successful API Call");
            var data = JSON.parse(ev.data);
            Ti.API.info("weather lookup info for: " + city + ", " + country);
            require("locationManager").checkCity(city, function(evt) {
                Ti.API.warn("City Data returned locally: ");
                Ti.API.warn(evt.data, null, 2);
                if (evt.exists) {
                    Ti.API.info("Notificaion Trigger City Lookup:");
                    Ti.API.warn("stored cloud value: " + evt.data.alertParams.max_cloud_cover);
                    var cloudcover = evt.data.alertParams.max_cloud_cover;
                    var curCloudCover = data.clouds.all / 100;
                    Ti.API.warn("checking against current weather conditions: " + curCloudCover);
                    if (cloudcover > curCloudCover) {
                        var notify = require("bencoding.localnotify");
                        Ti.API.warn("data: " + JSON.stringify(data, null, 2));
                        notify.scheduleLocalNotification({
                            alertBody: evt.data.location.city + " IN T-10!",
                            alertAction: "Let's Go!",
                            userInfo: {
                                id: 2,
                                city: evt.data.location.city,
                                country: evt.data.location.country,
                                starttime: starttime
                            },
                            date: new Date(1e3 * starttime - 6e5)
                        });
                        Ti.API.info("T10: **** Notification added");
                        notify.searchLocalNotificationsByKey(2, "id", localNotificationCallback);
                        Ti.API.warn("weather look up for : " + evt.data.location.city);
                    }
                }
            });
        }
        function onErrorCallback() {}
        if (2 === e.userInfo.id) {
            Ti.API.warn("trigger alert screen");
            letsGo(e.userInfo);
            return;
        }
        new Date().getTime() / 1e3;
        if (void 0 !== e.userInfo && void 0 !== e.userInfo.city && void 0 !== e.userInfo.country && void 0 !== e.userInfo.starttime) {
            var city = e.userInfo.city;
            var country = e.userInfo.country;
            var starttime = e.userInfo.starttime;
            Ti.API.warn("**** **** ALARM CHECK **** ****");
            Ti.API.warn("**** **** ----- ----- **** ****");
            Ti.API.warn("**** **** ----- ----- **** ****");
            Ti.API.warn("**** **** " + city + " **** ****");
            Ti.API.warn("**** **** " + country + " **** ****");
            Ti.API.warn("**** **** " + new Date(1e3 * e.userInfo.starttime) + " **** ****");
            Ti.API.warn("**** **** ----- ----- **** ****");
            Ti.API.warn("**** **** ----- ----- **** ****");
            var XHR = require("xhr");
            var xhr = new XHR();
            xhr.get("http://api.openweathermap.org/data/2.5/weather?q=" + e.userInfo.city + ", " + e.userInfo.country, onSuccessCallback, onErrorCallback);
        }
    });
    Ti.App.Properties.setBool("allowPush", true);
    if (!Ti.App.Properties.hasProperty("Settings_API_DOMAIN")) {
        Ti.App.Properties.setString("Settings_API_DOMAIN", "api.teeminus10.com");
        Ti.App.Properties.setString("Settings_API_PORT", "80");
    }
    Ti.API.warn("API server being used: " + Ti.App.Properties.getString("Settings_API_DOMAIN") + ":" + Ti.App.Properties.getString("Settings_API_PORT"));
    setTimeout(function() {
        $.index.open();
        $.index.addEventListener("blur", function() {
            Ti.API.warn("index window closed");
            $.index.close();
        });
    }, 1500);
    __defers["$.__views.space!click!launchSpaceApp"] && $.__views.space.addEventListener("click", launchSpaceApp);
    __defers["$.__views.earth!click!launchEarthApp"] && $.__views.earth.addEventListener("click", launchEarthApp);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;