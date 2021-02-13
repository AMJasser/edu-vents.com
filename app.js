const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const methodOverride = require("method-override");
const path = require("path");
const errorHandler = require("./middleware/error");
const connectDb = require("./config/db");

// Load ENV vars
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDb();

// Route files
const index = require("./routes/index");
const eduvents = require("./routes/edu-vents");
const initiatives = require("./routes/initiatives");

const app = express();

// Set view engine
app.set("view engine", "ejs");

// Body parser
app.use(express.urlencoded({ extended: true }));

// Method Override
app.use(methodOverride("_method"));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/:lang([a-z]{2})?/", index);
app.use("/:lang([a-z]{2})?/edu-vents/", eduvents);
app.use("/:lang([a-z]{2})?/initiatives/", initiatives);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.bold.cyan));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});