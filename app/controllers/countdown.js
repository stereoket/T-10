function niceTimeFromMilliseconds(ms) {
	var total_seconds = ms / 1000,
		minutes = Math.floor(total_seconds / 60),
		seconds = total_seconds - (minutes * 60) - 0.499;
		var col;
		if(total_seconds < 121){
			col = 'reds/';
		} else {
			col = 'blacks/';
		}
		
		var path = "/images/countdown/" + col;
	//499miliseconds subtracted before rounding up in the interest of accuracy

	function splitTime(secs, fmt){
		var secString = secs.toString();

		if(fmt === 'sec'){
			$.sec1.image = path + secString.substring(0,1) + ".png";
			$.sec2.image = path + secString.substring(1,2) + ".png";
		} else {
			$.min1.image = path + secString.substring(0,1) + ".png";
			$.min2.image = path + secString.substring(1,2) + ".png";
		}

		
	}

	if (minutes < 10 && seconds < 9) {
		$.min1.image = path + "0.png";
		$.min2.image = path + minutes.toString() +".png";
		$.sec1.image = path + "0.png";
		$.sec2.image = path + Math.round(seconds).toString() + ".png";
		return;
		// return "0" + minutes + ":" + "0" + Math.round(seconds);
	}
	if (minutes < 10 && seconds > 9) {
		$.min1.image = path + "0.png";
		$.min2.image = path + minutes.toString() +".png";
		splitTime(Math.round(seconds), "sec");
		return;
		// return "0" + minutes + ":" + Math.round(seconds);
	}
	if (seconds < 9) {
		splitTime(minutes, "min");
		$.sec1.image = path + "0.png";
		$.sec2.image = path + Math.round(seconds).toString() + ".png";
		return;
		// return minutes + ":" + "0" + Math.round(seconds);
	}
	splitTime(minutes, "min");
	splitTime(Math.round(seconds), "sec");
	return;
	// return minutes + ":" + Math.round(seconds);
}


function open(params) {
	var mainTimer;
	$.countdown.addEventListener('blur', function(e){
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

	$.winTitle.text= params.city + " in T-10";
	// read the starttime of the passover
	var starttime = params.starttime;
	var startTimeStamp = new Date(starttime).getTime();
	Ti.API.info(startTimeStamp);
	// get the current timestamp
	var nowtime = new Date().getTime() / 1000;
	Ti.API.info(nowtime);
	// subtract difference of the two
	// 
	var timeDifference = startTimeStamp - nowtime;
	// var timeDifference = (nowtime + (60 * 5)) - nowtime;
	Ti.API.info(timeDifference + " in secs");
	Ti.API.info(timeDifference / 60 + " in mins");
	// convert the result value to minutes & seconds
	// var tenMin = 60 * 10;

	var startCounter = timeDifference;
	Ti.API.info(startCounter);
	// run a counter with this value as the starting point that decrements
	var niceStartCounter = niceTimeFromMilliseconds(startCounter * 1000);
	Ti.API.info(niceStartCounter);
	var intTimer;
	mainTimer = setInterval(function(){
		intTimer++;
		startCounter--;
		// $.countdownValue.text = niceStartCounter;
		 niceStartCounter = niceTimeFromMilliseconds((startCounter) * 1000);
		 // Ti.API.info(startCounter);
		
		 if(startCounter === 0){
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