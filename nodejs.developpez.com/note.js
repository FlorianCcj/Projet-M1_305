// creer le serveur
function exemple_createServer() {
    http.createServer(function (request, response) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    }).listen(8888);
}
// les fonctions parametrables
function exemple_fonctione_parametrable() {
    function say(word) {
        console.log(word);
    }

    function execute(someFunction, value) {
        someFunction(value);
    }

    execute(say, "Hello");
}
// onRequest
function exemple_onRequest() {
    var http = require("http");

    function onRequest(request, response) {
        console.log("Requête reçue.");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Démarrage du serveur.");
    // Notez l'utilisation de console.log() pour afficher un message dès que onRequest (notre fonction de rappel) est appelée et un autre juste après avoir démarré le serveur.
    // Quand nous lançons ce code (node server.js, comme d'habitude), il va aussitôt afficher « Démarrage du serveur. » dans la console. Dès que nous appelons notre serveur (en ouvrant une page à l'adresse http://localhost:8888), le message « Requête reçue. » s'affiche à son tour.
}
// recuperation de donnee dans l'url
function exemple_recup_url() {
    // Dans un url on peut recuperer toutes les donnees
    // http://localhost:8888/start?foo=bar&hello=world

    // mise en forme requete : retour

    // start? : url.parse(string).pathname
    // foo=bar&hello=world : url.parse(string).query
    // querystring(string)["foo"] : bar
    // querystring(string)["hello"] : world

    var http = require("http");
    var url = require("url");

    function start() {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            console.log("Requête reçue pour le chemin " + pathname + ".");
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("Hello World");
            response.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log("Démarrage du serveur.");
    }

    exports.start = start;
}


function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
sleep(10000);