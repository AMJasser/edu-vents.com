const mongoose = require("mongoose");

var eduventSchema = new mongoose.Schema({ //eduvents schema
    name: String,
    type: String,
    imgPath: String,
    description: String,
    startDate: Date,
    endDate: Date,
    location: String,
    locationInfo: String,
    googleMaps: String,
    urltoapp: String,
    featuredUntil: Date,
    userId: String,
    clickCount: Number
});

module.exports = mongoose.model("Eduvent", eduventSchema); //exports