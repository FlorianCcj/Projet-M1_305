
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
    this._from_date = [];
    this._dest_date = [];
    this._from_d_path = "./usb";
    this._dest_d_path = "./cpu";
    this._more_recent;
    this._name_hidden_file = ".date_for_sync.ini";
};

file_class.prototype = {
    run: function () {
        this.determined_more_recent();
        this.compare();
        /**/        //this.create_hidden_file(this._from_d_path);
        /**/        //this.create_hidden_file(this._dest_d_path);
    },
    // bring se date in a hidden file
    date_from_file: function (path, dest_or_from) {
        var path_total = path + "/" + this._name_hidden_file;
        var stock_date;
        stock_date = fs.readFileSync(path_total);
        if (dest_or_from == "dest") {
            this._dest_date = stock_date;

            console.log("Taking date from " + path_total + " in destination path : " + this._dest_date);
        }
        if (dest_or_from == "from") {
            this._from_date = stock_date;
            console.log("Taking date from " + path_total + " in origine path : " + this._from_date);
        }
    },
    // switch the path if necessary
    determined_path: function () {
        console.log("Checking if the from directory is the more recent or not.");
        if (this._more_recent == "from") {
            console.log("The from directory is the more recent.");
        } else if (this._more_recent == "dest") {
            var tmp = this._from_d_path;
            this._from_d_path = this._dest_d_path;
            this._dest_d_path = tmp;
            this.determined_more_recent();
            console.log("The from directory is not the more recent we switch the path");
        }
    },
    // take 2 dates to know witch one is the more recent
    determined_more_recent: function () {
        this.date_from_file(this._from_d_path, "from");
        this.date_from_file(this._dest_d_path, "dest");
        if (this._from_date - this._dest_date > 0) {
            this._more_recent = "from";
            console.log("The more recent is : " + this._from_d_path);
        } else if (this._from_date - this._dest_date < 0) {
            this._more_recent = "dest";
            console.log("The more recent is : " + this._dest_d_path);
        }
        console.log();
        this.determined_path();
        console.log();
    },
    // copy a file from the less recent to the more one
    copy_file: function (file_name) {

        var cp = child.spawn("cp", ["-ruv", this._from_d_path + "/" + file_name, this._dest_d_path + "/" + file_name]);

        cp.stdout.on("data", function (data) {
            console.log("stdout copying : " + data);
        });

        cp.stderr.on("data", function (e) {
            console.log(e.toString());
        });
    },
    // delete a file from the less recent
    delete_file: function (file_name) {

        var rm = child.spawn("rm", ["-rv", this._dest_d_path + "/" + file_name]);

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
        fs.writeFile(path + this._name_hidden_file, new Date().valueOf(), function (err) {
            if (err) {
                console.log(err);
            }
        });
    },
    // list the entire path of a folder (even ./) and all the name of the file in it
    ls_relative_file: function (path) {
        fs.readdir(path, function (err, files) {
            console.log("\ncreate_list working directory : " + "\n" + path + "\n");
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
            var create_listFile = path + '/' + files[i];
            var stats = fs.statSync(create_listFile);
            if (stats.isFile()) {
                console.log(create_listFile);
            }
            else if (stats.isDirectory()) {
                exploreSystem(create_listFile);
            }
        }
    },
    //update_list_check: function (file1, file2) {
    //    var a = fs.stat(file1, function (err, stats) {
    //        if (err) {
    //            console.log(err);
    //        }
    //        console.log('    ' + file1);
    //        if (stats.isFile()) {
    //            console.log('    file:          ' + (stats.mode & 0100000 ? 'f' : '-'));
    //        }
    //        if (stats.isDirectory()) {
    //            console.log('    directory:      ' + (stats.mode & 0040000 ? 'd' : '-'));
    //        }
    //        console.log('    size:          ' + stats.size + ' octets');
    //        console.log('    mtime:         ' + stats.mtime);
    //        console.log();
    //    });
    //    var b = fs.stat(file2, function (err, stats) {
    //        if (err) {
    //            console.log(err);
    //        }
    //        console.log('    ' + file2);
    //        if (stats.isFile()) {
    //            console.log('    file:          ' + (stats.mode & 0100000 ? 'f' : '-'));
    //        }
    //        if (stats.isDirectory()) {
    //            console.log('    directory:      ' + (stats.mode & 0040000 ? 'd' : '-'));
    //        }
    //        console.log('    size:          ' + stats.size + ' octets');
    //        console.log('    mtime:         ' + stats.mtime);
    //        console.log();
    //    });
    //},
    // return the difference between 2 directory
    compare: function () {

        // put the list of the file in an array
        var file_array = function (dir, done) {

            var return_array = [];
            var metadata_array = [];

            fs.readdir(dir, function (err, file_list) {
                if (err) return done(err);
                var i = 0;
                (function next() {
                    var file = file_list[i++];
                    if (!file) return done(null, return_array);
                    var file_path = dir + '/' + file;
                    fs.stat(file_path, function (err, stat) {
                        return_array.push(file);
                        metadata_array.push(file_path);

                        // Si présence de dossier y accede et liste les fichies présents
                        if (stat && stat.isDirectory()) {
                            metadata_array.push(meta(stat, file_path));
                            // Sinon push le fichier ds le tableau
                        } else {
                            metadata_array.push(meta(stat, file_path));
                            next();
                        }
                    });
                })();
            });
        };
        var meta = function (stat, results) {
            var met = {
                'size': stat.size,
                'ctime': stat.ctime,
                'mtime': stat.mtime
            };
            results.concat(met);
            return met;
        };
        var comp_by_name_and_meta = function (from_d_path, dest_d_path, done) {

            file_array(from_d_path, function (err, from_directory) {
                if (err) throw err;

                var create_list = [];
                var delete_list = [];
                var update_list = [];

                file_array(dest_d_path, function (err, dest_directory) {

                    if (err) throw err;

                    var from_directory_size = Object.size(from_directory);
                    var dest_directory_size = Object.size(dest_directory);

                    for (var ic = 0; ic < from_directory_size; ic++) {
                        create_list.push(from_directory[ic]);
                        create_list[ic] = create_list[ic].substring(create_list[ic].lastIndexOf('/'));
                    }

                    for (var jc = 0; jc < dest_directory_size; jc++) {
                        delete_list.push(dest_directory[jc]);
                        delete_list[jc] = delete_list[jc].substring(delete_list[jc].lastIndexOf('/'));
                    }

                    for (var i = 0; i < from_directory_size; i++) {

                        for (var j = 0; j < dest_directory_size; j++) {

                            if (dest_directory[j] == from_directory[i]) {

                                delete_list.splice(j, 1);
                                delete_list[i] = delete_list[i].substring(delete_list[i].lastIndexOf('/'));

                                create_list.splice(j, 1);

                                update_list.push(from_directory[i]);
                                update_list[i] = update_list[i].substring(update_list[i].lastIndexOf('/'));
                            }
                        }
                    }
                    return done(null, create_list, delete_list, update_list);
                });
            });
        };
        var comp_by_meta = function (local_file, des_file) {
        };
        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        comp_by_name_and_meta(this._from_d_path, this._dest_d_path, function (err, create_list, delete_list, update_list) {
            if (err) throw err;

            var to_sync = new file_class();
            console.log("Redetermined the more recent to_sync \n");
            to_sync.determined_more_recent();

            console.log('Nombre de fichier supprimés : ' + Object.size(delete_list));
            for (var i = 0; i < Object.size(delete_list); i++) {
                to_sync.delete_file(delete_list[i]);
                console.log(delete_list[i]);
            }

            console.log('\n');
            console.log('Nombre de fichier créés : ' + Object.size(create_list));
            for (var j = 0; j < Object.size(create_list); j++) {
                to_sync.copy_file(create_list[j]);
                console.log(create_list[j]);
            }

            console.log('\n');
            console.log('Nombre de fichier mis à jour : ' + Object.size(update_list));
            for (var k = 0; k < Object.size(update_list); k++) {
                to_sync.delete_file(update_list[k]);
                to_sync.copy_file(update_list[k]);
                console.log(update_list[k]);
            }

        });

    }
};

var file_test = new file_class();
file_test.run();

// README
// ----- faire fonctionner la detection de clé -----
// décommenter la ligne 53 et 54
// commenter la ligne 355 et 356
// ----- faire fonctionner la synchronisation ----
// commenter la ligne 53 et 54
// décommenter la ligne 355 et 356
// dans var file_class = function () changer les variable pour donner le chemin
// creer les 2 fichier caché (indispensable)
// lancer le fichier
// N.B. : pour juste afficher la liste des modifications mettre en commentaire toute les lignes ou il y a to_sync


// a gerer :
// - si les 2 dates sont égales
// - si le fichier caché n'existe pas
// - si une des listes est vide