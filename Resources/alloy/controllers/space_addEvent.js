function Controller() {
    function open() {
        $.spaceAddEvent.open();
        $.spaceAddEvent.addEventListener("swipe", function(e) {
            Ti.API.info(JSON.stringify(e, null, 2));
            if ("right" === e.direction && "spaceAddEvent" === e.source.id) {
                spaceWin = Alloy.createController("space");
                setTimeout(function() {
                    spaceWin.open();
                    $.spaceAddEvent.close();
                }, 50);
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.spaceAddEvent = Ti.UI.createWindow({
        backgroundImage: Alloy.CFG.backgroundImage,
        bubbleParent: false,
        id: "spaceAddEvent"
    });
    $.__views.spaceAddEvent && $.addTopLevelView($.__views.spaceAddEvent);
    $.__views.cityLabel = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Medium",
            fontSize: 44
        },
        textAlign: "left",
        color: "#fff",
        top: 64,
        left: 100,
        text: "Add a location to photograph:",
        id: "cityLabel"
    });
    $.__views.spaceAddEvent.add($.__views.cityLabel);
    $.__views.cityTextField = Ti.UI.createTextField({
        left: 80,
        right: 80,
        height: 60,
        top: 140,
        hintText: "Search for a City",
        font: {
            fontFamily: "OstrichSans-Black",
            fontSize: 34
        },
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Titanium.UI.KEYBOARD_ASCII,
        paddingLeft: 60,
        zIndex: 100,
        id: "cityTextField"
    });
    $.__views.spaceAddEvent.add($.__views.cityTextField);
    $.__views.magnify = Ti.UI.createImageView({
        top: 146,
        left: 86,
        width: 50,
        height: 50,
        zIndex: 101,
        image: "/images/magnify.png",
        id: "magnify"
    });
    $.__views.spaceAddEvent.add($.__views.magnify);
    $.__views.buttonView = Ti.UI.createView({
        top: 250,
        left: 80,
        right: 80,
        height: 140,
        layout: "horizontal",
        zIndex: 100,
        cancelBubble: true,
        id: "buttonView"
    });
    $.__views.spaceAddEvent.add($.__views.buttonView);
    $.__views.__alloyId3 = Ti.UI.createView({
        height: 100,
        width: "33%",
        bubbleParent: false,
        id: "__alloyId3"
    });
    $.__views.buttonView.add($.__views.__alloyId3);
    $.__views.day = Ti.UI.createButton({
        left: 10,
        right: 10,
        height: 100,
        width: Ti.UI.FILL,
        borderRadius: 12,
        backgroundImage: "/images/timeButtons.png",
        bubbleParent: false,
        id: "day"
    });
    $.__views.__alloyId3.add($.__views.day);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Black",
            fontSize: 34
        },
        textAlign: "center",
        color: "#fff",
        touchEnabled: false,
        text: "Daytime",
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createView({
        height: 100,
        width: "33%",
        bubbleParent: false,
        id: "__alloyId5"
    });
    $.__views.buttonView.add($.__views.__alloyId5);
    $.__views.night = Ti.UI.createButton({
        left: 10,
        right: 10,
        height: 100,
        width: Ti.UI.FILL,
        borderRadius: 12,
        backgroundImage: "/images/timeButtons.png",
        bubbleParent: false,
        id: "night"
    });
    $.__views.__alloyId5.add($.__views.night);
    $.__views.__alloyId6 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Black",
            fontSize: 34
        },
        textAlign: "center",
        color: "#fff",
        touchEnabled: false,
        text: "Nightime",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createView({
        height: 100,
        width: "33%",
        bubbleParent: false,
        id: "__alloyId7"
    });
    $.__views.buttonView.add($.__views.__alloyId7);
    $.__views.either = Ti.UI.createButton({
        left: 10,
        right: 10,
        height: 100,
        width: Ti.UI.FILL,
        borderRadius: 12,
        backgroundImage: "/images/timeButtons.png",
        bubbleParent: false,
        id: "either"
    });
    $.__views.__alloyId7.add($.__views.either);
    $.__views.__alloyId8 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Black",
            fontSize: 34
        },
        textAlign: "center",
        color: "#fff",
        touchEnabled: false,
        text: "Either",
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.pickerView = Ti.UI.createView({
        id: "pickerView"
    });
    $.__views.spaceAddEvent.add($.__views.pickerView);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Medium",
            fontSize: 30
        },
        textAlign: "center",
        color: "#fff",
        text: "Minimum Visibility Required",
        id: "__alloyId9"
    });
    $.__views.pickerView.add($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Medium",
            fontSize: 30
        },
        textAlign: "center",
        color: "#fff",
        text: "0%",
        id: "__alloyId10"
    });
    $.__views.pickerView.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createPicker({
        id: "__alloyId11"
    });
    $.__views.pickerView.add($.__views.__alloyId11);
    $.__views.__alloyId13 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Medium",
            fontSize: 30
        },
        textAlign: "center",
        color: "#fff",
        text: "100%",
        id: "__alloyId13"
    });
    $.__views.pickerView.add($.__views.__alloyId13);
    $.__views.actionButtons = Ti.UI.createView({
        id: "actionButtons"
    });
    $.__views.spaceAddEvent.add($.__views.actionButtons);
    $.__views.__alloyId14 = Ti.UI.createButton({
        id: "__alloyId14"
    });
    $.__views.actionButtons.add($.__views.__alloyId14);
    $.__views.__alloyId15 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Medium",
            fontSize: 30
        },
        textAlign: "center",
        color: "#fff",
        text: "Settings",
        id: "__alloyId15"
    });
    $.__views.actionButtons.add($.__views.__alloyId15);
    $.__views.__alloyId16 = Ti.UI.createButton({
        id: "__alloyId16"
    });
    $.__views.actionButtons.add($.__views.__alloyId16);
    $.__views.__alloyId17 = Ti.UI.createLabel({
        font: {
            fontFamily: "OstrichSans-Medium",
            fontSize: 30
        },
        textAlign: "center",
        color: "#fff",
        text: "Save",
        id: "__alloyId17"
    });
    $.__views.actionButtons.add($.__views.__alloyId17);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.open = open;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;