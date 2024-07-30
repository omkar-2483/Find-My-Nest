const express = require("express");
const app= express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js')

//connect database
const MONGO_URL="mongodb://127.0.0.1:27017/findmynest";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}



app.get('/',(req,res)=>{
    res.send("hello from backend")
})

app.get('/testListing', async(req,res)=>{
    let sampleListing = new Listing({
        title : "My New Villa",
        description: "By the beach",
        price : 1200,
        location : "Bengluru, Karnataka",
        country: "india"
    });
    await sampleListing.save();
    console.log(sampleListing);
    res.send("successful testing") 
});

app.listen(8080,()=>{
    console.log(`Server ruuning on http://localhost:8080`);
})