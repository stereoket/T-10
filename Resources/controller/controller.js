var UI = require('/lib/UIhelper');
var colours = require('/lib/configs').colours();

function controller() {

};

function background() {


}

function tabgroup() {
	// this sets the background color of the master UIView (when there are no windows/tab groups on it)
	Titanium.UI.setBackgroundColor('#000');

	// create tab group
	var tabGroup = Titanium.UI.createTabGroup();


	//
	// create base UI tab and root window
	//
	var win1 = UI.createWindow({
		title: 'Tab 1',
		backgroundColor: '#fff'
	});
	var tab1 = Titanium.UI.createTab({
		icon: 'KS_nav_views.png',
		title: 'Tab 1',
		window: win1
	});

	var label1 = Titanium.UI.createLabel({
		color: '#999',
		text: 'I am Window 1',
		font: {
			fontSize: 20,
			fontFamily: 'Helvetica Neue'
		},
		textAlign: 'center',
		width: 'auto'
	});

	win1.add(label1);

	//
	// create controls tab and root window
	//
	var win2 = Titanium.UI.createWindow({
		title: 'Tab 2',
		backgroundColor: '#fff'
	});
	var tab2 = Titanium.UI.createTab({
		icon: 'KS_nav_ui.png',
		title: 'Tab 2',
		window: win2
	});

	var label2 = Titanium.UI.createLabel({
		color: '#999',
		text: 'I am Window 2',
		font: {
			fontSize: 20,
			fontFamily: 'Helvetica Neue'
		},
		textAlign: 'center',
		width: 'auto'
	});

	win2.add(label2);



	//
	//  add tabs
	//
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);


	// open tab group
	return tabGroup

};


function spaceHome() {
	var spaceHomeWindow = Ti.UI.createWindow({
		title: 'Space Home',
		backgroundColor: colours.mainBg
	});

	var buttonLayer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		top: 0,
		zIndex: 2
	});

	var addNewButton = Ti.UI.createView({
		width: '80%',
		top: 100,
		height: 88,
		backgroundColor: colours.earthButton,
		borderRadius: 12
	});

	var addNewLabel = Ti.UI.createLabel({
		text: 'ADD',
		color: '#000'
	});

	addNewButton.add(addNewLabel);
	var trackedButton = Ti.UI.createView({
		width: '80%',
		bottom: 100,
		height: 88,
		backgroundColor: colours.spaceButton,
		borderRadius: 12
	});

	var trackedLabel = Ti.UI.createLabel({
		text: 'TRACKED',
		color: '#000'
	});

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
		backgroundColor: colours.mainBg
	});

	var topTitle = Ti.UI.createLabel({
		text: 'Location you want to Photograph',
		width: '90%',
		height: Ti.UI.SIZE,
		font: {
			fontSize: 16
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
		hintText: 'Focus to see keyboard with toolbar',
		keyboardToolbar: [cancel, flexSpace, flexSpace, flexSpace, send],
		keyboardToolbarColor: '#999',
		keyboardToolbarHeight: 40,
		top: 60,
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
		left: 0
	});

	var nightButton = Ti.UI.createButton({
		title: 'Night',
		width: '30%',
		height: 44,
		center: {x: '50%', y: '50%'}
	});

	var eitherButton = Ti.UI.createButton({
		title: 'Either',
		width: '30%',
		height: 44,
		right: 0
	});

	timeButtonViews.add(dayButton);
	timeButtonViews.add(nightButton);
	timeButtonViews.add(eitherButton);
	

	var cloudLevelView = Ti.UI.createView({
		width: '90%',
		height: Ti.UI.SIZE,
		top: 170
	});

	var cloudHeading = Ti.UI.createLabel({
		text: 'Cloud Level Allowed',
		width: '90%',
		height: Ti.UI.SIZE,
		font: {
			fontSize: 16
		},
		textAlign: 'center',
		top: 5
	});

	var cloudZero = Ti.UI.createLabel({
		text: '0%',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		font: {
			fontSize: 32,
			fontWeight: 'bold'
		},
		textAlign: 'right',
		left: 5,
		top: 20
	});

	var cloud50 = Ti.UI.createLabel({
		text: '50%',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		font: {
			fontSize: 32,
			fontWeight: 'bold'
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


	var settingView = Ti.UI.createView({
		top: 280,
		left: 10,
		bottom: 10,
		width: '45%',
		borderRadius: 12,
		backgroundColor: colours.highlight
	});

	var cancelButton = Ti.UI.createButton({
		right: 10,
		bottom: 70,
		title: 'CANCEL',
		width: '45%',
		height: 55
	});

	var saveButton = Ti.UI.createButton({
		right: 10,
		bottom: 10,
		title: 'SET ALERT',
		width: '45%',
		height: 55
	});

	cancelButton.addEventListener('click', function(e){
		addWindow.close();
		spaceHome();
	})

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
	spaceHomeWindow.close();
	alert('A new Window');

}

/**
 * The opening screen of the app, should have a convenient space/earth background
 * @return {[type]} [description]
 */

function firstWindow() {

	var colours = require('/lib/configs').colours();
	// Load Inital screen offering here:

	var mainWin = Ti.UI.createWindow({
		title: 'T-10',
		backgroundColor: colours.mainBg
	});

	var titleLayer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		top: 0
	})
	var mainTitle = Ti.UI.createLabel({
		text: 'T-10',
		font: {
			fontSize: 84,
			fontWeight: 'bold'
		},
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		center: {
			x: '50%',
			y: '50%'
		},
		// backgroundColor: 'red'
	});

	var questionLabel = Ti.UI.createLabel({
		text: 'Where are you ?',
		font: {
			fontSize: 20,
			fontWeight: 'normal'
		},
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		center: {
			x: '50%',
			y: '65%'
		},
	});
	var buttonLayer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		top: 0,
		zIndex: 2
	});

	var earthButton = Ti.UI.createView({
		width: '80%',
		top: 30,
		height: 44,
		backgroundColor: colours.earthButton,
		borderRadius: 12
	});

	var earthLabel = Ti.UI.createLabel({
		text: 'EARTH',
		color: '#000'
	});

	earthButton.add(earthLabel);
	var spaceButton = Ti.UI.createView({
		width: '80%',
		bottom: 30,
		height: 44,
		backgroundColor: colours.spaceButton,
		borderRadius: 12
	});

	var spaceLabel = Ti.UI.createLabel({
		text: 'SPACE',
		color: '#000'
	});

	spaceButton.add(spaceLabel);

	titleLayer.add(mainTitle);
	titleLayer.add(questionLabel);

	buttonLayer.add(earthButton);
	buttonLayer.add(spaceButton);

	mainWin.add(titleLayer);
	mainWin.add(buttonLayer);


	// Setup Event Listeners on each button
	// 
	// 

	earthButton.addEventListener('click', function (e) {
		Ti.App.Properties.setString('appmode', 'earth');
		var alertDialog = Ti.UI.createAlertDialog({
			title: 'Earth Utility',
			message: 'The Earth utiity section will be created soon',
			buttonNames: ['OK']
		}).show();
	});


	spaceButton.addEventListener('click', function (e) {
		Ti.App.Properties.setString('appmode', 'space');
		// var appTabgroup = tabgroup();
		spaceHome();
	});

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
					alert("success, push is now setup: put your method here")
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