/**
 * Tracked Locations section opening controller file
 */

var Helper = require('Helper');
var log = Helper.log;


/**
 * Open the tracked locations window
 * @return {[type]} [description]
 */

function open() {
	$.trackedLocations.addEventListener('blur', function (e) {
		Ti.API.warn("trackedLocations window closed");
		if (!Ti.App.Properties.getBool('settingsFlag')) {
			$.trackedLocations.close();
		}
	});

	$.trackedLocations.open();

}

/**
 * [close description]
 * @return {[type]} [description]
 */
function close() {
	Ti.API.info("Closing window");
	$.trackedLocations.close();

}

/**
 * [addLocation description]
 * @param {[type]} e [description]
 */
function addLocation(e) {
	var addEvent = Alloy.createController("space_addEvent");
	addEvent.open();
	// Ti.API.warn("SAVE LOCATION CHANGES");
}

/**
 * [home description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function home(e) {
	var nextPasses = Alloy.createController("next_passes");
	nextPasses.open();
}

/**
 * [editLocation description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function editLocation(e) {
	Ti.API.warn("editLocation click");
	if ($.editLocations.action === "edit") {
		$.editLocations.backgroundImage = "none";
		$.editLocations.title = "Done";
		$.editLocations.action = "done"
		actionDeleteButtons(1);
	} else {
		$.editLocations.backgroundImage = "/images/blueBg.png";
		$.editLocations.title = "Edit";
		$.editLocations.action = "edit"
		actionDeleteButtons(0);
	}
}



/**
 * Will show or hide all of the delete button options in the list view
 * @param  {number} state 0 or 1 for disable or enable
 * @return {void}
 */
function actionDeleteButtons(state) {
	Ti.API.warn('actionDeleteButtons(' + state + ')');
	var i, l = $.locationsList.children[0].children.length;
	for (i = l - 1; i >= 0; i--) {
		$.locationsList.children[0].children[i].children[2].visible = (state)?true:false;
		$.locationsList.children[0].children[i].children[3].visible = (state)?true:false;
		// $.locationsListView.children[i].children[3].visible = true; 
	};
}

exports.open = open;
exports.close = close;