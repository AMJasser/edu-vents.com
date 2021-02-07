const express = require("express");
const asyncHandler = require("../middleware/async");
const viewResponse = require("../utils/viewResponse");
const lang = require("../middleware/lang");
const Eduvent = require("../models/Eduvent");
const Initiative = require("../models/Initiative");

const router = express.Router({ mergeParams: true });

router.use(lang);

router.get("/", asyncHandler(async (req, res, next) => {
    const eduvents = await Eduvent.find({ featured: true }).populate("initiative").sort({ clickCount: -1 });

    viewResponse("index", { eduvents, msg: req.query.msg || undefined, lang: req.lang }, res, next);
}));

module.exports = router;