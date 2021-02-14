const advancedQuery = (req, res, next) => {
    Object.keys(req.query).forEach(function(field) {
        if (req.query[field] === "Any") {
            delete req.query[field];
        }
    });

    next();
}

module.exports = advancedQuery;