function init(params) {
	if (params.data.length === 0) {
		// noData();
		return false;
	} else {
		Ti.API.warn(params.data.length + " itmes in the next pass list to show");
		showData(params.data);
		return true;
	}

}

function _getWeatherIcon(time_of_day, cloud_cover) {
	var wIcon = "";
	switch (time_of_day) {
		case 'night':
			wIcon += 'moon';
			break;
		case 'day':
			wIcon += 'sun'
	}

	if (cloud_cover > 0.7) {
		wIcon += '_cloud';
	}

	wIcon += '.png';
	// Ti.API.warn("Weather Icon:" + wIcon);
	return wIcon;
}

function showData(data) {
	var locationManager = require('locationManager');
	// var storedCities = locationManager.getAllLocations();

	var strftimeUTC = require("dateFormat");
	var strftime = require("dateFormat");
	var len = data.length,
		i, currDate, topPointer = 0;
	for (i = 0; i < len; i++) {
		// Ti.API.warn("LOOP START - topPointer:" + topPointer);
		var passController = Widget.createController("passItem");
		var locationData = passController.getView("locationData");
		var weatherIcon = passController.getView("weatherIcon");
		var passItem = passController.getView("passItem");
		var today = new Date();
		Ti.API.warn("*********************");
		Ti.API.warn("time being used: ----- " + data[i].time);
		// Ti.API.warn("time being used: ----- " + JSON.stringify(data[i], null, 2));
		var issDateTime = parseInt(data[i].time);
		var issStartTime = new Date(issDateTime * 1000);
		var offsetStartTime = new Date(issDateTime * 1000);
		var issEndTime = new Date((issDateTime + data[i].duration) * 1000);

		
		var startDate = strftime("%d/%m/%Y", issStartTime);
		

		var startHour = strftime("%H", issStartTime);

		var startTime =  strftime("%R", issStartTime);
		var sh = issStartTime.getUTCHours();
		var startHr = (sh.length === 1)? "0"+sh:sh;
		var sm = issStartTime.getUTCMinutes();
		var startMin = (sm.length === 1)? "0"+sm:sm;
		var startTimeUTC = startHr+":"+startMin ;

		var endTime = strftime("%R", issEndTime);
		var endTimeUTC = issEndTime.getUTCHours()+":"+ issEndTime.getUTCMinutes();
		var timeZone = strftime("%z (%Z)", new Date());
		// var offsetHour = offsetStartTime.setUTCHours( offsetStartTime.getUTCHours() + data[i].tzinfo.utc_offset );

		Ti.API.warn(timeZone + " device timezone: ----- " + startTime);
		Ti.API.warn(data[i].tzinfo.timezone + " locale time: ----- " + issStartTime.getUTCHours()+":"+ issStartTime.getUTCMinutes());


		var wIcon = _getWeatherIcon((offsetStartTime.getUTCHours() > 20 || offsetStartTime.getUTCHours() < 5)?'night':'day', data[i].cloudcover);
		weatherIcon.image = '/images/weather/'+wIcon;

		if (startDate !== currDate) {
			topPointer += Alloy.CFG.nextPassListPadding;
			// Ti.API.warn("NEW HEADER - topPointer:" + topPointer);
			// create header
			var header = passController.getView("headerView");
			var headerLabel = passController.getView("headerLabel");
			header.top = topPointer;
			header.visible = true;
			header.height = 30;
			headerLabel.text = startDate;
			$.passListView.add(header);
			currDate = startDate;
			topPointer += header.height;
		}

		passItem.top = topPointer + Alloy.CFG.nextPassListPadding;

		locationData.text = data[i].location.city;
		locationData.text += " (" + data[i].location.country + ") - ";
		locationData.text += startTimeUTC + " UCT / ";
		locationData.text += endTimeUTC + " UCT " + timeZone;
		$.passListView.add(passItem);
		topPointer += (passItem.height + Alloy.CFG.nextPassListPadding);
		// Ti.API.warn("LOOP END - topPointer:" + topPointer);
	};


};

function noData() {
	// check cities list - if existing, this function should not trigger
	Ti.API.warn(" ** -- we will show an alternative view:  no data to show");
}
exports.init = init