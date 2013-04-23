/**
 * User Interface Layout for the opening screen which offers the "Where are you?" 
 * index.js
 */

var colours = require('/lib/configs').colours();

function buildLayout(params){
	var colours = require('/lib/configs').colours();
	// Load Inital screen offering here:

	var indexWindow = Ti.UI.createWindow({
		title: 'T-10',
		backgroundImage: '/images/earth_space.png'
	});

	var titleLayer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		top: 0
	})
	var mainTitle = Ti.UI.createLabel({
		text: 'T-10',
		font: {
			fontSize: 84,
			fontWeight: 'bold'
		},
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		center: {
			x: '50%',
			y: '50%'
		},
		// backgroundColor: 'red'
	});

	var questionLabel = Ti.UI.createLabel({
		text: 'Where are you ?',
		font: {
			fontSize: 20,
			fontWeight: 'normal'
		},
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		center: {
			x: '50%',
			y: '65%'
		},
	});
	var buttonLayer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		top: 0,
		zIndex: 2
	});

	var earthButton = Ti.UI.createView({
		width: '80%',
		bottom: 0,
		height: '50%',
		backgroundColor: 'transparent',
		// borderRadius: 12
	});

	var earthLabel = Ti.UI.createLabel({
		text: 'EARTH',
		color: '#fff'
	});

	// earthButton.add(earthLabel);
	var spaceButton = Ti.UI.createView({
		width: '80%',
		top: 0,
		height: '50%',
		backgroundColor: 'transparent',
		// borderRadius: 12
	});

	var spaceLabel = Ti.UI.createLabel({
		text: 'SPACE',
		color: '#000'
	});

	spaceButton.add(spaceLabel);

	// titleLayer.add(mainTitle);
	// titleLayer.add(questionLabel);

	buttonLayer.add(earthButton);
	buttonLayer.add(spaceButton);

	// mainWin.add(titleLayer);
	indexWindow.add(buttonLayer);


	// Setup Event Listeners on each button
	// 
	// 

	earthButton.addEventListener('click', function (e) {
		Ti.App.Properties.setString('appmode', 'earth');
		var alertDialog = Ti.UI.createAlertDialog({
			title: 'Earth Utility',
			message: 'The Earth utiity section will be created soon',
			buttonNames: ['OK']
		}).show();
	});


	spaceButton.addEventListener('click', function (e) {
		Ti.App.Properties.setString('appmode', 'space');
		// var appTabgroup = tabgroup();
		params.spaceCallback();
	});


	return indexWindow;
}

exports.buildLayout = buildLayout;