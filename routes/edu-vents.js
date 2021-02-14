const express = require("express");
const { 
    getEduvents,
    getEduvent,
    attend
} = require("../controllers/edu-vents");

const lang = require("../middleware/lang");
const advancedQuery = require("../middleware/advancedQuery");

const router = express.Router({ mergeParams: true });

router.use(lang);

router.get("/", advancedQuery, getEduvents);
router.get("/:id", getEduvent);
router.get("/:id/attend", attend);

module.exports = router;