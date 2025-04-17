const Subscriber = require("../models/Subscriber");

exports.getAllSubscribers = (req, res, next) => {
    const searchQuery = req.query.q;
    let query = {};

    if (searchQuery) {
        const regex = new RegExp(searchQuery, "i");
        const isZip = /^\d+$/.test(searchQuery);

        query = isZip
            ? {
                zipCode: parseInt(searchQuery)
            }
            : {
                name: regex
            };
    }

    Subscriber
        .find(query)
        .exec()
        .then(subscribers => {
            res.render("subscribers/index", {
                pageTitle: "Liste des abonnés",
                subscribers: subscribers,
                searchQuery: searchQuery || ""
            });
        })
        .catch(error => {
            console.log(`Erreur recherche abonnés : ${error.message}`);
            next(error);
        });
};

exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/new", {
        pageTitle: "S'abonner à la newsletter",
    });
};

exports.saveSubscriber = (req, res) => {
    const {name, email, zipCode} = req.body;

    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push("Le nom est requis.");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Une adresse email valide est requise.");
    }

    if (!zipCode || isNaN(zipCode) || zipCode.length !== 5) {
        errors.push("Un code postal valide à 5 chiffres est requis.");
    }

    if (errors.length > 0) {
      req.session.flash = {
          type: "error",
          message: errors.join(" ") // Combine toutes les erreurs en une seule chaîne
      };
      return res.redirect("/subscribers/new");
  }

    const newSubscriber = new Subscriber({name, email, zipCode});

    newSubscriber
        .save()
        .then(() => {
            res.render("subscribers/thanks", {pageTitle: "Merci pour votre inscription"});
        })
        .catch(error => {
            console.log("Erreur lors de l’enregistrement :", error.message);
            req.session.flash = {
                type: "error",
                message: "Erreur lors de l’enregistrement de l’abonné."
            };
            res.redirect("/subscribers/new");
        });
};

exports.show = (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber
        .findById(subscriberId)
        .then(subscriber => {
            res.render("subscribers/show", {
                pageTitle: "Détails de l'abonné",
                subscriber: subscriber
            });
        })
        .catch(error => {
            console.log(
                `Erreur lors de la récupération d'un abonné par ID: ${error.message}`
            );
            next(error);
        });
};

exports.deleteSubscriber = (req, res, next) => {
    const subscriberId = req.params.id;

    Subscriber
        .findByIdAndDelete(subscriberId)
        .then(() => {
            req.session.flash = {
                type: "success",
                message: "Abonné supprimé avec succès."
            };
            res.redirect("/subscribers");
        })
        .catch(error => {
            console.log(`Erreur lors de la suppression de l'abonné : ${error.message}`);
            next(error);
        });
};

// Afficher le formulaire de modification
exports.edit = (req, res, next) => {
    const subscriberId = req.params.id;
    Subscriber
        .findById(subscriberId)
        .then(subscriber => {
            if (subscriber) {
                res.render("subscribers/edit", {
                    subscriber: subscriber,
                    pageTitle: "Modifier un abonné"
                });
            } else {
                next();
            }
        })
        .catch(error => {
            console.log(`Erreur récupération abonné à modifier : ${error.message}`);
            next(error);
        });
};
//
// Enregistrer les modifications
exports.update = (req, res, next) => {
    const subscriberId = req.params.id;
    const updatedSubscriber = {
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    };

    Subscriber
        .findByIdAndUpdate(subscriberId, {
            $set: updatedSubscriber
        }, {new: true})
        .then(subscriber => {
            req.session.flash = {
                type: "success",
                message: "Abonné mis à jour avec succès !"
            };
            res.redirect(`/subscribers/${subscriber._id}`);
        })
        .catch(error => {
            console.log(`Erreur mise à jour abonné : ${error.message}`);
            next(error);
        });
};
