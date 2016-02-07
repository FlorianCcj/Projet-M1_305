/**
 * Make by : Florian palmade
 * Date : 07.IV.2015
 */

var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        // recuperation de l'url
        var pathname = url.parse(request.url).pathname;
        console.log("Requête reçue pour le chemin " + pathname + ".");
        // envoie de l'url dans le fichier de routage
        route(handle, pathname);
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Démarrage du serveur.");
}

exports.start = start;