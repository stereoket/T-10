var min1, min2, sec1, sec2;

function niceTimeFromMilliseconds(ms) {
	var total_seconds = ms / 1000,
		minutes = Math.floor(total_seconds / 60),
		seconds = total_seconds - (minutes * 60) - 0.499;

	var col;
	Ti.API.info(minutes);
	Ti.API.info(seconds);
	if (total_seconds < 121 || minutes === 10) {
		col = 'reds/';
	} else {
		col = 'blacks/';
	}

	var path = "/images/countdown/" + col;
	//499miliseconds subtracted before rounding up in the interest of accuracy

	function splitTimeDigit(doubleDigit) {
		var digitStr = doubleDigit.toString();
		var digit1 = digitStr.substr(0, 1) + ".png";
		var digit2 = digitStr.substr(1, 2) + ".png";
		return [digit1, digit2];
	}

	if (minutes === 10) {
		var mins = splitTimeDigit(Math.round(minutes));
		min1 = path + "1.png";
		min2 = path + "0.png";
		sec1 = path + "0.png";
		sec2 = path + "0.png";
		Ti.API.info(min1 + " - " + min2 + " - " + sec1 + " - " + sec2 );
	}
	if (minutes < 10 && seconds < 9) {
		min1 = path + "0.png";
		min2 = path + Math.round(minutes).toString() + ".png";
		sec1 = path + "0.png";
		sec2 = path + Math.round(seconds).toString() + ".png";
		Ti.API.info(min1 + " - " + min2 + " - " + sec1 + " - " + sec2 );
		// return "0" + minutes + ":" + "0" + Math.round(seconds);
	}
	if (minutes < 10 && seconds > 9) {
		min1 = path + "0.png";
		min2 = path + minutes + ".png";
		var sec = splitTimeDigit(Math.round(seconds));
		sec1 = path + sec[0];
		sec2 = path + sec[1];
		Ti.API.info(min1 + " - " + min2 + " - " + sec1 + " - " + sec2 );
		// return "0" + minutes + ":" + Math.round(seconds);
	}
	if (seconds < 9 && minutes !== 10) {
		var min = splitTimeDigit(Math.round(minutes));
		min1 = path + "0.png";
		min2 = path + Math.round(minutes).toString() + ".png";
		sec1 = path + "0.png";
		sec2 = path + Math.round(seconds).toString() + ".png";
		Ti.API.info(min1 + " - " + min2 + " - " + sec1 + " - " + sec2 );
		// return minutes + ":" + "0" + Math.round(seconds);
	}

	// Ti.API.info(min1 + " " + min2 + " " + sec1 + " " + sec2);
	$.min1.image = min1;
	$.min2.image = min2;
	$.sec1.image = sec1;
	$.sec2.image = sec2;
	return;
	// return minutes + ":" + Math.round(seconds);
}


function open(params) {
	var mainTimer;
	Ti.API.warn(JSON.stringify(params, null, 2));
	$.countdown.addEventListener('blur', function (e) {
		Ti.API.warn("countdown window closed");
		clearInterval(mainTimer);
		$.countdown.close();
	});

	$.countdown.addEventListener("swipe", function (e) {
		// Ti.API.info(JSON.stringify(e, null, 2));
		if (e.direction === "right" && e.source.id === "countdown" && e.y < 90) {
			var nextPasses = Alloy.createController('next_passes');
			setTimeout(function () {
				nextPasses.open();
				$.countdown.close();
			}, 50);
		}
	});

	$.countdown.open();

	$.winTitle.text = params.city + " in T-10";

	// Starttimestamp provided from the alert
	var starttime = params.starttime;
	var startTimeStamp = new Date(starttime).getTime()/1000;
	var nowtime = new Date().getTime() / 1000;
	var tenMin = 60 * 10;
	if(!params.simulation){
		var timeDifference = startTimeStamp - nowtime;
		var startCounter = timeDifference;
	} else {
		startCounter = (nowtime + (60 * Number(Ti.App.Properties.getString('Settings_SIM_MIN_COUNTDOWN', "10")))) - nowtime;
	}
	
	Ti.API.info(startCounter + " in secs");
	Ti.API.info(startCounter / 60 + " in mins");
	

	var niceStartCounter = niceTimeFromMilliseconds(startCounter * 1000);

	Ti.API.info(niceStartCounter);
	var intTimer;
	mainTimer = setInterval(function () {
		intTimer++;
		startCounter--;
		// $.countdownValue.text = niceStartCounter;
		niceStartCounter = niceTimeFromMilliseconds(startCounter * 1000);
		Ti.API.info(startCounter);

		if (startCounter === 0) {
			alert("countdown complete, snap away");
			clearInterval(mainTimer);
			Ti.API.info('SOUND EFFECT?');
			return;
		}
		// check for people in the wave every 30 seconds or every minute.
		// 

	}, 1000);

}

exports.open = open;