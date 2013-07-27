/**
 * Activity Indicator & OSD message module
 * =======================================
 *
 * Create an activity indicator with a background view and label if required based on OS
 * This will gracefully fall back based on OS versions and platform.
 * Allows you to create a custom message box, instead of an indicator & set custom timeouts
 *
 * Ketan K Majmudar
 * ket@spiritquest.co.uk
 *
 *
 */

/**
 *
 */

var defaultTimeout = 25000;

/**
 *
 */

/**
 * Indicator View for iOS devices
 * @param  {Object} params [description]
 * @return {[type]}        [description]
 */
var createMessageView = function (params) {
    "use strict";
    Ti.API.warn(' *** Create Message Method Triggerred *** ');
    Ti.API.warn(JSON.stringify(params, null, 2));
    Ti.API.warn($.messageView);
    Ti.API.warn($.messageLabel + ':' + $.messageLabel.text);
    if (OS_ANDROID) {
        $.messageView.backgroundColor = 'transparent';
        $.messageView.borderColor = 'none';
        $.messageView.borderRadius = 'none';
    }
    $.messageView.visible = true;
    $.messageLabel.visible = true;
    $.messageLabel.text = params.message || '';
    if (params.timeoutVal !== undefined) {
        setIndicatorTimeout({
            timeoutVal: params.timeoutVal
        });
    }
    var disIn = params.disableIndicator || false;
    if (disIn) {
        disableIndicator();
    }



    //return $.messageView;
};

/**
 * Creates and returns activity indicator object, automatically creates a timeout.
 * @param {object} [message: 'Your message']
 * @return {object} Ti.UI.activityIndicator
 */
var createIndicator = function (params) {
    "use strict";
    Ti.API.info(' *** Create Indicator Triggerred *** ');
    Ti.API.warn(JSON.stringify(params));
    if (params.indicator !== undefined && params.indicator) {
        var style;
        // Custom iOS indicator styling
        if (!OS_ANDROID) {
            $.activityIndicator.color = '#000';
            style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
        } else {
            style = Ti.UI.ActivityIndicatorStyle.DARK;
        }
        $.activityIndicator.style = style;
        //$.activityIndicator.message = params.message;

        Ti.API.warn('Creating  ' + $.activityIndicator + ' : ' + $.activityIndicator.message + " " + typeof params.timeoutVal);
        $.activityIndicator.show();

        var messageView = createMessageView({
            indicator: true,
            message: params.message
        });
    } else {
        createMessageView({
            message: (params.message !== undefined) ? params.message : ''
        });
    }
    if (params.timeoutVal !== undefined && typeof params.timeoutVal === "number") {
        setIndicatorTimeout({
            timeoutVal: params.timeoutVal
        });
    } else if (params.timeoutVal !== undefined) {
        setIndicatorTimeout();
    }
    $.backgroundView.visible = true;
};

/**
 * Actually hides the indicator after timing out,
 */

function hideIndicator(params) {
    "use strict";
    //The following lines cause the widget to blow up...
    //"use strict";
    /*
    Ti.API.info('Remove Indicator/Message for ' + params.indicator);

    Ti.API.warn('Grabage Cleanup of the message/activity view containers in the window');

    if (params.indicator !== undefined) {
        $.activityIndicator.show();
    }
*/
    //Should we clear down any text in the message in case we forget to change it when we next display the view?
    $.messageView.hide();
    $.backgroundView.visible = false;

};

/**
 * Sets a timeout on an activity indicator, incase of network or other issues, it will change the message and set a timeout.
 */
var setIndicatorTimeout = function (params) {
    "use strict";
    Ti.API.warn(' *** Indicator Timeout Activated *** ');
    var timeoutNum = params.timeoutVal || defaultTimeout;
    // FIXME - should be possible to remove the timeout when an indicator is hidden.
    var timeoutVal = Number(timeoutNum);


    timeout = setTimeout(function () {
        // params.indicator.message = 'Timeout.';
        Ti.API.info('Indicator Timeout of ' + timeoutVal + ' reached for ' + params.indicator);

        Ti.API.warn('Grabage Cleanup of the message/activity view containers in the window');

        if ($.activityIndicator) {
            $.activityIndicator.hide();
        }

        $.messageView.hide();
        $.backgroundView.visible = false;
    }, timeoutVal);
    return timeout;

};

function updateMessage(params) {
    "use strict";
    Ti.API.warn(' *** Update Message Triggerred *** ');
    Ti.API.warn(JSON.stringify(params));
    if (params.message !== undefined) {
        $.messageLabel.text = params.message;
    }

    if (params.indicatorMessage !== undefined) {
        $.activityIndicator.message = params.indicatorMessage;
    }



    /*		switch($.messageView.children.length){
			case 2:
			$.activityIndicator.message = params.message;
			$.activityIndicator.show();
			break;
			
			case 1:
			//$.activityIndicator.message = '';
			$.messageLabel.text = params.message;
			break;
	
		}
		*/

}

function disableIndicator() {
    if ($.activityIndicator) {
        $.activityIndicator.hide();
    }
}
exports.disableIndicator = disableIndicator;
exports.hideIndicator = hideIndicator;
exports.setIndicatorTimeout = setIndicatorTimeout;
exports.createIndicator = createIndicator;
exports.createMessageView = createMessageView;
exports.updateMessage = updateMessage;