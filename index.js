// requiring needed packages
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

// connecting with firestore
const { QuerySnapshot } = require("@google-cloud/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// initializing global variables
let found = false;
let foundCity = {};

// get method for root route
app.get("/", function (req, res) {
    res.render("city-info", {
        city: foundCity,
        showData: found
    });
});

// post method for root route
app.post("/", function(req, res) {
    const searchedCity = req.body.city;
    found = false;
    // reading from db
    let customerRef = db.collection("Cities");

    // looping through all database documents to find searched query
    customerRef.get().then((querySnapshot) => {
        querySnapshot.forEach(document => {
            let cityData = document.data();
            if(_.lowerCase(cityData.name) === _.lowerCase(searchedCity)) {
                // if searched city is found, change variables accordingly
                found = true;
                foundCity = cityData;
                console.log("city found: ", cityData.name);
            }
        });
        if(!found) {
            // if searched city was not found, show failure page
            console.log("city not found");
            res.render("failure", {
                name: searchedCity
            });
        } else {
            // if searched city was found, show city-info page
            res.redirect("/");
        }
    });
})

// listen method at localhost:3000
app.listen(3000, function () {
    console.log("Server running on port 3000");
});