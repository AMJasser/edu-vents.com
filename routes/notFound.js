const express = require("express");
const asyncHandler = require("../middleware/async");
const viewResponse = require("../utils/viewResponse");

const router = express.Router();

router.get("/", asyncHandler(async (req, res, next) => {
    viewResponse("error", { error: "Error 404" }, res, next);
}));

module.exports = router;