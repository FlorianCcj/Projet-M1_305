// permet de mettre en place une operation non bloquante
var exec = require("child_process").exec;

function start() {
    console.log("Le gestionnaire 'start' est appelé.");
    var content = "vide";
    exec("ls -lah", function (error, stdout, stderr) {
        content = stdout;
    });
    return content;
}

function upload() {
    console.log("Le gestionnaire 'upload' est appelé.");
    return "Bonjour Upload";
}

exports.start = start;
exports.upload = upload;