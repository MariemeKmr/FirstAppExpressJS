const express = require("express");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose"); // Ajout de Mongoose
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");

const app = express();

mongoose.connect( 
  "mongodb://localhost:27017/ai_academy", {
    useNewUrlParser: true 
  });

const db = mongoose.connection;
db.once("open", () => {
  console.log(" Connexion réussie à MongoDB en utilisant Mongoose !");
});
db.on("error", (err) => {
  console.error(" Erreur de connexion MongoDB :", err);
});

// Port
app.set("port", process.env.PORT || 3000);

// Moteur de template
app.set("view engine", "ejs");
app.use(layouts);

// Middleware formulaire
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sessions et messages flash
app.use(session({
  secret: 'aiacademysecret',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// Fichiers statiques
app.use(express.static("public"));

// Routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);
// Routes pour les abonnés 
app.get("/subscribers", subscribersController.getAllSubscribers); 
app.get("/subscribers/new", subscribersController.getSubscriptionPage); 
app.post("/subscribers/create", subscribersController.saveSubscriber); 
app.get("/subscribers/:id/edit", subscribersController.edit);
app.post("/subscribers/:id/update", subscribersController.update);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id", subscribersController.show);

// Erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Serveur
app.listen(app.get("port"), () => {
  console.log(` Le serveur écoute sur http://localhost:${app.get("port")}`);
});
