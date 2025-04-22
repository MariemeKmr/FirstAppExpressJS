const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const authController = require("./controllers/authController");

const app = express();

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", () => console.log("Connexion réussie à MongoDB en utilisant Mongoose!"));
db.on("error", err => console.error("Erreur MongoDB :", err));

// Configuration Express
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Cookies & Sessions
app.use(cookieParser("secret_passcode"));
app.use(session({
  secret: "secret_passcode",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 4000000 }
}));

// Flash & Auth
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
const User = require("./models/User");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Variables globales dans toutes les vues
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// ======================== ROUTES ========================

// Pages principales
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);

// Authentification
app.get("/login", authController.login);
app.post("/login", authController.authenticate);
app.get("/logout", authController.logout, usersController.redirectView);
app.get("/signup", authController.signup);
app.post("/signup", authController.register, usersController.redirectView);

// Abonnés
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/:id", subscribersController.show);
app.get("/subscribers/:id/edit", subscribersController.edit);
app.post("/subscribers/:id/update", subscribersController.update);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);

// Utilisateurs (inscription ouverte)
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);

// Utilisateurs (protégées)
app.use("/users", authController.ensureLoggedIn); // protection globale
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

// Cours (publics et protégés)
app.get("/courses/index", coursesController.index, coursesController.indexView);
app.post("/courses/create", coursesController.create, coursesController.redirectView);
app.get("/courses/:id", coursesController.show, coursesController.showView);

// Cours (protégées)
app.use("/courses/new", authController.ensureLoggedIn);
app.use("/courses/:id/edit", authController.ensureLoggedIn);

app.get("/courses/new", coursesController.new);
app.get("/courses/:id/edit", coursesController.edit);
app.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
app.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
app.post("/courses/:id/register", coursesController.enroll);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Lancement serveur
app.listen(app.get("port"), () => {
  console.log(`Le serveur est lancé sur http://localhost:${app.get("port")}`);
});
