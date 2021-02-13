const express = require("express");
const asyncHandler = require("../middleware/async");
const viewResponse = require("../utils/viewResponse");
const lang = require("../middleware/lang");
const Initiative = require("../models/Initiative");

const router = express.Router({ mergeParams: true });

router.use(lang);

router.get("/", asyncHandler(async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();

    const initiative = await Initiative.findOne({ slug });

    if (!initiative) {
        return viewResponse("error", { error: "Error 404" }, res, next);
    }

    res.redirect("/" + req.lang + "/initiatives/" + initiative._id);
}));

module.exports = router;