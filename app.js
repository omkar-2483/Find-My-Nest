const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMAte = require('ejs-mate');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true})) //to parse data
app.set("view engine", "ejs");  //set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("ejs",ejsMAte);  //set ejs engine
app.use(express.static(path.join(__dirname,"/public")));  //serve static files

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

app.get("/", (req, res) => {
  res.send("hello from backend");
});

// app.get('/testListing', async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description: "By the beach",
//         price : 1200,
//         location : "Bengluru, Karnataka",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("successful testing")
// });

//index route
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new and create route
app.get('/listings/new',(req,res)=>{
    res.render("listings/new.ejs")
})

app.post('/listings',async (req,res)=>{
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save()
    res.redirect("/listings")
});

// edit and update route
app.get('/listings/:id/edit', async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id)
    res.render('listings/edit.ejs',{ listing })
})

app.put('/listings/:id',async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`)
})

//delete route
app.delete('/listings/:id',async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect('/listings')
})

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});



app.listen(8080, () => {
  console.log(`Server ruuning on http://localhost:8080`);
});
