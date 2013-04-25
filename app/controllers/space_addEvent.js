/**
 * Open the Space / Add Event windoe
 * @return {[type]} [description]
 */
function open(){
	$.spaceAddEvent.open();
	$.spaceAddEvent.addEventListener("swipe", function(e){
		Ti.API.info(JSON.stringify(e, null, 2));

		if(e.direction === "right" && e.source.id === "spaceAddEvent"){
			spaceWin = Alloy.createController('space');
			setTimeout(function(){
				spaceWin.open();
				$.spaceAddEvent.close();
			},50);
			
			
		}
	});
}




exports.open = open;