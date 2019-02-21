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

//sales of a seller

app.get("/:id/sales", (req, res) => {
    res.render("sales", { seller: seller });
});
//placing classifieds
app.get("/:id/classifieds", (req, res) => {
    var id  = req.params.id;
    firebase.database().ref("classifieds/advert/" + id).once('value', function (snap) {
        firebase.database().ref("classifieds/job_vaccancies/" + id).once('value', function (snapi) {
            var advert = snap.val();
            var job = snapi.val();
            res.render("classifieds", {seller: seller,advert:advert,job:job});
        });
    });
});


//discussion path for customers and sellers

 app.get("/:id/queries", (req, res) => {
    firebase.database().ref("Posts").once('value', function (snap){
        var posts = snap.val();
        res.render("queries", {posts:posts, seller: seller });
    });
});
//payment_portal
app.get("/:id/payments",(req,res)=>{
    id = req.params.id;
    firebase.database().ref("classifieds/advert/" + id).once('value', function (snap) {
        firebase.database().ref("classifieds/job_vaccancies/" + id).once('value', function (snapi) {
            firebase.database().ref("sellers/seller_wise/"+id+"/promoted").once("value",function(snapin){
                var promoted = snapin.val();
                var advert = snap.val();
                var job = snapi.val();
            res.render("payments", { seller: seller, advert: advert, job: job,promoted:promoted });
            });
        });
    }); 
})
//sellers profile on the platform

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