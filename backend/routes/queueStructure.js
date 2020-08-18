const express = require("express");

const isAuth = require("../middleware/is-auth");
//const shopValidation = require("../validation/shopValidation");
const queueStructureController = require("../controllers/queueStructure");

const router = express.Router();

// to retrieve  queue structures of different stages for a specific shop
// http://localhost:8080/queueStructure/:shopId
router.get("/:shopId", queueStructureController.getQueueStructures);

module.exports = router;
