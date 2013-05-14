function open(){
	var prefs = require("tiprefs");

	// open the view

	prefs.init("Settings");

	prefs.addSection({
		title: "T-10 App Settings"
	});

	prefs.addSwitch({
		id: "ALARM",
		caption: "Alarm"
	});

	prefs.addSwitch({
		id: "HIDE_ALERTS",
		caption: "Push Alerts"
	});

	prefs.addTextInput({
		id: "USERNAMEdsfsd",
		caption: "username",
		value: "Anonymous"
	});

	prefs.addChoice({
		id: "DAY_OF_WEEK",
		caption: "Day of Week",
		choices: [{
			title: 'Every Monday',
			value: 1
		}, {
			title: 'Every Tuesday',
			value: 2
		}, {
			title: 'Every Wednesday',
			value: 3
		}, {
			title: 'Every Thursday',
			value: 4
		}, {
			title: 'Every Friday',
			value: 5
		}, {
			title: 'Every Saturday',
			value: 6
		}, {
			title: 'Every Sunday',
			value: 7
		}]
	});

	prefs.addSection({
		title: "T10 Accounts"
	});

	prefs.addTextInput({
		id: "USERNAME",
		caption: "username",
		value: "Anonymous"
	});

	prefs.addSection({
		title: "API (advanced only)"
	});

	prefs.addTextInput({
		id: "API_DOMAIN",
		caption: "API Domain",
		value: "localhost"
	});

	prefs.addTextInput({
		id: "API_PORT",
		caption: "API Server Port",
		value: "8000"
	});

	prefs.addSection();

	prefs.addTextInput({
		id: "USERNAME2",
		caption: "username2",
		value: "test1"
	});

	prefs.addTextInput({
		id: "USERNAME23",
		caption: "username3",
		value: "test1"
	});

	prefs.closeSection();

	prefs.open();
}

exports.open = open;