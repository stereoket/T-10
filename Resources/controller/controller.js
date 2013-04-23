var UI = require('/lib/UIhelper');
var colours = require('/lib/configs').colours();

function controller() {

};

function background() {


}

function tabgroup() {
	// this sets the background color of the master UIView (when there are no windows/tab groups on it)
	Titanium.UI.setBackgroundImage('/images/background.png');


};


function spaceHome() {

	var space = require('/controller/space');
	

	
	space.getWindow();


	

	trackedButton.add(trackedLabel);
	buttonLayer.add(addNewButton);
	buttonLayer.add(trackedButton);
	spaceHomeWindow.add(buttonLayer);

	trackedButton.addEventListener('click', viewTrackedAlert);
	addNewButton.addEventListener('click', addNewAlert);

	function addNewAlert(e) {
		addNewWindow();
		spaceHomeWindow.close();
	}

	spaceHomeWindow.open();

}

function addNewWindow() {

	var addWindow = Ti.UI.createWindow({
		title: 'New Window',
		backgroundImage: '/images/background.png'
	});

	var topTitle = Ti.UI.createLabel({
		text: 'Location you want to Photograph',
		width: '90%',
		color: '#fff',
		height: Ti.UI.SIZE,
		font: {
			fontFamily: 'Ostrich Sans',
			fontSize: 23
		},
		textAlign: 'center',
		top: 5
	});
	addWindow.add(topTitle);

	var send = Titanium.UI.createButton({
		title: 'Send',
		style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	var camera = Titanium.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.CAMERA,
	});

	var cancel = Titanium.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
	});

	var flexSpace = Titanium.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var searchBox = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText: 'Type in a city name',
		keyboardToolbar: [cancel, flexSpace, flexSpace, flexSpace, send],
		keyboardToolbarColor: '#999',
		keyboardToolbarHeight: 40,
		top: 60,

		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 23
		},
		width: '90%',
		height: 44
	});

	cancel.addEventListener('click', function (e) {
		searchBox.blur();
	});

	send.addEventListener('click', function (e) {
		Ti.API.warn("send clicked");
	});

	addWindow.add(searchBox);



	var timeButtonViews = Ti.UI.createView({
		top: 120,
		width: '90%',
		height: Ti.UI.SIZE
	});

	var dayButton = Ti.UI.createButton({
		title: 'Day',
		width: '30%',
		height: 44,

		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 23
		},
		code: 'day',
		left: 0
	});

	var nightButton = Ti.UI.createButton({
		title: 'Night',
		width: '30%',
		height: 44,

		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 23
		},
		code: 'night',
		center: {
			x: '50%',
			y: '50%'
		}
	});

	var eitherButton = Ti.UI.createButton({
		title: 'Either',
		width: '30%',

		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 23
		},
		height: 44,
		code: 'either',
		right: 0
	});

	timeButtonViews.add(dayButton);
	timeButtonViews.add(nightButton);
	timeButtonViews.add(eitherButton);
	var timeOfDay;
	timeButtonViews.addEventListener('click', function (e) {
		Ti.API.warn(JSON.stringify(e, null, 2));
		timeOfDay = e.source.code;
	});

	var cloudLevelView = Ti.UI.createView({
		width: '90%',
		height: Ti.UI.SIZE,
		top: 170
	});

	var cloudHeading = Ti.UI.createLabel({
		text: 'Cloud Level Allowed',
		width: '90%',
		color: '#fff',
		height: Ti.UI.SIZE,
		font: {
			fontFamily: 'Ostrich Sans',
			fontSize: 23
		},
		textAlign: 'center',
		top: 5
	});

	var cloudZero = Ti.UI.createLabel({
		text: '0%',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color: '#fff',
		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 53
		},
		textAlign: 'right',
		left: 5,
		top: 20
	});

	var cloud50 = Ti.UI.createLabel({
		text: '50%',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color: '#fff',
		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 53
		},
		textAlign: 'right',
		right: 5,
		top: 20
	});

	var cloudSlider = Ti.UI.createSlider({
		width: '100%',
		max: 1,
		min: 0.5,
		value: 0.75,
		top: 60
	});

	cloudLevelView.add(cloudHeading);
	cloudLevelView.add(cloudZero);
	cloudLevelView.add(cloud50);

	cloudLevelView.add(cloudSlider);


	var settingView = Ti.UI.createImageView({
		top: 280,
		width: 338,
		height: 130,
		// borderRadius: 12,
		// backgroundColor: 'transparent',
		image : '/images/monkey_balls.png'
	});

	var cancelButton = Ti.UI.createView({
		top: 280,
		left: 10,
		height: 130,
		title: 'CANCEL',
		backgroundColor: 'transparent',
		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 33
		},
		width: '35%'
	});

	var saveButton = Ti.UI.createView({
		right: 10,
		top: 280,
		title: 'SET ALERT',
		backgroundColor: 'transparent',

		font: {
			fontFamily: 'Ostrich Sans',
			fontWeight: 'bold',
			fontSize: 33
		},
		width: '35%',
		height: 130
	});

	cancelButton.addEventListener('click', function (e) {
		addWindow.close();
		spaceHome();
	});

	function sendAlertData(e) {

		if (searchBox.value === undefined) {
			alert('Error, missing location');
			return false;
		}

		if (cloudSlider.value === undefined) {
			alert('Error, missing cloud');
			return false;
		}

		var url = 'http://192.168.157.184:8000/add_event/' + searchBox.value + '/' + cloudSlider.value + "/" + timeOfDay + "/" + Ti.App.Properties.getString('acsUserID');
		// var url = 'http://scifilondontv.com/api/channel/list/otr';
		// alert(url);

		Ti.API.warn(url);


		var c = Ti.Network.createHTTPClient();
		c.setTimeout(25000);
		c.onload = function (e) {
			Ti.API.warn(e.response);
			Ti.API.info(JSON.stringify(e, null, 2));
			Ti.API.warn(this.status);
			Ti.API.warn(this.responseText);
			var returnData = JSON.parse(this.responseText);

			// returnData = JSON.parse(returnData);

			if (returnData === null || returnData.length < 1) {
				alert('No PASSES');
			}

			var newAlert = Ti.UI.createAlertDialog({
				title: 'T-10 Response',
				buttonNames: ['OK', 'Cancel'],
				cancel: 1,
				message: returnData.length + " Passes scheduled, \n ISS over " + returnData[0].location + " next: \n" + returnData[0].time_str
			});
			newAlert.show();
		}
		c.onerror = function (e) {
			Ti.API.error('ERROR:' + JSON.stringify(this.responseText, null, 2));
		}
		c.open('POST', url);
		c.send();


	}
	saveButton.addEventListener('click', sendAlertData);

	addWindow.add(timeButtonViews);
	addWindow.add(cloudLevelView);

	addWindow.add(settingView);
	addWindow.add(cancelButton);
	addWindow.add(saveButton);


	addWindow.open({
		animate: true
	});

}

function viewTrackedAlert(e) {
	// spaceHomeWindow.close();
	alert('You would see a list of active alerts here');

}

/**
 * The index screen of the app, should have a convenient space/earth background
 * @return {Object} Titanium Window
 */

function firstWindow() {

	var index= require('/controller/index');
	var mainWin = index.getWindow({spaceCallback: spaceHome});
	mainWin.open();
	// var thisTabgroup = tabgroup();
	// thisTabgroup.open();
}

function activatePush() {
	Ti.App.Properties.setBool('acs-init', true);
	var acs_ph = require('/lib/ACS_Push_Helper');
	var ACS = new acs_ph.ACSpush();
	var configs = require('/lib/configs');
	var log = configs.log;

	function subscribeToChannel(e) {
		log("WARN", "   subscribeToChannel() ");
		try {
			ACS.subscribeToPush({
				channel: Ti.App.Properties.getString('appmode'),
				success: function (e) {
					// alert("success, push is now setup: put your method here")
					Ti.API.warn(JSON.stringify(e, null, 2));
				},
				error: acsErrorManager
			});
		} catch (err) {
			log("ERROR", "Error subscribing to channel with ACS: " + err.name + ":" + err.message);
		}
	}

	function loginUser() {
		log("WARN", '  loginUser()  ');
		if (!ACS.createNewUser) {
			try {
				ACS.loginUserToACS({
					success: subscribeToChannel,
					error: acsErrorManager
				});
			} catch (err) {
				log("ERROR", "Error logging in user with ACS: " + err.name + ":" + err.message);
			}
		}
	};

	// probably needs renaming

	function createUser() {
		log("WARN", '  createUser()  ');

		if (ACS.createNewUser) {
			log("INFO", '  Need to create a new ACS user account: ');
			try {
				ACS.createUserAccount({
					success: loginUser,
					error: acsErrorManager
				});
			} catch (err) {
				log("error", "Error Creating new user with ACS: " + err.name + ":" + err.message);
			}
		} else {
			loginUser();
		}
	};

	function loginCallback() {
		log("WARN", '  loginCallback()  ');
		ACS.deviceToken = Ti.App.Properties.getString('deviceToken');
		/**
		 * Checks to see if the logged in state is true, after a small delay for network check,
		 * this ideally needs to be asynchronous, but the code will need refactoring for that
		 */
		if (!ACS.loggedInToACS) {
			log("WARN", '  This device is NOT Logged into ACS  ');
			log("WARN", '  About to Query ACS userbase against this device  ');
			try {
				ACS.queryNewACSuser({
					username: ACS.deviceToken,
					success: createUser,
					error: acsErrorManager
				});
			} catch (err) {
				log("error", "Error Querying new user with ACS: " + err.name + ":" + err.message);
			}
		} else {
			log("WARN", ' ********* User Logged IN true - no need to create new account ******** ');
		}
	};

	function getDeviceToken() {
		/**
		 * Performs checks to see if the device has a token and if not creates one, storing the value
		 * into persistent storage.
		 */
		try {
			ACS.getDeviceToken({
				success: loginCallback,
				error: acsErrorManager
			});
		} catch (err) {
			log("error", "Error Getting Device token: " + err.name + ":" + err.message);
		}

	};

	function acsErrorManager(evt) {
		log("ERROR", ' ********* ERROR CALLBACK ******** ');
		log("DEBUG", JSON.stringify(evt));
	}
	/**
	 * First checking to see if the user is logged into Appcelerator Cloud Services.
	 */
	try {
		ACS.login({
			success: getDeviceToken,
			error: acsErrorManager
		});
	} catch (err) {
		Ti.API.error("Error in the initial ACS login sequence: " + err.name + ":" + err.message);
	}
}

function open() {
	// setup push notification
	activatePush();
	firstWindow();


}
exports.background = background;
exports.controller = controller;
exports.open = open;