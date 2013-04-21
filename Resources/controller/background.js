	Ti.API.warn('Super Background Service enabler ');
	if(notification === undefined){
		var notification= [];
		var n = 0;
	}
	notification[n] = Titanium.App.iOS.scheduleLocalNotification({
		alertBody: "alert body",
		alertAction: "View App",
		userInfo: {
			"hello": "world"
		},
		date: new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
	});
	n++;