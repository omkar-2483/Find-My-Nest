const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require('./routes/listings.js');
const review = require('./routes/review.js');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); //to parse data
app.set("view engine", "ejs"); //set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); //set ejs engine
app.use(express.static(path.join(__dirname, "/public"))); //serve static files

//connect database
const MONGO_URL = "mongodb://127.0.0.1:27017/homeheavens";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//associate session
const sessionOptions ={
  secret: "mysecretecode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000,  //after 7*24*60*60*1000 ms from now i.e. 7 days
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
};

//home route
app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.use(session(sessionOptions));
app.use(flash());

//create res.local variable
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

// all listings routes
app.use('/listings',listings);

//all review routes
app.use('/listings/:id/reviews',review);

//invalid page request
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message)
});

app.listen(8080, () => {
  console.log(`Server ruuning on http://localhost:8080`);
});
