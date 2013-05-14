
var locationManager = require('locationManager');
var dataArray = [];

function showData(){
	Ti.API.info("showData() ");
	var cities = locationManager.getAllLocations();
// Ti.API.warn(data);
var i, currDate, topPointer = 0;
for (i = 0; i < cities.count; i++) {
	// dataArray.push({});
	Ti.API.warn("LOOP START - topPointer:" + topPointer);
	var listController = Widget.createController("listItem");
	var listItem = listController.getView("listItem");
	var locationData = listController.getView("locationData");

	listItem.top = topPointer + Alloy.CFG.locationsListPadding;
	locationData.index = i;
	locationData.location = cities.data[i].location;
	locationData.time_of_day = cities.data[i].alertParams.time_of_day;
	locationData.max_cloud_cover = cities.data[i].alertParams.max_cloud_cover;
	locationData.text = cities.data[i].location.city;
	locationData.text += " (" + cities.data[i].location.country + ") ";
	$.locationsListView.add(listItem);
	topPointer += (listItem.height + Alloy.CFG.locationsListPadding);
	// Ti.API.warn("LOOP END - topPointer:" + topPointer);
}
}

function editLocation(e) {
	Ti.API.warn(JSON.stringify(e.source.parent.children[1], null, 2));
	if(e.source.parent.children[1] === undefined){
		Ti.API.warn('not the row, ignore');
		return;
	}
	var listController = Widget.createController("listItem");
	var editBtn = listController.getView("editBtn");
	var deleteBtn = listController.getView("deleteBtn");
	editBtn.show();
	deleteBtn.show();
	var rowData = e.source;
	Ti.API.info(e.source.parent.children[0].id);
	Ti.API.info(e.source.parent.children[1].id);
	Ti.API.info(e.source.parent.children[2].id);
	Ti.API.info(e.source.parent.children[3].id);
	// dataArray[e.source.index] = e.source;
	e.source.parent.children[2].visible = true; // edit
	e.source.parent.children[2].data = e.source.parent.children[1]; // edit
	e.source.parent.children[2].index = e.source.parent.children[1].index; // edit
	e.source.parent.children[3].visible = true; // delete
	e.source.parent.children[3].data = e.source.parent.children[1]; // delete
	e.source.parent.children[3].index = e.source.parent.children[1].index; // delete

	e.source.parent.children[2].addEventListener('click', editCity);
	e.source.parent.children[3].addEventListener('click', deleteCity);

	function editCity(e) {
		Ti.API.warn('Editing City');
		Ti.API.warn(JSON.stringify(e.source.data, null, 2));
		var editActiveLocation = Alloy.createController("space_addEvent");
		editActiveLocation.setEditData(e.source.data);
		editActiveLocation.open();
	}

	function deleteCity(e){
		Ti.API.warn('delete City');
		Ti.API.warn(JSON.stringify(e.source.data, null, 2));
		locationManager.deleteCity(e.source.data);
		var len = $.locationsListView.children.length;
		for (var i = len- 1; i >= 0; i--) {
			$.locationsListView.remove($.locationsListView.children[i]);
		};
		showData();
	}

}
showData();
$.locationsListView.addEventListener('swipe', editLocation);