const express = require("express");
const lang = require("../middleware/lang");
const { 
    getInitiative
} = require("../controllers/initiatives");

const router = express.Router({ mergeParams: true });

router.use(lang);

router.get("/:id", getInitiative);

module.exports = router;