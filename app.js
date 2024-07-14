if (process.env.NODE_ENV != "production") {
    require('dotenv').config(); 
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash  = require("connect-flash");
// config passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// NOW MONGOO IS CONNECTIONG WITH mongo atlas db
const dbUrl = process.env.ATLASDB_URL;
main().then(() =>{

    console.log("connected to db");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    // if session m update ni hua then store it,s info after 24 hour
    // in seconds
   touchAfter : 24 * 3600,
});

// if any error, store
store.on("error", () =>{
console.log("Error in mongo session store",err);
});

const sessionOptions = {
    // mongo store , going on session
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        // session ke sth send kiya date ko
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// mongo- store, create new mongostore



// use sessions
app.use(session(sessionOptions));
app.use(flash());

// passport uses sesseion
app.use(passport.initialize());
// so website can know for single website it has same user or not who is vising for different web pages
app.use(passport.session());
// we want to adopt our local strategy 
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware 
app.use((req, res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
res.locals.currUser =  req.user;
    next();
});
app.use("/listings", listingRouter);
// parent route
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*",(res,req,next) =>{
    next(new ExpressError(404, "Page not Found!"));
});




// error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    // Check if it's a 404 error and redirect to /listings
    if (statusCode === 404) {
        return res.redirect('/listings');
    }

    res.status(statusCode).render("error.ejs", { message });
});



// app.use((err, req,res, next) =>{
//     let {statusCode = 500, message = "Something went wrong!"} = err;
//     res.status(statusCode).render("error.ejs", {message});

// });

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});


