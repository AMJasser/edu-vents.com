const express = require("express");
const lang = require("../middleware/lang");
const { 
    getEduvents
} = require("../controllers/edu-vents");

const router = express.Router({ mergeParams: true });

router.use(lang);

router.get("/", getEduvents);

module.exports = router;