// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");
const authController = require("../controllers/authController");

router.get("/index", coursesController.index, coursesController.indexView);
router.get("/new", authController.ensureLoggedIn, coursesController.new);
router.post("/create", authController.ensureLoggedIn, coursesController.create, coursesController.redirectView);
router.get("/:id", coursesController.show, coursesController.showView);
router.get("/:id/edit", authController.ensureLoggedIn, coursesController.edit);
router.put("/:id/update", authController.ensureLoggedIn, coursesController.update, coursesController.redirectView);
router.delete("/:id/delete", authController.ensureLoggedIn, coursesController.delete, coursesController.redirectView);
router.post("/:id/register", authController.ensureLoggedIn, coursesController.enroll);

module.exports = router;