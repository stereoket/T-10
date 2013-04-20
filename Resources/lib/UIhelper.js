function createWindow(params){
	var thisWindow = Ti.UI.createWindow({
		title: params.title,
		backgroundColor: params.backgroundColor
	});
	return thisWindow;
};

exports.createWindow = createWindow;