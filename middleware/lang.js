const lang = (req, res, next) => {
    req.lang = req.params.lang || "en";

    next();
};

module.exports = lang;