function open(){
	var prefs = require("tiprefs");
	var section = {
		color: '#fff'
	}
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

	prefs.addSection({
		title: "Simulated Notifications"
	});

	prefs.addTextInput({
		id: "SIM_MIN_COUNTDOWN",
		caption: "Time (mins) for manually triggered countdown",
		value: 10
	});



	prefs.addSection({
		title: "Simulated Alarm Notifications"
	});
	prefs.addTextInput({
		id: "SIM_ALARM_TRIGGER",
		caption: "Simulated Time to trigger an automatic notifications (min)",
		value: '2'
	});

	prefs.addTextInput({
		id: "SIM_ALARM_CITY",
		caption: "City Name",
		value: 'London'
	});

	prefs.addTextInput({
		id: "SIM_ALARM_COUNTRY",
		caption: "Country Code (2 Letter)",
		value: 'GB'
	});

	prefs.addTextInput({
		id: "SIM_ALARM_CLOUD",
		caption: "Visibility (% cloud cover)",
		value: '50'
	});
	prefs.closeSection();

	prefs.open();
}

exports.open = open;