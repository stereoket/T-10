var locationManager = require('locationManager');
var dataArray = [];


function showData() {
	Ti.API.info("showData() ");
	var cities = locationManager.getAllLocations();
	// Ti.API.warn(data);
	var i, currDate, topPointer = 0;
	for (i = 0; i < cities.count; i++) {
		// dataArray.push({});
		// Ti.API.warn("LOOP START - topPointer:" + topPointer);
		var listController = Widget.createController("listItem");
		var listItem = listController.getView("listItem");
		var locationData = listController.getView("locationData");
		var weatherIcon = listController.getView("todIcon");

		listItem.top = topPointer + Alloy.CFG.locationsListPadding;
		locationData.index = i;
		locationData.location = cities.data[i].location;
		locationData.time_of_day = cities.data[i].alertParams.time_of_day;
		locationData.max_cloud_cover = cities.data[i].alertParams.max_cloud_cover;
		locationData.text = cities.data[i].location.city;
		locationData.text += " (" + cities.data[i].location.country + ") ";

		weatherIcon.image = "/images/weather/tod-" + cities.data[i].alertParams.time_of_day + '.png'


		$.locationsListView.add(listItem);
		topPointer += (listItem.height + Alloy.CFG.locationsListPadding);

		var deleteBtn = listController.getView("deleteBtn");
		deleteBtn.location = cities.data[i].location;
		deleteBtn.addEventListener('click', deleteCity);

		var notifyBtn = listController.getView("notifyBtn");
		notifyBtn.location = cities.data[i].location;
		notifyBtn.addEventListener('click', notifyAstro);


		// Ti.API.warn("LOOP END - topPointer:" + topPointer);
	}
	// var editBtn = listController.getView("editBtn");
}

function enableDeleteButtons() {
	Ti.API.warn('delet buttons list -numbers');
	// var locListView = Alloy.createController('tracked_locations').getView("locationsList");
	Ti.API.info($.locationsListView.children.length);
	var i, l = $.locationsListView.children.length;
	for (i = l - 1; i >= 0; i--) {
		$.locationsListView.children[i].children[2].visible = true;
		// $.locationsListView.children[i].children[3].visible = true; 
	};

}

function deleteCity(e) {
	Ti.API.warn('delete City');
	Ti.API.warn(JSON.stringify(e.source, null, 2));
	locationManager.deleteCity(e.source);
	removeAllListViews();
	showData();
}

/**
 * [notifyAstro description]
 * @return {[type]} [description]
 */
function notifyAstro(e){
	Ti.API.warn('City Notification');
	var alertT10 = Alloy.createController('alertT10');
	alertT10.open({city: e.source.location.city, simulation: true});
	
}

function removeAllListViews() {
	var len = $.locationsListView.children.length;
	for (var i = len - 1; i >= 0; i--) {
		$.locationsListView.remove($.locationsListView.children[i]);
	};
}

function editLocation(e) {
	if (e.source.parent.children[1] === undefined) {
		Ti.API.warn('not the row, ignore');
		return;
	}

	if (e.direction === "right") {
		e.source.parent.children[2].visible = false; // delete
		// e.source.parent.children[3].visible = false; // delete
		return;
	}

	var listController = Widget.createController("listItem");
	var notifyBtn = listController.getView("notifyBtn");
	var deleteBtn = listController.getView("deleteBtn");
	notifyBtn.show();
	deleteBtn.show();
	var rowData = e.source;
	// Ti.API.info(e.source.parent.children[0].id);
	// Ti.API.info(e.source.parent.children[1].id);
	// Ti.API.info(e.source.parent.children[2].id);
	// Ti.API.info(e.source.parent.children[3].id);
	// dataArray[e.source.index] = e.source;
	e.source.parent.children[2].visible = true; // delete
	e.source.parent.children[2].data = e.source.parent.children[1]; // delete
	e.source.parent.children[2].index = e.source.parent.children[1].index; // delete
	// e.source.parent.children[3].visible = true; // delete
	// e.source.parent.children[3].data = e.source.parent.children[1]; // delete
	// e.source.parent.children[3].index = e.source.parent.children[1].index; // delete

	e.source.parent.children[2].addEventListener('click', editCity);
	e.source.parent.children[3].addEventListener('click', deleteCity);

	function editCity(e) {
		Ti.API.warn('Editing City');
		Ti.API.warn(JSON.stringify(e.source.parent.parent.parent.parent, ["id"], 2));
		Ti.API.warn(JSON.stringify(e.source.data, null, 2));

		// e.source.parent.parent.parent.parent.close();

		var editActiveLocation = Alloy.createController("space_editEvent");
		editActiveLocation.setEditData(e.source.data);
		editActiveLocation.open();
	}

	function deleteCity(e) {
		Ti.API.warn('delete City');
		Ti.API.warn(JSON.stringify(e.source.data, null, 2));
		locationManager.deleteCity(e.source.data);
		var len = $.locationsListView.children.length;
		for (var i = len - 1; i >= 0; i--) {
			$.locationsListView.remove($.locationsListView.children[i]);
		};
		showData();
	}

}
showData();
// $.locationsListView.addEventListener('swipe', editLocation);