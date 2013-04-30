function addRow(controls) {
    row = Ti.UI.createTableViewRow({
        height: 40
    });
    controls.label.top = 7;
    controls.label.left = 7;
    controls.value.right = 10;
    controls.value.top = 6;
    if (controls.icon) {
        image = Ti.UI.createImageView({
            image: controls.icon,
            width: 26,
            height: 26,
            top: 6
        });
        image.left = 6;
        controls.label.left = 40;
        row.add(image);
    }
    row.add(controls.label);
    row.add(controls.value);
    rows.push(row);
    return row;
}

function createLabel(caption) {
    var label = Ti.UI.createLabel({
        font: {
            fontSize: 17,
            fontWeight: "bold"
        },
        text: caption
    });
    return label;
}

var rows;

var name;

var nav;

exports.getBool = function(name, property) {
    Ti.App.Properties.getBool(name + "_" + property);
};

exports.getString = function(name, property) {
    Ti.App.Properties.getString(name + "_" + property);
};

exports.init = function(title) {
    rows = [];
    name = title || "Settings";
};

exports.addTextInput = function(opts) {
    var label = createLabel(opts.caption);
    var value = Ti.UI.createLabel({
        font: {
            fontSize: 17,
            fontWeight: "normal"
        },
        text: Ti.App.Properties.getString(name + "_" + opts.id || opts.name) || opts.value,
        color: "#777"
    });
    row = addRow({
        label: label,
        value: value
    });
    row.addEventListener("click", function() {
        var rows = [];
        var editWin = Ti.UI.createWindow({
            title: "edit",
            Hidden: false,
            backgroundColor: "#fff"
        });
        var table = Ti.UI.createTableView({
            style: Ti.UI.iPhone.TableViewStyle.GROUPED
        });
        var row = Ti.UI.createTableViewRow({
            height: 50
        });
        var text = Ti.UI.createTextField({
            left: 10,
            right: 10,
            value: value.text
        });
        var cancel = Ti.UI.createButton({
            title: "Cancel",
            width: 50,
            height: 30
        });
        var save = Ti.UI.createButton({
            title: "Save",
            width: 50,
            height: 30
        });
        row.add(text);
        rows.push(row);
        table.setData(rows);
        if ("android" != Titanium.Platform.osname) {
            editWin.setLeftNavButton(cancel);
            editWin.setRightNavButton(save);
        }
        editWin.add(table);
        cancel.addEventListener("click", function() {
            nav.close(editWin);
        });
        save.addEventListener("click", function() {
            value.text = text.value;
            Ti.App.Properties.setString(name + "_" + (opts.id || opts.caption), text.value);
            nav.close(editWin);
        });
        "android" == Titanium.Platform.osname && editWin.addEventListener("android:back", function() {
            value.text = text.value;
            Ti.App.Properties.setString(name + "_" + (opts.id || opts.caption), text.value);
            editWin.close();
        });
        nav ? nav.open(editWin) : editWin.open({
            modal: true
        });
    });
};

exports.addChoice = function(opts) {
    var label = createLabel(opts.caption);
    var value = Ti.UI.createLabel({
        font: {
            fontSize: 17,
            fontWeight: "normal"
        },
        text: Ti.App.Properties.getString(name + "_" + opts.id || opts.name) || opts.value,
        color: "#777"
    });
    row = addRow({
        label: label,
        value: value
    });
    row.hasChild = true;
    row.addEventListener("click", function() {
        var rows = [];
        var editWin = Ti.UI.createWindow({
            title: "select",
            Hidden: false,
            backgroundColor: "#fff"
        });
        var table = Ti.UI.createTableView({
            style: Ti.UI.iPhone.TableViewStyle.GROUPED
        });
        for (i = 0; opts.choices.length > i; i++) {
            var row = Ti.UI.createTableViewRow({
                height: 40
            });
            var text = Ti.UI.createLabel({
                left: 10,
                right: 10,
                text: opts.choices[i].title,
                font: {
                    fontSize: 17,
                    fontWeight: "bold"
                }
            });
            row.value = opts.choices[i].value;
            row.hasCheck = Ti.App.Properties.getBool(name + "_" + (opts.id || opts.caption) + "_" + row.value) || false;
            row.add(text);
            rows.push(row);
        }
        table.setData(rows);
        table.addEventListener("click", function(e) {
            e.row.hasCheck = !e.row.hasCheck;
            "android" == Titanium.Platform.osname && Ti.App.Properties.setBool(name + "_" + (opts.id || opts.caption) + "_" + e.row.value, e.row.hasCheck);
        });
        var cancel = Ti.UI.createButton({
            title: "Cancel",
            width: 50,
            height: 30
        });
        var save = Ti.UI.createButton({
            title: "Save",
            width: 50,
            height: 30
        });
        if ("android" != Titanium.Platform.osname) {
            editWin.setLeftNavButton(cancel);
            editWin.setRightNavButton(save);
        }
        editWin.add(table);
        cancel.addEventListener("click", function() {
            nav.close(editWin);
        });
        save.addEventListener("click", function() {
            if ("android" != Titanium.Platform.osname) for (i = 0; table.data[0].rows.length > i; i++) Ti.App.Properties.setBool(name + "_" + (opts.id || opts.caption) + "_" + table.data[0].rows[i].value, table.data[0].rows[i].hasCheck);
            nav.close(editWin);
        });
        nav ? nav.open(editWin) : editWin.open({
            modal: true
        });
    });
};

exports.addSwitch = function(opts) {
    var label = Ti.UI.createLabel({
        font: {
            fontSize: 17,
            fontWeight: "bold"
        },
        text: opts.caption
    });
    var toggle = Ti.UI.createSwitch({
        value: Ti.App.Properties.getBool(name + "_" + opts.caption, false)
    });
    toggle.addEventListener("change", function(e) {
        Ti.App.Properties.setBool(name + "_" + (opts.id || opts.caption), e.value);
        opts.onChange && opts.onChange(toggle.value);
    });
    addRow({
        label: label,
        value: toggle
    });
};

exports.open = function(tabGroup) {
    var prefsWin = Ti.UI.createWindow({
        title: name
    });
    var table = Titanium.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    });
    table.data = rows;
    prefsWin.add(table);
    if (tabGroup) {
        nav = tabGroup.activeTab;
        nav.open(prefsWin);
    } else if ("android" == Titanium.Platform.osname) {
        prefsWin.backgroundColor = "#FFF";
        prefsWin.open({
            modal: true
        });
    } else {
        nav = Ti.UI.iPhone.createNavigationGroup({
            window: prefsWin
        });
        var rootWin = Ti.UI.createWindow();
        rootWin.add(nav);
        var closeButton = Ti.UI.createButton({
            title: "Close",
            width: 50,
            height: 30
        });
        prefsWin.setLeftNavButton(closeButton);
        closeButton.addEventListener("click", function() {
            nav.close(prefsWin);
            rootWin.remove(nav);
            rootWin.close();
            prefsWin.close();
            rootWin = null;
            prefsWin = null;
        });
        rootWin.open();
    }
};