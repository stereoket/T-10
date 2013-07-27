var Cloud = require("ti.cloud"), CloudPush;

var configs = require("Helper");

var ANDROID = configs.ANDROID;

var SIMULATOR = configs.isSimulator();

var log = configs.log;

ANDROID && (CloudPush = require("ti.cloudpush"));

var defaultChannelName = "space";

var ACSpush = function() {
    "use strict";
    this.callbackError = false;
    this.subscribedChannels = Ti.App.Properties.getList("subscribedChannels");
    if (null === this.subscribedChannels) {
        log("warn", "Setting a channel list property for a general channel set to false, as this is a first time");
        this.subscribedChannels = [ {
            channel: "general",
            state: false
        } ];
        Ti.App.Properties.setList("subscribedChannels", this.subscribedChannels);
    }
};

ACSpush.prototype._checkNetwork = function() {
    "use strict";
    log("DEBUG", Ti.Network.networkTypeName);
    if (Ti.Network.networkType !== Titanium.Network.NETWORK_NONE && Ti.Network.online) {
        Ti.App.Properties.setBool("netState", true);
        return true;
    }
    Ti.App.Properties.setBool("netState", false);
    return false;
};

ACSpush.prototype._checkCallbacks = function(args, name) {
    log("info", "scanning for required callback methods");
    if (args.success && args.error) {
        log("INFO", "callbacks present");
        return;
    }
    this.callbackError = true;
    throw {
        name: "ACS_PH Library Method Error",
        message: "originating method handlers (success or error) not set, cannot proceed. " + name
    };
};

ACSpush.prototype.login = function(params) {
    "use strict";
    this._checkCallbacks(params, "login()");
    if (!this._checkNetwork()) {
        log("ERROR", "Network Error Check");
        params.error({
            message: "Could not fire login() ACS_PH method - due to network issue"
        });
        return false;
    }
    this.showLoggedInACSuser({
        success: params.success,
        error: params.error
    });
};

ACSpush.prototype.showLoggedInACSuser = function(params) {
    function showMeCallback(e) {
        log("info", "showMeCallback() : " + JSON.stringify(e));
        if (e.success) {
            that.loggedInToACS = true;
            var user = e.users[0];
            log("WARN", "ACS User logged in: " + that.loggedInToACS + "\n id: " + user.id + "\n" + "first name: " + user.first_name + "\n" + "last name: " + user.last_name);
            params.success();
        } else if (401 === e.code) {
            that.loggedInToACS = false;
            log("warn", "Warning: " + e.message);
            params.success();
        } else if (e.error) {
            log("error", e.error && e.name && e.message);
            params.error();
        }
        return;
    }
    var that = this;
    this._checkCallbacks(params, "showLoggedInACSuser()");
    Cloud.Users.showMe(showMeCallback);
};

ACSpush.prototype.getDeviceToken = function(params) {
    "use strict";
    function successCallback(e) {
        log("warn", " getDeviceToken.successCallback() ");
        that.deviceToken = e.deviceToken;
        try {
            that.storeDeviceToken();
            params.success();
        } catch (err) {
            log("error", "ACS_PH problem with/or storing device token: " + err.message);
        }
    }
    function errorCallback(e) {
        throw {
            name: "Push Registration Error",
            message: "could not register for push notificaiton: " + JSON.stringify(e)
        };
    }
    var that = this;
    var successCallback, errorCallback;
    this._checkCallbacks(params, "getDeviceToken()");
    log("warn", "  getDeviceToken  ");
    if (ANDROID) {
        CloudPush.retrieveDeviceToken({
            success: successCallback,
            error: errorCallback
        });
        CloudPush.addEventListener("callback", this.pushPayloadCallback);
    } else if (SIMULATOR) params.success(); else {
        try {
            Ti.Network.remoteNotificationsEnabled && log("debug", "Setting up Push listener, have to register with server for listener: " + Ti.App.Properties.hasProperty("deviceToken"));
        } catch (err) {
            log("error", "error: " + err.message);
        }
        log("warn", "Device Token required. registering with Apple for new token");
        Ti.Network.registerForPushNotifications({
            types: [ Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND ],
            success: successCallback,
            error: errorCallback,
            callback: this.pushPayloadCallback
        });
    }
};

ACSpush.prototype.storeDeviceToken = function() {
    "use strict";
    if ("string" == typeof this.deviceToken) {
        Ti.API.warn('Setting App property "deviceToken" :  ' + this.deviceToken);
        Ti.App.Properties.setString("deviceToken", this.deviceToken);
        var pw = Ti.Utils.md5HexDigest(this.deviceToken).slice(0, 20);
        Ti.App.Properties.setString("acsPassword", pw);
    } else Ti.API.error("Bad Device Token");
    return;
};

ACSpush.prototype.pushPayloadCallback = function(evt) {
    log("WARN", "Push Notice Payload Listener Triggerred");
    var that = this;
    that.payload = evt.data;
    Ti.API.info(that.payload);
    var pushTXT = "Default Title";
    var showMessageAlert = function(msgParams) {
        log("WARN", "Push Notice Payload Message routine");
        var pushAlert = Ti.UI.createAlertDialog({
            title: msgParams.title,
            message: msgParams.message,
            buttonNames: [ "OK" ]
        });
        pushAlert.show();
        Ti.UI.iPhone.appBadge = Ti.UI.iPhone.appBadge > 0 ? Ti.UI.iPhone.appBadge - 1 : 0;
    };
    if (ANDROID) {
        that.payload = JSON.parse(evt.payload);
        if (void 0 !== that.payload.android.title) var title = that.payload.android.title; else title = pushTXT;
        if (void 0 !== that.payload.android.alert.body) var message = that.payload.android.alert.body; else void 0 !== that.payload.android.alert && (message = that.payload.android.alert);
        showMessageAlert({
            title: title,
            message: message
        });
    } else {
        title = void 0 !== that.payload.title ? that.payload.title : pushTXT;
        Titanium.Media.vibrate();
        showMessageAlert({
            title: title,
            message: that.payload.alert
        });
    }
};

ACSpush.prototype.queryNewACSuser = function(params) {
    "use strict";
    function userQueryCallback(e) {
        log("DEBUG", JSON.stringify(e));
        if (e.success && e.users.length > 0) {
            that.createNewUser = false;
            log("WARN", "Success User Already Setup: ");
            that.ACSuserCallback = e.users[0];
            params.success();
        } else if (e.success && 200 === e.meta.code) {
            that.createNewUser = true;
            log("WARN", "No User found with username " + queryUsername);
            log("WARN", "Response from ACS: " + JSON.stringify(e));
            params.success();
        } else e.error && 200 !== e.meta.code && params.error({
            message: "Error response from ACS whilst running Cloud.Users.query in queryNewACSuser() "
        });
    }
    var that = this;
    this._checkCallbacks(params, "queryNewACSuser()");
    Ti.API.info("queryNewACSuser: " + JSON.stringify(params));
    if (SIMULATOR) {
        log("warn", "  Simulator Detected  - setting predefined token  ");
        params.username = "8fe33df3e1a900a8785313164ed6cd8ffca31106b0d9a73181732d1338003bce";
        this.deviceToken = "8fe33df3e1a900a8785313164ed6cd8ffca31106b0d9a73181732d1338003bce";
    }
    if (null !== params.username) var queryUsername = params.username.toLowerCase(); else queryUsername = null;
    if (!this._checkNetwork()) {
        log("ERROR", "Network Error Check");
        params.error({
            message: "Could not fire Cloud.Users.query in queryNewACSuser() ACS_PH - due to network issue"
        });
        return false;
    }
    Cloud.Users.query({
        where: {
            username: queryUsername
        }
    }, userQueryCallback);
};

ACSpush.prototype.createUserAccount = function(params) {
    function createUserCallback(e) {
        if (e.success) {
            that.createNewUser = false;
            var user = e.users[0];
            log("WARN", "Success in creating user account: id: " + user.id + " " + "username: " + user.username + " ");
            Ti.App.Properties.setString("acsUserID", user.id);
            that.ACSuserCallback = user;
            params.success();
        } else params.error({
            message: "ACS_PH error creating a new user: " + JSON.stringify(e)
        });
    }
    var that = this;
    this._checkCallbacks(params, "createUserAccount()");
    Ti.API.warn("The info used for creating a new account" + JSON.stringify(this));
    var pw = Ti.Utils.md5HexDigest(this.deviceToken).slice(0, 20);
    Ti.API.info("**createUserAccount -username " + this.deviceToken);
    Ti.API.info("**createUserAccount -pw " + pw);
    if (!this._checkNetwork()) {
        log("ERROR", "Network Error Check");
        params.error({
            message: "Could not fire Cloud.Users.create in createUserAccount() ACS_PH - due to network issue"
        });
        return false;
    }
    Cloud.Users.create({
        username: this.deviceToken,
        password: pw,
        password_confirmation: pw
    }, createUserCallback);
};

ACSpush.prototype.loginUserToACS = function(params) {
    function loginCallback(e) {
        if (e.success) {
            that.loggedInToACS = true;
            that.createNewUser = false;
            var user = e.users[0];
            log("WARN", "Success loggin user in: id: " + user.id + " " + "username: " + user.username + " ");
            Ti.App.Properties.setString("acsUserID", user.id);
            that.ACSuserCallback = user;
            params.success(e);
        } else params.error({
            message: "ACS_PH error logging in user: " + JSON.stringify(e)
        });
    }
    var pw, login, that = this;
    this._checkCallbacks(params, "loginUserToACS()");
    login = void 0 !== params.login ? params.login : this.deviceToken;
    pw = void 0 !== params.pw ? params.pw : Ti.Utils.md5HexDigest(this.deviceToken).slice(0, 20);
    if (!this._checkNetwork()) {
        log("ERROR", "Network Error Check");
        params.error({
            message: "Could not fire Cloud.Users.login in loginUserToACS() ACS_PH - due to network issue"
        });
        return false;
    }
    Cloud.Users.login({
        login: login,
        password: pw
    }, loginCallback);
};

ACSpush.prototype.subscribeToPush = function(params) {
    function pushSubscribeCallback(e) {
        if (e.success) {
            log("INFO", "Successfullly Subscribed to ACS Push Channel");
            log("DEBUG", JSON.stringify(e));
            that.subscribeToPushResponse = e;
            that.subscribedChannels = that.returnSubscribedChannels();
            var i, len = that.subscribedChannels.length;
            for (i = 0; len > i; i += 1) {
                if (that.subscribedChannels[i].channel === params.channel) {
                    log("WARN", "** SUBSCRIBE Looping channel list property  ");
                    pnt = true;
                    that.subscribedChannels[i].state = true;
                    Ti.App.Properties.setList("subscribedChannels", that.subscribedChannels);
                }
                if (i === len - 1 && !pnt) {
                    log("WARN", "** SUBSCRIBE Could not find key, asuming new channel being added:" + params.channel);
                    that.subscribedChannels.push({
                        channel: params.channel,
                        state: true
                    });
                    Ti.App.Properties.setList("subscribedChannels", that.subscribedChannels);
                }
            }
            log("DEBUG", JSON.stringify(Ti.App.Properties.getList("subscribedChannels")));
            params.success(e);
        } else params.error({
            message: "ACS_PH error subscribing to channel: " + JSON.stringify(e)
        });
    }
    var that = this, pnt = false;
    this._checkCallbacks(params, "subscribeToPush()");
    params.channel = params.channel || defaultChannelName;
    log("WARN", "channel:" + params.channel);
    log("WARN", "deviceToken:" + that.deviceToken);
    if (ANDROID) {
        CloudPush.enabled = true;
        CloudPush.setShowTrayNotification = true;
    }
    if (!this._checkNetwork()) {
        log("ERROR", "Network Error Check");
        params.error({
            message: "Could not fire Cloud.PushNotifications.subscribe in subscribeToPush() ACS_PH - due to network issue"
        });
        return false;
    }
    Cloud.PushNotifications.subscribe({
        channel: params.channel,
        device_token: that.deviceToken,
        type: ANDROID ? "android" : "ios"
    }, pushSubscribeCallback);
};

ACSpush.prototype.unsubscribePushChannel = function(params) {
    "use strict";
    function unsunscribeCallback(f) {
        if (f.success) {
            that.unsubscribeToPushResponse = f;
            that.subscribedChannels = that.returnSubscribedChannels();
            var i, l = that.subscribedChannels.length;
            for (i = 0; l > i; i += 1) {
                if (that.subscribedChannels[i].channel === params.channel) {
                    log("warn", "** UNSUBSCRIBE CHANNEL - Looping channel list property");
                    pnt = true;
                    that.subscribedChannels[i].state = false;
                    Ti.App.Properties.setList("subscribedChannels", that.subscribedChannels);
                }
                if (i === l - 1 && !pnt) {
                    log("warn", "** UNSUBSCRIBE CHANNEL - Could not find key, asuming new channel being added:" + params.channel);
                    that.subscribedChannels.push({
                        channel: params.channel,
                        state: false
                    });
                    Ti.App.Properties.setList("subscribedChannels", that.subscribedChannels);
                }
            }
            log("DEBUG", JSON.stringify(Ti.App.Properties.getList("subscribedChannels")));
            params.success(f);
        } else params.error({
            message: "ACS_PH error unsubscribing from channel: " + JSON.stringify(f, null, 2)
        });
    }
    var that = this, pnt = false;
    this._checkCallbacks(params, "unsubscribePushChannel()");
    void 0 === params.channel && (params.channel = defaultChannelName);
    if (!this._checkNetwork()) {
        log("ERROR", "Network Error Check");
        params.error({
            message: "Could not fire Cloud.PushNotifications.unsubscribe in unsubscribePushChannel() ACS_PH - due to network issue"
        });
        return false;
    }
    Cloud.PushNotifications.unsubscribe({
        channel: params.channel,
        device_token: this.deviceToken,
        type: ANDROID ? "android" : "ios"
    }, unsunscribeCallback);
    return;
};

ACSpush.prototype.returnSubscribedChannels = function() {
    Ti.API.info("Return list of subscribed channels from persistent memory");
    var list = Ti.App.Properties.getList("subscribedChannels");
    return list;
};

ACSpush.prototype.returnDeviceToken = function() {
    "use strict";
    Ti.API.warn("Device Token:  " + this.deviceToken);
    return this.deviceToken;
};

ACSpush.prototype.deleteDeviceToken = function() {
    "use strict";
    Ti.API.warn("Removing Device Token value from App Proerpty:  ");
    Ti.App.Properties.removeProperty("deviceToken");
    return;
};

ACSpush.prototype.deviceTokenCheck = function() {
    var deviceTokenCheck, deviceToken = Ti.App.Properties.getString("deviceToken");
    Ti.API.info("value of deviceToken :" + deviceToken);
    if (null !== deviceToken && void 0 !== deviceToken && deviceToken) {
        this.deviceToken = deviceToken;
        deviceTokenCheck = true;
    } else {
        Ti.API.info("Device token not previously stored");
        deviceTokenCheck = false;
    }
    Ti.API.info("value of deviceTokenCheck :" + deviceTokenCheck);
    return deviceTokenCheck;
};

ACSpush.prototype.logUserOutOfACS = function() {
    var that = this;
    Cloud.Users.logout(function(e) {
        Ti.API.info(e);
        if (e.success) {
            that.loggedInToACS = false;
            Ti.API.warn("Logged User out of ACS");
        }
    });
};

ACSpush.prototype.sendPushNotification = function(params) {
    var that = this;
    Cloud.PushNotifications.notify({
        channel: params.channel || "general",
        to_ids: params.to_ids,
        payload: params.payload
    }, function(e) {
        e.success ? Ti.API.warn("Success in posting push notice") : Ti.API.error("Callback Error:\\n" + (e.error && e.message || JSON.stringify(e)));
        that.notifyResponse = e;
    });
};

exports.ACSpush = ACSpush;