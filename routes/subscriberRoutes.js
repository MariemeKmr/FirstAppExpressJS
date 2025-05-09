// routes/subscriberRoutes.js
const express = require("express");
const router = express.Router();
const subscribersController = require("../controllers/subscribersController");

router.get("/", subscribersController.getAllSubscribers);
router.get("/new", subscribersController.getSubscriptionPage);
router.post("/create", subscribersController.saveSubscriber);
router.get("/:id", subscribersController.show);
router.get("/:id/edit", subscribersController.edit);
router.post("/:id/update", subscribersController.update);
router.post("/:id/delete", subscribersController.deleteSubscriber);

module.exports = router;