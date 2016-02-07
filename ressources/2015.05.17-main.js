/**
 * Created by Florian on 06/02/2015.
 */

"use strict";

var usb = require("usb"); // pour detection
var events = require("events"); // pour detection de la clé
var fs = require('fs'); // pour la lecture du fichier
var child = require("child_process"); // pour la copy de fichier
var path = require("path"); //pour ls_file


// ------------------ detection de la clé ----------------

var usb_class = function () {
    this._old_detect = [];
    this._ev = new events.EventEmitter();
};

usb_class.prototype = {
    run: function () {
        this._watcher = setInterval(this.watch_device.bind(this), 1000);
        this._ev.on("new_device", this.new_device.bind(this));
    },
    // look if device is connected, if a device is connect emit new device
    watch_device: function () {
        this._detect = usb.getDeviceList();
        if (this._old_detect.length == 0) this._old_detect = this._detect;
        if (this._detect.length != this._old_detect.length) {
            this._ev.emit("new_device", this._old_detect.length, this._detect.length);
            this._old_detect = this._detect;
        }
    },
    //finds the newly connected devide
    new_device: function (o, n) {
        if (o < n) {
            console.log("Plugged");
        } else {
            console.log("Unplugged");
        }
        for (var a in this._detect) {
            if (this._detect.hasOwnProperty(a)) {
                console.log(this._detect[a].deviceDescriptor.idProduct);
            }
        }

        //clearInterval(this._watcher);
    }
};

//var u = new usb_class();
//u.run();

// -------------------traitement des fichier -------------------

var file_class = function () {
    this._usb_date = [];
    this._cpu_date = [];
    this._usb_d_path = "./usb/";
    this._cpu_d_path = "./cpu/";
    this._more_recent;
};

file_class.prototype = {
    run: function () {
        this.determined_more_recent();
        this._more_recent = "usb";
    },
    // bring se date in a hidden file
    date_from_file: function (path, cpu_or_usb) {
        var path_total = path + "test.txt";
        var stock_date;
        stock_date = fs.readFileSync(path_total);
        if (cpu_or_usb == "cpu") {
            this._cpu_date = stock_date;
        }
        if (cpu_or_usb == "usb") {
            this._usb_date = stock_date;
        }
        console.log("Taking date from " + cpu_or_usb);

    },
    // take 2 dates to know witch one is the more recent
    // don't work
    determined_more_recent: function () {
        this.date_from_file(file_test._usb_d_path, "usb");
        this.date_from_file(file_test._cpu_d_path, "cpu");
        if (this._usb_date > this._cpu_date) {
            this._more_recent = "usb";
        } else if (this._usb_date < this._cpu_date) {
            this._more_recent = "cpu";
        }
    },
    // copy a file from the less recent to the more one
    copy_file: function (file_name) {

        var path_in;
        var path_out;

        if (this._more_recent == "usb") {
            path_in = this._usb_d_path + file_name;
            path_out = this._cpu_d_path + file_name;
        } else if (this._more_recent == "cpu") {
            path_out = this._usb_d_path + file_name;
            path_in = this._cpu_d_path + file_name;
        }

        var cp = child.spawn("cp", ["-ruv", path_in, path_out]);

        cp.stdout.on("data", function (data) {
            console.log("stdout copying : " + data);
        });

        cp.stderr.on("data", function (e) {
            console.log(e.toString());
        });
    },
    // delete a file from the less recent
    delete_file: function (file_name) {

        var path;

        if (this._more_recent == "usb") {
            path = this._cpu_d_path + file_name;
        } else if (this._more_recent == "cpu") {
            path = this._usb_d_path + file_name;
        }

        var rm = child.spawn("rm", ["-rv", path]);

        rm.stdout.on("data", function (data) {
            console.log("stdout: " + data);
        });

        rm.stderr.on("data", function (e) {
            console.log(e.toString());
        });

    },
    // if it is the first time using the software on a directory, create the hidden file
    // ne fonctionne pas
    create_hidden_file: function (path) {
        fs.writeFile(path + "test.txt", new Date().valueOf(), function (err) {
            if (err) {
                console.log(err);
            }
        });
    },
    // list the entire path of a folder (even ./) and all the name of the file in it
    ls_relative_file: function (path) {
        fs.readdir(path, function (err, files) {
            console.log("\nCurrent working directory : " + "\n" + path + "\n");
            if (err) {
                throw err;
            }
            files.forEach(function (f) {
                console.log(f);
            });
        });
    },
    // list the entire path of a the files in a directory
    ls_absolute_file: function (path) {
        fs.readdir(path, function (err, files) {
            if (err) {
                throw err;
            }
            files.map(function (f) {
                return path.join(path, f);
            }).forEach(function (f) {
                console.log(f);
            });
            console.log("---------------------------");
        });
    },
    // list all file in the directory and in all the sub directory
    exploreSystem: function (path) {
        console.log(path);
        var files = fs.readdirSync(path);
        for (var i in files) {
            var currentFile = path + '/' + files[i];
            var stats = fs.statSync(currentFile);
            if (stats.isFile()) {
                console.log(currentFile);
            }
            else if (stats.isDirectory()) {
                exploreSystem(currentFile);
            }
        }
    },
    update_check: function (file1, file2) {
        var a = fs.stat(file1, function (err, stats) {
            if (err) {
                console.log(err);
            }
            console.log('    ' + file1);
            if (stats.isFile()) {
                console.log('    file:          ' + (stats.mode & 0100000 ? 'f' : '-'));
            }
            if (stats.isDirectory()) {
                console.log('    directory:      ' + (stats.mode & 0040000 ? 'd' : '-'));
            }
            console.log('    size:          ' + stats.size + ' octets');
            console.log('    mtime:         ' + stats.mtime);
            console.log();
        });
        var b = fs.stat(file2, function (err, stats) {
            if (err) {
                console.log(err);
            }
            console.log('    ' + file2);
            if (stats.isFile()) {
                console.log('    file:          ' + (stats.mode & 0100000 ? 'f' : '-'));
            }
            if (stats.isDirectory()) {
                console.log('    directory:      ' + (stats.mode & 0040000 ? 'd' : '-'));
            }
            console.log('    size:          ' + stats.size + ' octets');
            console.log('    mtime:         ' + stats.mtime);
            console.log();
        });
    },
    // return the difference between 2 directory
    compare: function (path1, path2) {
        var file_array = function (dir, done) {
            var results = [];
            var metadata = [];
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);
                var i = 0;

                function next() {
                    var file = list[i++];
                    if (!file) return done(null, results, metadata);
                    file = dir + '/' + file;
                    fs.stat(file, function (err, stat) {

                        // Si présence de dossier
                        // y accede et liste les fichies présents
                        if (stat && stat.isDirectory()) {
                            results.push(file);
                            metadata.push(file)
                            metadata.push(meta(stat, file));


                            /* rentre dans le dossier ou sous dossier et liste les fichier a l interieur*/
                            /* file_array(file, function(err, res) {
                             results.push(res);
                             metadata.push(res)
                             metadata.push(meta(stat, res));
                             next();
                             });
                             */

                            // Sinon push le fichier ds le tableau
                            /*} else {
                             results.push(file);
                             metadata.push(file)
                             metadata.push(meta(stat, file));
                             next();
                             }
                             });
                             })();
                             });
                             };
                             var meta = function(stat, results){
                             var met = {
                             'size' : stat.size,
                             'ctime' : stat.ctime,
                             'mtime' : stat.mtime
                             };
                             results.concat(met);
                             return met;
                             };
                             var comp_by_name_and_meta = function(loc_loc, des_loc, done) {
                             file_array(loc_loc, function(err, local_folder) {
                             if (err) throw err;
                             var current = [];
                             file_array(des_loc, function(err, des_folder) {
                             if (err) throw err;
                             var update = des_folder;
                             //console.log('dossier local : ' + local_folder);
                             //console.log('dossier à comparer ' + des_folder);
                             for(var i=0; i<Object.size(local_folder); i++) {
                             current.push(local_folder[i]);
                             current[i] = current[i].substring(current[i].lastIndexOf('/'));
                             var des_size = Object.size(des_folder);
                             for (var j = 0; j < des_size; j++) {
                             update[j] = update[j].substring(update[j].lastIndexOf('/'));
                             if (update[j] == current[i] || comp_by_meta(current[i], des_folder[j])){
                             update.splice(j, 1);
                             des_folder.slice(j, 1);
                             des_size-=1;
                             }
                             }
                             }
                             //console.log(local_folder);
                             //console.log(current);
                             //console.log(update);
                             return done(null, current, update);
                             });
                             //console.log(results);

                             });
                             };
                             var comp_by_meta = function(local_file, des_file) {}

                             Object.size = function(obj) {
                             var size = 0, key;
                             for (key in obj) {
                             if (obj.hasOwnProperty(key)) size++;
                             }
                             return size;
                             };
                             comp_by_name_and_meta(path1,path2, function(err, current, update) {
                             if (err) throw err;
                             console.log('Nombre de fichier à mettre a jour : ' + Object.size(update));
                             for (var j = 0; j < Object.size(update); j++) {
                             console.log(update[j]);
                             };
                             console.log('\n');
                             console.log('Nombre de fichier communs : ' + Object.size(current));
                             for (var j = 0; j < Object.size(current); j++) {
                             console.log(current[j]);
                             };
                             });

                             }*/
                        }
                        ;

                        var file_test = new file_class();
//file_test.run();
//console.log("usb date :"+file_test._usb_date);
//console.log("usb date :"+file_test._usb_date[0]);
//console.log("cpu date :"+file_test._cpu_date);
//console.log("more recent :"+file_test._more_recent);
//file_test.copy_file("copy_test.txt");
//file_test.delete_file("copy_test.txt");
                        file_test.create_hidden_file(file_test._cpu_d_path);
