function log(level, message) {
    "use strict";
    var msg;
    try {
        msg = "		T10: ***** " + message + " ***** ";
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

function checkNetwork() {
    var netInfo, online = true;
    if (Ti.Network.networkType) return Ti.Network.networkTypeName;
    online = false;
    netInfo = {
        online: online,
        code: Ti.Network.networkType,
        type: Ti.Network.networkTypeName
    };
    Ti.API.warn(JSON.stringify(netInfo, null, 2));
    return netInfo;
}

function writeToAppDataDirectory(folder, filename, data, alertParams) {
    function _checkFolder(folder) {
        Ti.API.warn("_checkFolder(): " + folder);
        var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folder);
        if (dir.exists()) return true;
        var newDir = dir.createDirectory();
        if (newDir) {
            Ti.API.warn("New folder '" + folder + "'' created in App Data Dir");
            return true;
        }
        Ti.API.error("Error creating folder for data in AppData Directory");
        return false;
    }
    function _writeDataToFile(data) {
        Ti.API.warn("writing this data:");
        Ti.API.warn(data);
        var filePath = folder + Ti.Filesystem.separator + filename + ".json";
        Ti.API.info("_writeDataToFile(): " + filePath);
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filePath);
        var dataWrite = file.write(data);
        if (dataWrite) {
            var data = JSON.parse(data);
            var len = data.data.length - 1;
            return {
                location: data.data[0].location,
                filePath: filePath,
                lastTimeEntry: data.data[len].time
            };
        }
        Ti.API.error("Problems writing the data to the file: " + filePath);
    }
    function locationCheck(e) {
        Ti.API.info("locationCheck() <- callback");
        Ti.API.info(JSON.stringify(e));
        if (e.exists) Ti.API.warn("entry already exists, don't need to duplicate"); else {
            locationManager.addNewLocation({
                location: fileData.location,
                filePath: fileData.filePath,
                alertParams: alertParams,
                lastTimeEntry: fileData.lastTimeEntry
            });
            locationManager.createNextPassArray();
        }
    }
    Ti.API.info("Helper method - writeToAppDataDirectory()");
    _checkFolder(folder);
    Ti.API.info("time_of_day: " + alertParams.time_of_day);
    data.timeOfDay = alertParams.time_of_day;
    var fileData = _writeDataToFile(data);
    var locationManager = require("locationManager");
    locationManager.checkCity(fileData.cityName, locationCheck);
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

exports.checkNetwork = checkNetwork;

exports.ANDROID = ANDROID;

exports.IPHONE = IPHONE;

exports.IPAD = IPAD;

exports.BLACKBERRY = BLACKBERRY;

exports.writeToAppDataDirectory = writeToAppDataDirectory;