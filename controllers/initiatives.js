const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const viewResponse = require("../utils/viewResponse");
const Eduvent = require("../models/Eduvent");
const Initiative = require("../models/Initiative");

// @desc    get initiative
// @route   GET /initiatives/:id
exports.getInitiative = asyncHandler(async (req, res, next) => {
    var initiative = await Initiative.findById(req.params.id).populate("eduvents");

    viewResponse("initiative", { initiative, lang: req.lang }, res, next);
});