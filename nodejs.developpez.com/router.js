function route(handle, pathname) {
    console.log("Début du traitement de l'URL " + pathname + ".");
    // si il y a un gestionnaire d'url
    if (typeof handle[pathname] === 'function') {
        handle[pathname]();
    } else {
        console.log("Aucun gestionnaire associé à " + pathname);
    }
}

exports.route = route;