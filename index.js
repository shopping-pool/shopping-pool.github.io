var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var firebase = require("firebase");
var config = require("./models/modelapp");
firebase.initializeApp(config);

app.use(express.static("static_files"));
app.use(express.static('views'));
app.set('view engine','ejs');
var seller,id,products;

//landing/login/signup

app.get("/",(req,res)=>{
    res.render("landing");
});

app.get('/favicon.ico', (req, res) => res.status(204));

// Main seller routes

app.get("/:id",(req,res)=>{
    id = req.params.id;
    firebase.database().ref("sellers/sellers-list/"+id ).once('value',function(snap){
        seller = snap.val();
        seller['id'] = id;
    console.log(seller);    
    res.render('temp', { seller: seller });
})   
});
// product routes
app.get("/:id/products", (req, res) => { 
    firebase.database().ref("sellers/seller_wise/"+req.params.id).once('value',function(snap){
        products = snap.val();
        res.render("products", { seller: seller, products: products});
});
app.get("/:id/products/new",(req,res) =>{
        res.render("new_prod", { seller: seller});
    })
    
})

app.get("/:id/sales", (req, res) => {
    res.render("sales", { seller: seller });
 });

app.get("/:id/profile", (req, res) => {
    id = req.params.id;
    firebase.database().ref("sellers/sellers-list/" + id).once('value', function (snap) {
        seller = snap.val();
        seller['id'] = id;
        res.render("profile",{seller:seller});
    })     
});
//logout
app.get("/:id/logout",(req,res) => {
    firebase.auth().signOut().then(function(){
        res.redirect("/")
    },(err)=>{
        console.log(err);
    })   
});
// PORT NUMBER
app.listen(process.env.PORT || 7000,()=> {
    console.log("listening on 7000");
})