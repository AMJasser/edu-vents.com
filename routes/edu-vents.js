const express = require("express");
const lang = require("../middleware/lang");
const { 
    getEduvents,
    getEduvent,
    attend
} = require("../controllers/edu-vents");

const router = express.Router({ mergeParams: true });

router.use(lang);

router.get("/", getEduvents);
router.get("/:id", getEduvent);
router.get("/:id/attend", attend);

module.exports = router;