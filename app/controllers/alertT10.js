/**
 * Add Event/Space section opening controller file
 */

var Helper = require('Helper');
var log = Helper.log;
var sim = false;

/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */

function open(params) {
	$.alertT10.addEventListener('blur', function (e) {
		Ti.API.warn("alertT10 window closed");
		clearInterval(bgFlash);
		if (!Ti.App.Properties.getBool('settingsFlag')) {
			$.alertT10.close();
		}
	});
	sim = params.simulation || false;
	$.winTitle.text = params.city + " in T-10";
	$.alertT10.open();
	$.alertT10.city = params.city;
	$.alertT10.starttime = params.starttime;
	var bgStateOn = false;
	// animate alert flashing screen

	function animateBackground() {
		bgStateOn = !bgStateOn;
		switch (bgStateOn) {
		case true:
			$.alertT10.backgroundImage = "/images/blueiPadBg.png";
			break;

		case false:
			$.alertT10.backgroundImage = "/images/rediPadBg.png";
			break
		}
	}
	var bgFlash = setInterval(animateBackground, 750);
}

/**
 * [triggerCountdown description]
 * @return {[type]} [description]
 */
function triggerCountdown() {
	log("WARN", "Add Event Clicked");
	if(sim){
		log("WARN", "Simulated Time");
		var nowtime = new Date().getTime() / 1000;
		var alertTime = (nowtime + (60 * 10));
	} else {
		log("WARN", "REAL Time setting");
		alertTime = $.alertT10.starttime;
	}
	var countdown = Alloy.createController('countdown');
	countdown.open({
		city: $.alertT10.city,
		starttime: alertTime,
		simulation: sim?true:false
	});
	// $.space.close();
}

function ignore() {
	var nextPasses = Alloy.createController('next_passes');
	nextPasses.open();
	$.alertT10.close();
}

exports.open = open;