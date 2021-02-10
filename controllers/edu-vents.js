const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const types = require("../utils/types");
const viewResponse = require("../utils/viewResponse");
const Eduvent = require("../models/Eduvent");
const Initiative = require("../models/Initiative");

// @desc    get edu-vents
// @route   GET /edu-vents
exports.getEduvents = asyncHandler(async (req, res, next) => {
    var eduvents = await Eduvent.find().populate({ path: "initiative" }).sort({ clickCount: -1 });

    viewResponse("edu-vents", { eduvents, types, lang: req.lang }, res, next);
});