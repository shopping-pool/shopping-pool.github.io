function Sold(prodName,buyerId,cat){
    var uid = firebase.auth().currentUser.uid;
    //read the product data from booking/uid/category/buyerId/prodname
    // remove the product from there and add the product to sales/seller-wise/uid/category/prodname

    firebase.database().ref("Booking/" + uid + "/" + cat + "/" + buyerId + "/" + prodName).once('value', function (snap) {
        prodObj =  snap.val();
        prodObj['Amount_retrieved'] = prodObj['Amount_to_retrieve'];
        delete prodObj['Amount_to_retrieve'];
        firebase.database().ref("sales/seller_wise/" + uid + "/" + cat + "/" + prodName).set(prodObj,function(err){
            firebase.database().ref("Booking/" + uid + "/" + cat + "/" + buyerId + "/" + prodName).set(null);
        });
    })
    //go to booked_products/buyerId/prodname
    // remove the product from there and add the product to sales/user-wise/buyerId/prodname

    firebase.database().ref("Booked_Products/" + buyerId + "/" + prodName).once('value', function (snap) {
        userObj =  snap.val(); 
        userObj['Amount_paid'] = userObj['Amount_to_pay'];
        delete userObj['Amount_to_pay'];
        firebase.database().ref("sales/buyer_wise/" + buyerId + "/" + prodName).set(userObj, function (err) {
            firebase.database().ref("Booked_Products/" + buyerId + "/" + prodName).set(null,function(err){
                location.reload();
            });
        });
    })
        
}

function notSold(){
    // remove from bookings
    // add the products qty back to category and seller
    // add product to categories/cat/prodName_uid
}