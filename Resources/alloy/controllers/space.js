function Controller() {
    function open() {
        $.space.addEventListener("blur", function() {
            Ti.API.warn("space window closed");
            $.space.close();
        });
        $.space.open();
    }
    function addEvent() {
        log("WARN", "Add Event Clicked");
        var addSapceEvent = Alloy.createController("space_addEvent");
        addSapceEvent.open();
        $.space.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    if (true && Alloy.isTablet) {
        $.__views.space = Ti.UI.createWindow({
            backgroundImage: Alloy.CFG.backgroundImage,
            id: "space"
        });
        $.__views.space && $.addTopLevelView($.__views.space);
        $.__views.titleView = Ti.UI.createView({
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            id: "titleView",
            top: "80"
        });
        $.__views.space.add($.__views.titleView);
        $.__views.__alloyId16 = Ti.UI.createImageView({
            image: "/images/triple.png",
            opacity: "0.06",
            id: "__alloyId16"
        });
        $.__views.titleView.add($.__views.__alloyId16);
        $.__views.winTitle = Ti.UI.createLabel({
            font: {
                fontSize: 120,
                fontFamily: "OstrichSans-Medium"
            },
            color: "#fff",
            text: "T-10 SPACE",
            id: "winTitle"
        });
        $.__views.titleView.add($.__views.winTitle);
        $.__views.addEvent = Ti.UI.createView({
            width: Alloy.CFG.bigButtonWidth,
            height: Alloy.CFG.bigButtonHeight,
            borderRadius: 8,
            top: 466,
            color: "#fff",
            backgroundImage: "/images/blueButton.png",
            id: "addEvent"
        });
        $.__views.space.add($.__views.addEvent);
        addEvent ? $.__views.addEvent.addEventListener("click", addEvent) : __defers["$.__views.addEvent!click!addEvent"] = true;
        $.__views.__alloyId17 = Ti.UI.createLabel({
            font: {
                fontSize: 76,
                fontFamily: "OstrichSans-Black"
            },
            color: "#fff",
            width: Ti.UI.SIZE,
            textAlign: "center",
            center: {
                x: "50%",
                y: "56%"
            },
            shadowColor: "#000",
            shadowOffset: {
                x: 2,
                y: 1
            },
            text: "Add Location",
            id: "__alloyId17"
        });
        $.__views.addEvent.add($.__views.__alloyId17);
    }
    if (true && !Alloy.isTablet) {
        $.__views.space = Ti.UI.createWindow({
            backgroundImage: Alloy.CFG.backgroundImage,
            id: "space"
        });
        $.__views.space && $.addTopLevelView($.__views.space);
        $.__views.__alloyId18 = Ti.UI.createLabel({
            font: {
                fontFamily: "OstrichSans-Medium"
            },
            color: "#fff",
            text: "An iPhone",
            id: "__alloyId18"
        });
        $.__views.space.add($.__views.__alloyId18);
    }
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Helper = require("Helper");
    var log = Helper.log;
    exports.open = open;
    __defers["$.__views.addEvent!click!addEvent"] && $.__views.addEvent.addEventListener("click", addEvent);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;