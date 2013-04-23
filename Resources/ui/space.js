/**
 * space.js
 */
var colours = require('/lib/configs').colours();

function buildLayout(params){
	var spaceHomeWindow = Ti.UI.createWindow({
		title: 'Space Home',
		backgroundImage: '/images/background.png'
	});

	var buttonLayer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		top: 0,
		zIndex: 2
	});

	var addNewButton = Ti.UI.createView({
		width: '80%',
		top: 100,
		height: 88,
		backgroundColor: colours.earthButton,
		borderRadius: 12
	});

	var addNewLabel = Ti.UI.createLabel({
		text: 'ADD',
		color: '#fff',
		font: {
			fontFamily: 'Ostrich Sans',
			fontSize: 33
		}
	});

	addNewButton.add(addNewLabel);
	var trackedButton = Ti.UI.createView({
		width: '80%',
		bottom: 100,
		height: 88,
		backgroundColor: colours.spaceButton,
		borderRadius: 12
	});

	var trackedLabel = Ti.UI.createLabel({
		text: 'TRACKED',
		color: '#fff',
		font: {
			fontFamily: 'Ostrich Sans',
			fontSize: 33
		}
	});


	return spaceHomeWindow;
}

exports.buildLayout = buildLayout;