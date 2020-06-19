const express        = require("express"); //dependency that I did not develop
const app            = express();
const bodyParser     = require("body-parser"); //dependency that I did not develop
const mongoose       = require("mongoose"); //dependency that I did not develop
const fs             = require("fs");
const path           = require("path")
const Eduvent        = require("./models/eduvent");
const EduventAr      = require("./models/eduventAr");
const Type           = require("./models/type");
const Location       = require("./models/location");
const Form           = require("./models/form");
const methodOverride = require("method-override"); //dependency that I did not develop
const ua             = require('universal-analytics'); //dependency that I did not develop
const helmet         = require("helmet");
const multer         = require("multer");
const cookieParser   = require("cookie-parser");


mongoose.connect("mongodb://localhost:27017/EDU-vents", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).catch(error => { console.log(error) }); //DB connection
app.use(bodyParser.urlencoded({ extended: true })); //parsing setup
app.set("view engine", "ejs"); //setting a view engine
app.use(express.static(__dirname + "/public")); //setting directory
app.use(methodOverride("_method")); //setting up HTTP Method Override
app.use(helmet());
app.use(cookieParser());
var visitor = ua("UA-151935099-1"); //Google Analytics

const anyStorage = multer.diskStorage({
    destination: "./public/form uploads/",
    filename: function (req, file, cb) {
        var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var id = "";
        for (var i = 0; i < 10; i++) {
            id += char_list.charAt(Math.floor(Math.random() * 62));
        }
        cb(null, Date.now() + "-" + id + path.extname(file.originalname));
    }
});
const anyUpload = multer({ storage: anyStorage }).any();

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
        if (typeof req.query.msg !== "undefined") {
            res.render("en/home", { featured: Eduvents.featured, msg: req.query.msg }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } else {
            res.render("en/home", { featured: Eduvents.featured }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        }
    } catch (err) { //error handling
        console.error(err);
        res.status(500).render("error");
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
        console.error(err);
        res.status(500).render("error");
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
            var types = await Type.find();
            var locations = await Location.find();
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("en/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured, types: types, locations: locations }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.error(err);
        res.status(500).render("error");
        }
    } else {
        try {
            var allEduvents = await Eduvent.find(); //getting data from DB
            var types = await Type.find();
            var locations = await Location.find();
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("en/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured, types: types, locations: locations }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.error(err);
            res.status(500).render("error");
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
            var types = await Type.find();
            var locations = await Location.find();
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("ar/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured, types: types, locations: locations }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.error(err);
            res.status(500).render("error");
        }
    } else {
        try {
            var allEduvents = await EduventAr.find(); //getting data from DB
            var types = await Type.find();
            var locations = await Location.find();
            const Eduvents = feat(allEduvents); //function to discriminate featured and non-featured
            res.render("ar/index", { featured: Eduvents.featured, notFeatured: Eduvents.notFeatured, types: types, locations: locations }, function(err, html) {
                if (err) {
                    console.log(err);
                    res.render("error", {error: err});
                } else {
                    res.send(html);
                }
            }); //render page
        } catch (err) { //error handling
            console.error(err);
            res.status(500).render("error");
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
        console.error(err);
        res.status(500).render("error");
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
        console.error(err);
        res.status(500).render("error");
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
        console.error(err);
        res.status(500).render("error");
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
        console.error(err);
        res.status(500).render("error");
    }
});

app.get("/forms/:url", async function(req, res) {
    try {
        var form = await Form.findOne({ url: req.params.url });
        for (var i=0; i < form.responses.length; i++) {
            if (req.cookies["fid"] === form.responses[i].fid) {
                var result = true;
                var response = form.responses[i];
            }
        }

        if (result === true) {
            res.send("<h1>you've already submitted the form</h1><a href='/'>Click Here To Go Back</a>");
        } else {
            if (form.isOpen === true && new Date() < form.endDate) {
                res.render("form", {form: form}, function(err, html) {
                    if (err) {
                        console.log(err);
                        res.render("error", {error: err});
                    } else {
                        res.send(html);
                    }
                });
            } else {
                res.send("<h1>The form is not open</h1>");
            }
        }
    } catch(err) {
        console.error(err);
        res.status(500).render("error");
    }
});

app.post("/forms/:url", anyUpload, async function(req, res) {
    try {
        var form = await Form.findOne({url: req.params.url});
        var fid = req.body.fid;
        delete req.body.fid;
        var entries = Object.entries(req.body);
        var files = [];
        for (var i = 0; i < entries.length; i++) {
            for (var e = 0; e < entries[i].length; e++) {
                if (typeof entries[i][e] === "object") {
                    entries[i][e] = entries[i][e].join(", ");
                }
            }
        }
        req.files.forEach(function (file) {
            files.push([file.fieldname, file.filename]);
        });
        var response = {
            QandA: entries,
            files: files,
            fid: fid,
        }
        form.responses.push(response);
        form.save();
        res.redirect("/?msg=Submitted Successfully");
    } catch(err) {
        console.error(err);
        res.status(500).render("error");
    }
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