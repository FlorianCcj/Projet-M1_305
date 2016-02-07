/**
 * Created by Florian on 05/04/2015.
 */

"use strict";

/*-----------------------------------------------
 gistfile1.js (https://gist.github.com/sidorares/4025095)
 -----------------------------------------------*/

/** dbus 'device added' signal listener
 *
 */
/*
var dbus = require("dbus-native");
var bus = dbus.systemBus();
var udservice = bus.getService("org.freedesktop.UDisks");
udservice.getInterface(
    "/org/freedesktop/UDisks",
    "org.freedesktop.UDisks",
    function (err, ud) {
        ud.on("DeviceAdded", function (deviceObjectPath) {
            console.log("DeviceAdded", deviceObjectPath);
        });
    }
);
 */