// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

// Affichage du formulaire de connexion
router.get("/login", authController.login);

// Connexion
router.post("/login", authController.authenticate);

// Déconnexion
router.get("/logout", authController.logout, usersController.redirectView);

// Formulaire d'inscription
router.get("/signup", authController.signup);

// Création du compte
router.post("/signup", authController.register, usersController.redirectView);

module.exports = router;
