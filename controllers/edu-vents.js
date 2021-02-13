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

// @desc    get edu-vent
// @route   GET /edu-vents/:id
exports.getEduvent = asyncHandler(async (req, res, next) => {
    var eduvent = await Eduvent.findById(req.params.id).populate({ path: "initiative" });

    viewResponse("edu-vent", { eduvent, lang: req.lang }, res, next);
});

// @desc    counting number of attendees
// @route   GET /edu-vents/:id/attend
exports.attend = asyncHandler(async (req, res, next) => {
    var eduvent = await Eduvent.findById(req.params.id);

    if (!eduvent) {
        return next(new ErrorResponse(`Edu-vent with id ${req.params.id} not found`, 404));
    }

    eduvent.clickCount++;
    eduvent.save();

    res.redirect(eduvent.url);
});