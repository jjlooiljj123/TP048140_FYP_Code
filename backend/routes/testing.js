const express = require("express");

const testingController = require("../controllers/testing");

const router = express.Router();

router.get("/", testingController.testingDate);

module.exports = router;
