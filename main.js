const express = require("express");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

const app = express();

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy");


const db = mongoose.connection;
db.once("open", () => console.log(" Connexion réussie à MongoDB !"));
db.on("error", (err) => console.error(" Erreur MongoDB :", err));

// Configuration
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sessions + flash messages
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

// Middleware method-override
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

// ========================
// ROUTES
// ========================

// Pages principales
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);

// Abonnés
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/:id/edit", subscribersController.edit);
app.post("/subscribers/:id/update", subscribersController.update);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id", subscribersController.show);

// Utilisateurs
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);


// Cours
app.get("/courses/index", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.new);
app.post("/courses/create", coursesController.create, coursesController.redirectView);
app.get("/courses/:id", coursesController.show, coursesController.showView);
app.get("/courses/:id/edit", coursesController.edit);
app.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
app.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
app.post("/courses/:id/register", coursesController.enroll);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Lancement serveur
app.listen(app.get("port"), () => {
  console.log(` Le serveur est lancé sur http://localhost:${app.get("port")}`);
});
