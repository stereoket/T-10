// register a background service. this JS will run when the app is backgrounded


var controller = require('/controller/controller');
var service = Ti.App.iOS.registerBackgroundService({url:'/controller/background.js'});
controller.open();