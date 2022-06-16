const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const { QuerySnapshot } = require("@google-cloud/firestore");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let hasSearched = false;
let found = false;
let foundCity = {};

app.get("/", function (req, res) {
    res.render("city-info", {
        city: foundCity,
        showData: hasSearched
    });
});

app.post("/", function(req, res) {
    const searchedCity = req.body.city;

    // reading from db
    let customerRef = db.collection("Cities");
    customerRef.get().then((querySnapshot) => {
        querySnapshot.forEach(document => {
            let cityData = document.data();
            if(_.lowerCase(cityData.name) === _.lowerCase(searchedCity)) {
                hasSearched = true;
                found = true;
                foundCity = cityData;
                console.log("city found!: ", cityData.name);
                res.redirect("/");
            }
        });
        if(!found) {
            found = false;
            console.log("not found");
            res.render("failure", {
                name: searchedCity
            });
        }
    });
})

app.listen(3000, function () {
    console.log("Server running on port 3000");
});


// // batch insertion
// const batch = db.batch();

// const c2 = db.collection("Cities").doc("2");
// const c3 = db.collection("Cities").doc("3");
// const c4 = db.collection("Cities").doc("4");
// const c5 = db.collection("Cities").doc("5");
// const c6 = db.collection("Cities").doc("6");
// const c7 = db.collection("Cities").doc("7");
// const c8 = db.collection("Cities").doc("8");

// batch.set(c2, 
//     {id: 2, 
//     name: "Delhi", 
//     area: "1,484 km²", 
//     country: "India", 
//     population: "18.98 million (2012)", 
//     image: "https://assets-news.housing.com/news/wp-content/uploads/2013/11/09174406/Delhi-in-Pictures-%E2%80%93-Then-and-Now-FB-1200x700-compressed.jpg"});
// batch.set(c3, 
//     {id: 3, 
//         name: "Mumbai", 
//         area: "603.4 km²", 
//         country: "India", 
//         population: "20.9 million (2022)", 
//         image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bXVtYmFpfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"});
// batch.set(c4, 
//     {id: 4, 
//         name: "Paris", 
//         area: "105.4 km²", 
//         country: "Italy", 
//         population: "2.161 million (2019)", 
//         image: "https://a.cdn-hotels.com/cos/heroimage/Paris_0_108362288.jpg?impolicy=fcrop&w=536&h=384&q=high"});
// batch.set(c5, 
//     {id: 5, 
//         name: "New York", 
//         area: "783.8 km²", 
//         country: "USA", 
//         population: "8.38 million (2020)", 
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZWp_LyPOKbC5Tf2yr1yGQ-rI9FbaKY1mT4g&usqp=CAU"});
// batch.set(c6, 
//     {id: 6, 
//         name: "London", 
//         area: "1,572 km²", 
//         country: "UK", 
//         population: "8.982 million (2019)", 
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBv3YGRbR9HerGnjuQt6eGFGNREVEN69DFiw&usqp=CAU"});
// batch.set(c7, 
//     {id: 7, 
//         name: "Tokyo", 
//         area: "2,194 km²", 
//         country: "Japan", 
//         population: "13.96 million (2021)", 
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPn3gpLCrqe7MdhTBPgYfXPKXrnwOcTek8w&usqp=CAU"});
// batch.set(c8, 
//     {id: 8, 
//         name: "Singapore", 
//         area: "728.6 km²", 
//         country: "Singapore", 
//         population: "5.686 million (2020)", 
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNGCuLeZZarzeijDBigYWicmRk2lXRxjV_xQ&usqp=CAU"});

// batch.commit().then(res => {
//     console.log("batch ran successfully!");
// });