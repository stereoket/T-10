function activatePush() {
    function unsubscribePushChannel(e) {
        var channel = "space" === Ti.App.Properties.getString("appmode") ? "earth" : "space";
        Ti.API.warn(JSON.stringify(e, null, 2));
        Ti.App.Properties.setBool("pushState", true);
        try {
            ACS.unsubscribePushChannel({
                channel: channel,
                success: function(e) {
                    Ti.API.warn(JSON.stringify(e, null, 2));
                    return;
                },
                error: acsErrorManager
            });
        } catch (err) {
            log("ERROR", "Error UN-subscribing from channel with ACS: " + err.name + ":" + err.message);
        }
    }
    function subscribeToChannel() {
        log("WARN", "   subscribeToChannel() " + Ti.App.Properties.getString("appmode"));
        if (!Ti.App.Properties.getBool("allowPush", false)) {
            log("WARN", "   user prefers to not get push notices");
            log("WARN", "   continue with app load");
            return;
        }
        try {
            ACS.subscribeToPush({
                channel: Ti.App.Properties.getString("appmode"),
                success: unsubscribePushChannel,
                error: acsErrorManager
            });
        } catch (err) {
            log("ERROR", "Error subscribing to channel with ACS: " + err.name + ":" + err.message);
        }
    }
    function loginUser() {
        log("WARN", "  loginUser()  ");
        if (!ACS.createNewUser) try {
            ACS.loginUserToACS({
                success: subscribeToChannel,
                error: acsErrorManager
            });
        } catch (err) {
            log("ERROR", "Error logging in user with ACS: " + err.name + ":" + err.message);
        }
    }
    function createUser() {
        log("WARN", "  createUser()  ");
        if (ACS.createNewUser) {
            log("INFO", "  Need to create a new ACS user account: ");
            try {
                ACS.createUserAccount({
                    success: loginUser,
                    error: acsErrorManager
                });
            } catch (err) {
                log("error", "Error Creating new user with ACS: " + err.name + ":" + err.message);
            }
        } else loginUser();
    }
    function loginCallback() {
        log("WARN", "  loginCallback()  ");
        ACS.deviceToken = Ti.App.Properties.getString("deviceToken");
        if (ACS.loggedInToACS) log("WARN", " ********* User Logged IN true - no need to create new account ******** "); else {
            log("WARN", "  This device is NOT Logged into ACS  ");
            log("WARN", "  About to Query ACS userbase against this device  ");
            try {
                ACS.queryNewACSuser({
                    username: ACS.deviceToken,
                    success: createUser,
                    error: acsErrorManager
                });
            } catch (err) {
                log("error", "Error Querying new user with ACS: " + err.name + ":" + err.message);
            }
        }
    }
    function getDeviceToken() {
        try {
            ACS.getDeviceToken({
                success: loginCallback,
                error: acsErrorManager
            });
        } catch (err) {
            log("error", "Error Getting Device token: " + err.name + ":" + err.message);
        }
    }
    function acsErrorManager(evt) {
        log("ERROR", " ********* ERROR CALLBACK ******** ");
        log("DEBUG", JSON.stringify(evt, null, 2));
    }
    Ti.App.Properties.setBool("acs-init", true);
    try {
        log("INFO", "attempting to login to enable push notification");
        ACS.login({
            success: getDeviceToken,
            error: acsErrorManager
        });
    } catch (err) {
        Ti.API.error("Error in the initial ACS login sequence: " + err.name + ":" + err.message);
    }
}

var acs_ph = require("ACS_Push_Helper");

var ACS = new acs_ph.ACSpush();

var configs = require("Helper");

var log = configs.log;

exports.activatePush = activatePush;