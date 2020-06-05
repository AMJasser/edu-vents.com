const express        = require("express"); //dependency that I did not develop
const app            = express();
const bodyParser     = require("body-parser"); //dependency that I did not develop
const mongoose       = require("mongoose"); //dependency that I did not develop
const Eduvent        = require("./models/eduvent");
const EduventAr      = require("./models/eduventAr");
const methodOverride = require("method-override"); //dependency that I did not develop
const ua             = require('universal-analytics'); //dependency that I did not develop
const helmet         = require("helmet");


mongoose.connect("mongodb://localhost:27017/EDU-vents", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }); //DB connection
app.use(bodyParser.urlencoded({ extended: true })); //parsing setup
app.set("view engine", "ejs"); //setting a view engine
app.use(express.static(__dirname + "/public")); //setting directory
app.use(methodOverride("_method")); //setting up HTTP Method Override
app.use(helmet());
var visitor = ua("UA-151935099-1"); //Google Analytics

function escapeRegex(text) { //function to escape Regex (Regex injection attack)
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function feat(Eduvents) {
    const now = new Date; //today date
    var target; //initializing event date
    var featured = []; //initializing featured events array
    var notFeatured = []; //initializing non-featured events array

    Eduvents.forEach(function (eduvent) { //loop through all DB documents
        target = new Date(eduvent.featuredUntil); //setting target date to event date
        if (now < target) { //checking if event is still featured
            featured.push(eduvent);
        } else { //then it is not feautred...
            notFeatured.push(eduvent);
        };
    });

    return { featured: featured, notFeatured: notFeatured };
}

app.get("/", async function (req, res) { //english
    try {
        var allEduvents = await Eduvent.find(); //getting data from DB
        const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
        res.render("en/home", { featured: Eduvents.featured }, function(err, html) {
            if (err) {
                console.log(err);
                res.render("error", {error: err});
            } else {
                res.send(html);
            }
        }); //render page
    } catch (err) { //error handling
        console.log(err);
        res.render("error");
    }
});

app.get("/ar", async function (req, res, next) { //arabic
    try {
        var allEduvents = await EduventAr.find(); //getting data from DB
        const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
        res.render("ar/home", { featured: Eduvents.featured }, function(err, html) {
            if (err) {
                console.log(err);
                res.render("error", {error: err});
            } else {
                res.send(html);
            }
        }); //render page
    } catch (err) { //error handling
        console.log(err);
        res.render("error");
    }
});

app.get("/edu-vents", async function (req, res, next) { //english
    if (req.query.type) { //if request is a query...
        if (req.query.query === "") { //checking if escape regex is required
            var queryName = req.query.query;
        } else {
            var queryName = new RegExp(escapeRegex(req.query.query), "gi");
        }

        try {
            var search = { //initializing query variable
                name: queryName,
                type: req.query.type,
                location: req.query.location,
            };

            if (search.name === "") { //removing empty/default value variables
                delete search.name;
            };

            if (search.type === "Any") { //removing empty/default value variables
                delete search.type;
            };

            if (search.location === "Any") { //removing empty/default value variables
                delete search.location;
            };

            var allEduvents = await Eduvent.find(search); //getting data from DB
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("en/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.log(err);
            res.render("error");
        }
    } else {
        try {
            var allEduvents = await Eduvent.find(); //getting data from DB
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("en/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.log(err);
            res.render("error");
        }
    };
});

app.get("/ar/edu-vents", async function (req, res, next) { //arabic
    if (req.query.type) { //if request is a query...
        if (req.query.query === "") { //checking if escape regex is required
            var queryName = req.query.query;
        } else {
            var queryName = new RegExp(escapeRegex(req.query.query), "gi");
        }

        try {
            var search = { //initializing query variable
                name: queryName,
                type: req.query.type,
                location: req.query.location,
            };

            if (search.name === "") { //removing empty/default value variables
                delete search.name;
            };

            if (search.type === "Any") { //removing empty/default value variables
                delete search.type;
            };

            if (search.location === "Any") { //removing empty/default value variables
                delete search.location;
            };

            var allEduvents = await EduventAr.find(search); //getting data from DB
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("ar/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.log(err);
            res.render("error");
        }
    } else {
        try {
            var allEduvents = await EduventAr.find(); //getting data from DB
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("ar/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.log(err);
            res.render("error");
        }
    };
});

app.get("/edu-vents/en/:id", async function(req, res) {
    try {
        var eduvent = await Eduvent.findById(req.params.id);
        res.render("en/view", {eduvent}, function(err, html) {
            if (err) {
                console.log(err);
                res.render("error", {error: err});
            } else {
                res.send(html);
            }
        });
    } catch(err) {
        console.log(err);
        res.render("error");
    }
});

app.get("/edu-vents/ar/:id", async function(req, res) {
    try {
        var eduvent = await EduventAr.findById(req.params.id);
        res.render("ar/view", {eduvent}, function(err, html) {
            if (err) {
                console.log(err);
                res.render("error", {error: err});
            } else {
                res.send(html);
            }
        });
    } catch(err) {
        console.log(err);
        res.render("error");
    }
});

app.get("/edu-vents/en/:id/attend", async function(req, res) {
    try {
        var eduvent = await Eduvent.findById(req.params.id);
        res.redirect(eduvent.urltoapp);
        if (eduvent.clickCount === undefined) {
            eduvent.clickCount = 1;
        } else {
            eduvent.clickCount ++;
        }
        eduvent.save();
    } catch(err) {
        console.log(err);
        res.render("error");
    }
});

app.get("/edu-vents/ar/:id/attend", async function(req, res) {
    try {
        var eduvent = await EduventAr.findById(req.params.id);
        res.redirect(eduvent.urltoapp);
        if (eduvent.clickCount === undefined) {
            eduvent.clickCount = 1;
        } else {
            eduvent.clickCount ++;
        }
        eduvent.save();
    } catch(err) {
        console.log(err);
        res.render("error");
    }
});

app.get("/apply", function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<head><title>EDU-vents Volunteer Application</title><link rel="icon" href="/images/seco.ico"><meta http-equiv="refresh" content="5; URL=https://docs.google.com/forms/d/e/1FAIpQLSfmrsYymzoh_19vFBsK1aTUqcD4JFdfFYrqKalm8GuTbHJYqg/viewform?usp=sf_link/" /></head><body><h1>Redirecting...</h1><a href="https://docs.google.com/forms/d/e/1FAIpQLSfmrsYymzoh_19vFBsK1aTUqcD4JFdfFYrqKalm8GuTbHJYqg/viewform?usp=sf_link/">if you are not redirected please click here</a></body>');
    res.end();
    visitor.pageview("/apply").send();
});

app.get("*", function (req, res) { //english 404
    res.render("error", { error: "404    Page Not Found" });
});

app.get("/ar/*", function (req, res) { //arabic 404
    res.render("error", { error: "404    الصفحة لم يعثر عليها" });
});

app.listen(8080, () => { //setting port to listen to
    console.log("EDU-vents server started");
});