const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

// listing validation
const valiadteListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new and create route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  isLoggedIn,
  valiadteListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    let { _id }=await newListing.save();
    req.flash("success", "New Listing Saved"); //create flash for temporory message
    res.redirect(`/listings/${_id}`);
  })
);

// edit and update route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "The listing you are requesting does not exits");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  valiadteListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "The listing you are requesting does not exits");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = router;
