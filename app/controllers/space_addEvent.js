/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */
function open(){
	$.spaceAddEvent.open();
	$.spaceAddEvent.addEventListener("swipe", function(e){
		Ti.API.info(JSON.stringify(e, null, 2));

		if(e.direction === "right" && e.source.id === "spaceAddEvent" && e.y < 50){
			spaceWin = Alloy.createController('space');
			setTimeout(function(){
				spaceWin.open();
				$.spaceAddEvent.close();
			},50);	
		}
	});
	if($.day.selected) {
		$.day.backgroundImage = '/images/timeButtonSelected.png';
	}

	if($.night.selected) {
		$.night.backgroundImage = '/images/timeButtonSelected.png';
	}

	if($.either.selected) {
		$.either.backgroundImage = '/images/timeButtonSelected.png';
	}


}

function setTimeOfDay(e){
	// Ti.API.warn(JSON.stringify(e,null,2));
	Ti.API.warn("Setting Time of day for lookup to: " + e.source.id);
	$.buttonView.timeOfDay = e.source.id;
	var tbg = '/images/timeButtons.png'
	$.day.backgroundImage = tbg;
	$.night.backgroundImage = tbg;
	$.either.backgroundImage = tbg;

	switch(e.source.id){
		case 'day':
			$.day.backgroundImage = '/images/timeButtonSelected.png';
		break;

		case 'night':
			$.night.backgroundImage = '/images/timeButtonSelected.png';
		break;

		case 'either':
			$.either.backgroundImage = '/images/timeButtonSelected.png';
		break;

	}


};
function sendAlertData(e) {
	var that = this;
	
		function errorCheck(){
			
		}

		Ti.API.warn(JSON.stringify($.cityTextField,["value"],2));

		if (!$.cityTextField.value) {
			alert('Error, missing location');
			return false;
		}

		Ti.API.warn(JSON.stringify($.cloudSlider,null,2));
		if ($.cloudSlider.value === undefined) {
			alert('Error, missing cloud');
			return false;
		}

		var url = 'http://192.168.3.18:8000/add_event/' + $.cityTextField.value + '/' + $.cloudSlider.value + "/" + $.buttonView.timeOfDay + "/" + Ti.App.Properties.getString('acsUserID');
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

			if (returnData.length === 0) {
				alert('No PASSES scheduled');
				return;
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



exports.open = open;