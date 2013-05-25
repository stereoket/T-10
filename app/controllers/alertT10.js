/**
 * Add Event/Space section opening controller file
 */

var Helper = require('Helper');
var log = Helper.log;


/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */
function open(params){
	$.alertT10.addEventListener('blur', function(e){
		Ti.API.warn("alertT10 window closed");
		clearInterval(bgFlash);
		$.alertT10.close();
	});

	$.winTitle.text = params.city + " in T-10";
	$.alertT10.open();
	$.alertT10.city = params.city;
	$.alertT10.starttime = params.starttime;
	var bgStateOn = false;
	// animate alert flashing screen
	function animateBackground(){
		bgStateOn = !bgStateOn;
		switch (bgStateOn){
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

function triggerCountdown(){
	log("WARN", "Add Event Clicked");
	var countdown = Alloy.createController('countdown');
	countdown.open({city: $.alertT10.city, starttime: $.alertT10.starttime});
	// $.space.close();
}

function ignore(){
	var nextPasses = Alloy.createController('next_passes');
	nextPasses.open();
	$.alertT10.close();
}

exports.open = open;