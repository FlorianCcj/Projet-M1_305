/**
 * Created by Florian on 28/03/2015.
 * Mes methodes fonctionnelles
 */

"use strict";

/**
 * Fonction sleep
 */
/*
function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
sleep(10000);
 */
/**
 * creation de serveur (https://github.com/manuelkiessling/nodebeginner.org/blob/master/code/application/server.js
 */
/*
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, response, request);
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}
start();
//exports.start = start;
 */
/**
 * Detecte les ports series
 */
/*
var serialport = require("serialport");
var sf = require("sf");

serialport.list(function (err, results) {
    if (err) {
        throw err;
    }

    console.log(results.length);

    for (var i = 0; i < results.length; i++) {
        var item = results[i];
        console.log(sf("{comName,-15} {pnpId,-20} {manufacturer}", item));
    }
});
 */
/**
 * Detecte tout les periferique
 */
/*
var usb = require("usb");

//fonction de detection
function detecter() {
    var detect = usb.getDeviceList();
    //test de présence usb
    if (detect) {
        console.log("on a detecter : " + detect);
        var usb_number = detect.length;             // nombre de clef connectées
        console.log(usb_number + " clef connecté");
        console.log(detect);                        // tableau descriptif de chaque clef
    } else {
        console.log("Dsl rien n'a été conecté");
    }
}

console.log("on lance la détection");
detecter();
 */
/**
 * Detecte tout les peripherique mais retire les permanants de mon ordi lenovo
 */
/*
var usb = require("usb");

//fonction de detection
function detecter() {
    var detect = usb.getDeviceList();
    //test de présence usb
    // Les deviceAddress 1 2 4 5 6 ne sont pas les peripherique usb
    if (detect) {
        console.log("on a detecter : " + detect);
        var usb_number = detect.length;             // nombre de clef connectées
        console.log(usb_number + " devices connectés");
        //console.log(detect);                        // tableau descriptif de chaque clef
        //console.log(detect[1]);
        //console.log(detect[1].deviceAddress);
        for (var iter = 0; iter < 5; iter++) {
            if ((detect[iter].deviceAddress != 1 && detect[iter].deviceAddress != 2 && detect[iter].deviceAddress != 4 && detect[iter].deviceAddress != 5 && detect[iter].deviceAddress != 6)) {
                console.log(detect[iter]);
            }
        }
    } else {
        console.log("Dsl rien n'a été conecté");
    }
}

console.log("on lance la détection");

detecter();
 */
/**
 * Detetcte les plug et unplug avec une boucle qui tourne a l"infini
 */
/*
var usb = require("usb");

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function test(detect, mem_detect, iter, iter_mem) {
    return (detect[iter].deviceDescriptor.idVendor == mem_detect[iter_mem].deviceDescriptor.idVendor && detect[iter].deviceDescriptor.idProduct == mem_detect[iter_mem].deviceDescriptor.idProduct );
}

function min(number_a, number_b) {
    return (number_a < number_b ? number_a : number_b);
}


//fonction de detection
function detecter() {
    var detect = usb.getDeviceList();
    //test de présence usb
    // Les deviceAddress 1 2 4 5 6 ne sont pas les peripherique usb
    if (detect) {
        console.log("on a detecter : " + detect);
        var usb_number = detect.length;             // nombre de clef connectées
        console.log(usb_number + " devices connectés");
        //console.log(detect);                        // tableau descriptif de chaque clef
        //console.log(detect[1]);
        console.log(detect[1].deviceAddress);
        var mem_detect = detect;
        var detect_length;
        var mem_detect_length;
        while (1) {
            detect = usb.getDeviceList();
            detect_length = detect.length;
            mem_detect_length = mem_detect.length;

            console.log("Mon ordi va bugguer chouette");

            for (var parcours_detect = 0; parcours_detect < min(mem_detect_length, detect_length); parcours_detect++) {
                console.log(test(detect, mem_detect, parcours_detect, parcours_detect));
                if (test(detect, mem_detect, parcours_detect, parcours_detect)) {
                    //console.log(mem_detect);
 console.log("Le Produit ", mem_detect[parcours_detect].deviceDescriptor.idProduct, " du vendeur ", mem_detect[parcours_detect].deviceDescriptor.idVendor, " n a pas changer");
                } else {
                    for (var parcours_mem = parcours_detect; parcours_mem < usb_number; parcours_mem++) {

                    }
                }
            }

            mem_detect = detect;

            sleep(5000);
        }
    } else {
 console.log("Dsl rien n a été conecté");
    }
}

detecter();
 */
/**
 * Je sais pas ce que ca fait
 */
/*
 var port = 0;
 //var endpoint = 0x01;
 var device = {vendorId: 0x04b8, productId: 0x0202};
 var chrome;

 var connect = function (callback) {
 chrome.permissions.getAll(function (p) {
 if (p.permissions.indexOf("usb") >= 0) {

 //construct permission object for our device
 var obj = {usbDevices: [device]};

 //now request the permissions
 chrome.permissions.request({permissions: [obj]}, function (granted) {
 if (granted) {
 chrome.usb.findDevices(device, function (devices) {
 if (devices && devices.length > 0) {
 //use the first found device
 var foundDevice = devices[0];
 //now lets reset the device
 chrome.usb.resetDevice(foundDevice, function () {
 //perform some error checking to make sure we reset the device
 if (!chrome.runtime.lastError) {
 //now claim the interface using the port we specified
 chrome.usb.claimInterface(foundDevice, port, function () {
 if (!chrome.runtime.lastError) {
 callback(foundDevice);
 } else {
 throw chrome.runtime.lastError.message;
 }
 });
 } else {
 throw chrome.runtime.lastError.message;
 }
 });

 } else {
 console.warn("Device not found!");
 }
 });
 } else {
 console.warn("USB Permission not granted.");
 }
 });

 } else {
 console.warn("No USB permissions granted.");
 }
 });
 };

 */

/** COMMANDE UNIX esxemple
 *
 *
 */
/*
 var child = require("child_process");

 var ls = child.spawn("ls", ["-l"]);

 ls.stdout.on("data", function (data) {
 console.log(data.toString());
 });

 ls.stderr.on("data", function (err) {
 console.log("err:" + err);
 });

 ls.on("close", function (code) {
 console.log("Close: " + code);
 });
 */
/**
 * Commande Unix
 */
/*
 var child = require("child_process");

 //var make_file=child.spawn("touch", ["tutut"]);
 var ls = child.spawn("ls", ["-la"]);

 ls.stdout.on("data", function (data) {
 console.log(data.toString());
 });

 ls.stderr.on("data", function (err) {
 console.log("err:" + err);
 });

 ls.on("close", function (code) {
 console.log("Close: " + code);
 });

 //var copy=child.spawn("cp",["./2015.05.17-main.js","./temp_main.js"]);
 //var copy=child.spawn("mkdir",["../temp_app/"]);
 // cp -r /home/hope/files/* /home/hope/backup

 var child = require("child_process");

 spawn("cp", ["-ruv", "../app/2015.05.17-main.js", "../temp_app/"]);

 var path_in = "../app/";
 var path_out = "../temp_app/";

 var cp = child.spawn("cp", ["-r", path_in, path_out]);

 cp.stdout.on("data", function (data) {
 console.log("stdout: " + data);
 });

 cp.stderr.on("data", function (e) {
 console.log(e.toString());
 });
 */
/**
 * Creer fichier/dossier ....
 */
/*


 var fs = require("fs");

 var dir_files = fs.readdir(".monprojet", function () {
 console.log("I read it");
 });
 console.log(dir_files.files);
 fs.mkdir(".nomprojet", function (e) {
 if (e) {
 console.log(e);
 } else {
 console.log(">>>>>>created<<<<<<");
 }
 }); //creer un dossier
 fs.mkdirSync(".nomprojet");
 fs.writeFile(".nomprojet/message.txt", "Coucou", function (err) {
 if (err) {
 console.log(err);
 }
 console.log("It\"s saved!");
 }); /// creer un fichier
 fs.rmdir("E:/.nomprojet", function (e) {
 if (e) {
 console.log(e);
 } else {
 console.log(">>>>>removed<<<<<");
 }
 });
 console.log();

 */