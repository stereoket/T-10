function log(level, message) {
    "use strict";
    var msg;
    try {
        msg = "		***** " + message + " ***** ";
        switch (logMode) {
          case "quiet":
            if ("DEBUG" === level || "WARN" === level || "INFO" === level) return;
            break;

          case "info":
            if ("INFO" !== level) return;
            break;

          case "debug":
            if ("DEBUG" !== level) return;
            break;

          case "warn":
            if ("WARN" !== level) return;
            break;

          case "verbose":        }
        Ti.API.log(level, msg);
    } catch (err) {
        Ti.API.error("Could not trigger the log method" + err.message);
    }
    return true;
}

function isSimulator() {
    if ("Simulator" === Ti.Platform.model) {
        log("warn", "  Simulator Detected  ");
        return true;
    }
    return false;
}

var ANDROID = "android" === Ti.Platform.osname ? true : false;

var IPHONE = "iphone" === Ti.Platform.osname ? true : false;

var IPAD = "ipad" === Ti.Platform.osname ? true : false;

var BLACKBERRY = "blackberry" === Ti.Platform.osname ? true : false;

var logMode = "verbose";

var device = Ti.Platform.osname;

exports.log = log;

exports.isSimulator = isSimulator;

exports.device = device;

exports.ANDROID = ANDROID;

exports.IPHONE = IPHONE;

exports.IPAD = IPAD;

exports.BLACKBERRY = BLACKBERRY;