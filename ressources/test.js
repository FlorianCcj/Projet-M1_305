/**
 * Created by Florian on 28/03/2015.
 */

"use strict";


//var fs=require("fs");

/*
 var fs = require("fs");
 var path = require("path");

 function rmdir(dir) {
 var list = fs.readdirSync(dir);
 for(var i = 0; i < list.length; i++) {
 var filename = path.join(dir, list[i]);
 var stat = fs.statSync(filename);

 if(filename == "." || filename == "..") {
 // pass these files
 } else if(stat.isDirectory()) {
 // rmdir recursively
 rmdir(filename);
 } else {
 // rm fiilename
 fs.unlinkSync(filename);
 }
 }
 fs.rmdirSync(dir);
 };*/


var usb = require("usb");
//events = require("events");

/*

 console.log("on lance la détection");

 //detecter();

 var usb_class = function () {
 this._old_detect = [];
 this._ev = new events.EventEmitter();
 this._vid=0;
 this._pid=0;
 };

 usb_class.prototype = {
 run: function () {
 this._watcher = setInterval(this.watch_device.bind(this), 1000);
 this._ev.on("new_device", this.new_device.bind(this));
 },
 watch_device: function () {
 this._detect = usb.getDeviceList();
 if (this._old_detect.length == 0) this._old_detect = this._detect;
 if (this._detect.length != this._old_detect.length) {
 this._ev.emit("new_device", this._old_detect.length, this._detect.length);
 this._old_detect = this._detect;
        }
 },
 new_device: function (o, n) {
 if (o < n) {
 console.log("Plugged");
 this._vid=this._detect[0].deviceDescriptor.idVendor;
 this._pid=this._detect[0].deviceDescriptor.idProduct;
 this.use_usb(this.vid,this.pid);
 //console.log(this._detect[0]);
 } else {
 console.log("Unplugged");
 }
 for (var a in this._detect) {
 if (this._detect.hasOwnProperty(a)) {
 //console.log(this._detect[a].deviceDescriptor.idProduct);
 console.log(this._detect[a].deviceDescriptor.idProduct);
 }
 }

 //clearInterval(this._watcher);
 },
 use_usb: function (){
 console.log("(",this._vid,",",this._pid,")");

 }
 };

 var u = new usb_class();
 u.run();*/
//var term = usb.findByIds(3034, 339);
//var term = usb.findByIds(u._vid, u._pid);
//term.open();

/*var endpoints = term.interfaces[0].endpoints,
 inEndpoint = endpoints[0],
 outEndpoint = endpoints[1];*/
//var dir_files = fs.readdir(".monprojet",function(cb){console.log("I read it");});
//console.log(dir_files.files);
//fs.mkdir(".nomprojet",function (e) {if (e){ console.log(e);}else{ console.log(">>>>>>created<<<<<<");}}); //creer un dossier
//fs.mkdirSync(".nomprojet");
//fs.writeFile(".nomprojet/message.txt", "Coucou", function (err) {if (err){console.log(err);}console.log("It\"s saved!");}); /// creer un fichier
//fs.rmdir("E:/.nomprojet",function (e) {if (e){ console.log(e);}else{ console.log(">>>>>removed<<<<<");}});
//console.log();

//Synthèse d"image WebGL
//Réalité virtuelle / réalité augementée
//Intelligence Artificielle
//Traitement images
//Traitement iaudio

//usb.findByIds(vid, pid) = usb.findByIds(idVendor,idProduct)

// COMMANDE UNIX

var child = require("child_process");

var ls = child.spawn("ls", ["-l"]);

ls.stdout.on("data", function (data) {
 console.log(data.toString());
});

ls.stderr.on("data", function (err) {
 console.log("err:" + err);
});

ls.on('close', function (code) {
 console.log("Close: " + code);
});