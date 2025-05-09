const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const apiRoutes = require("./apiRoutes");
const homeRoutes = require("./homeRoutes");
const errorRoutes = require("./errorRoutes");

// Routes spécifiques
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/api", apiRoutes);

// Routes publiques (accueil, à propos, contact, etc.)
router.use("/", homeRoutes);

// Routes d'authentification (login, signup, logout)
router.use("/", authRoutes);

// Gestion des erreurs (à mettre tout à la fin)
router.use("/", errorRoutes);

module.exports = router;
