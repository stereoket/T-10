// stores each row in the settings view
var rows;

// the name of the settings
var name;

// the shared nav for opening subviews
var nav;

// helper function to build a new row
// takes .label and .value controls e.g. Ti.UI.Label and Ti.UI.TextField
function addRow(controls) {

	row = Ti.UI.createTableViewRow({
		height : 40
	});

	// position the label
	controls.label.top = 7;
	controls.label.left = 7;

	// position the value
	controls.value.right = 10;
	controls.value.top = 6;

	// if icon specfied, let's place that,
	// adjust the label to fit.
	if (controls.icon) {
		image = Ti.UI.createImageView({
			image : controls.icon,
			width : 26,
			height : 26,
			top : 6
		});

		image.left = 6;
		controls.label.left = 40;
		row.add(image);
	}

	// add the label and value
	// control to the row
	row.add(controls.label);
	row.add(controls.value);

	if (controls.section === undefined) {
		// push the row to the array
		rows.push(row);
		// return the row object
		return row;
	} else if (controls.section) {
		// add the row to the section
		section.add(row);
		// return the section object
		return row;
	}
}

// creates a default label for a row
function createLabel(caption) {
	var label = Ti.UI.createLabel({
		font : {
			fontSize : 17,
			fontWeight : 'bold'
		},
		text : caption
	});

	return label;
}

exports.getBool = function(name, property) {
	Ti.App.Properties.getBool(name + "_" + property);
}

exports.getString = function(name, property) {
	Ti.App.Properties.getString(name + "_" + property);
}
// initialise a new settings panel
exports.init = function(title) {
	sections = [];
	section = null;
	rows = [];
	name = title || "Settings";
}
// add a textinput
exports.addTextInput = function(opts) {

	var label = createLabel(opts.caption);

	var value = Ti.UI.createLabel({
		font : {
			fontSize : 17,
			fontWeight : 'normal'

		},
		text : Ti.App.Properties.getString(name + "_" + opts.id || opts.name) || opts.value,
		color : '#777'
	});

	row = addRow({
		label : label,
		value : value,
		section: true
	});

	row.addEventListener("click", function(e) {

		var rows = [];

		var editWin = Ti.UI.createWindow({
			title : 'Edit',
			Hidden : false,
			backgroundColor : '#fff'
		});

		var table = Ti.UI.createTableView({
			style : Ti.UI.iPhone.TableViewStyle.GROUPED
		});

		var row = Ti.UI.createTableViewRow({
			height : 50
		});

		var text = Ti.UI.createTextField({
			left : 10,
			right : 10,
			value : value.text
		});

		var cancel = Ti.UI.createButton({
			title : 'Cancel',
			width : 50,
			height : 30
		});

		var save = Ti.UI.createButton({
			title : 'Save',
			width : 50,
			height : 30
		});

		row.add(text);

		rows.push(row);

		table.setData(rows);

		if (Titanium.Platform.osname != 'android') {
			editWin.setLeftNavButton(cancel);
			editWin.setRightNavButton(save);
		}

		editWin.add(table);

		cancel.addEventListener('click', function() {

			nav.close(editWin);
		});

		save.addEventListener('click', function() {
			// save the value
			value.text = text.value;
			Ti.App.Properties.setString(name + "_" + (opts.id || opts.caption), text.value);
			nav.close(editWin);
		});

		if (Titanium.Platform.osname == 'android') {
			editWin.addEventListener('android:back', function(e) {
				value.text = text.value;
				Ti.App.Properties.setString(name + "_" + (opts.id || opts.caption), text.value);
				editWin.close();
			});
		}

		if (nav) {
			nav.open(editWin);
		} else {
			editWin.open({
				modal : true
			});
		}
	});
}
exports.addChoice = function(opts) {

	var label = createLabel(opts.caption);

	var value = Ti.UI.createLabel({
		font : {
			fontSize : 17,
			fontWeight : 'normal'

		},
		text : Ti.App.Properties.getString(name + "_" + opts.id || opts.name) || opts.value,
		color : '#777'
	});

	row = addRow({
		label : label,
		value : value,
		section: true
	});

	row.hasChild = true;

	row.addEventListener("click", function(e) {

		var rows = [];

		var editWin = Ti.UI.createWindow({
			title : 'select',
			Hidden : false,
			backgroundColor : '#fff'
		});

		var table = Ti.UI.createTableView({
			style : Ti.UI.iPhone.TableViewStyle.GROUPED
		});

		for ( i = 0; i < opts.choices.length; i++) {
			var row = Ti.UI.createTableViewRow({
				height : 40
			});

			var text = Ti.UI.createLabel({
				left : 10,
				right : 10,
				text : opts.choices[i].title,
				font : {
					fontSize : 17,
					fontWeight : 'bold'

				}
			});

			row.value = opts.choices[i].value;

			row.hasCheck = Ti.App.Properties.getBool(name + "_" + (opts.id || opts.caption) + "_" + row.value) || false

			row.add(text);

			rows.push(row);

		}

		table.setData(rows);

		table.addEventListener('click', function(e) {
			e.row.hasCheck = !e.row.hasCheck;

			if (Titanium.Platform.osname == 'android') {
				Ti.App.Properties.setBool(name + "_" + (opts.id || opts.caption) + "_" + e.row.value, e.row.hasCheck)
			}

		});

		var cancel = Ti.UI.createButton({
			title : 'Cancel',
			width : 50,
			height : 30
		});

		var save = Ti.UI.createButton({
			title : 'Save',
			width : 50,
			height : 30
		});

		if (Titanium.Platform.osname != 'android') {
			editWin.setLeftNavButton(cancel);
			editWin.setRightNavButton(save);
		}

		editWin.add(table);

		cancel.addEventListener('click', function() {

			nav.close(editWin);
		});

		save.addEventListener('click', function() {

			if (Titanium.Platform.osname != 'android') {
				for ( i = 0; i < table.data[0].rows.length; i++) {
					Ti.App.Properties.setBool(name + "_" + (opts.id || opts.caption) + "_" + table.data[0].rows[i].value, table.data[0].rows[i].hasCheck)
				}
			}
			nav.close(editWin);
		});

		if (nav) {
			nav.open(editWin);
		} else {
			editWin.open({
				modal : true
			});
		}

	});
}
// add a switch row
exports.addSwitch = function(opts) {

	var label = Ti.UI.createLabel({
		font : {
			fontSize : 17,
			fontWeight : 'bold'
		},
		text : opts.caption
	});

	var toggle = Ti.UI.createSwitch({
		value : Ti.App.Properties.getBool(name + "_" + opts.id, false)
	});

	toggle.addEventListener("change", function(e) {
		Ti.App.Properties.setBool(name + "_" + opts.id , e.value);

		if (opts.onChange) {
			opts.onChange(toggle.value);
		};
	});

	addRow({
		label : label,
		value : toggle,
		section: true
	});
}

exports.addSection = function (opts) {
	// add the section into the array as long as data exists in the current section
	if (section !== null) {
		sections.push(section);
	}
	var title = (opts !== undefined && opts.title !== undefined)?opts.title:"Section " + (sections.length + 1);
	section = Ti.UI.createTableViewSection({
		headerTitle: title
	});

	return section;
}

exports.closeSection = function(){
	sections.push(section);
}
// open the prefs window
exports.open = function(tabGroup) {

	// create a window
	var prefsWin = Ti.UI.createWindow({
		title : name
	});

	// create a table
	var table = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED
	});

	// push the rows
	// table.data = rows;
	table.data = sections;
	// add it to the specified window
	prefsWin.add(table);

	// if we have a tabGroup specified
	if (!tabGroup) {

		if (Titanium.Platform.osname == 'android') {
			prefsWin.backgroundColor = '#FFF';
			prefsWin.open({
				modal : true
			});

		} else {

			// we need a nav
			nav = Ti.UI.iPhone.createNavigationGroup({
				window : prefsWin
			});

			// create a host window
			var rootWin = Ti.UI.createWindow();

			// add close button to navbar 
			var closeButton = Ti.UI.createButton({
				title: 'Close',
				width: 50,
				height: 30
			});
			prefsWin.setLeftNavButton(closeButton);

			closeButton.addEventListener("click", function () {
				nav.close(prefsWin);
				rootWin.remove(nav);
				rootWin.close();
				prefsWin.close();
				rootWin = null;
				prefsWin = null;
			});

			// add the navbar
			rootWin.add(nav);

			// open it
			rootWin.open();
		}
	} else {

		nav = tabGroup.activeTab;
		nav.open(prefsWin);
	}
}