function Sold(prodName,buyerId,cat){
    document.getElementById("overlay").style.display = "block";
    var uid = firebase.auth().currentUser.uid;
    //read the product data from booking/uid/category/buyerId/prodname
    // remove the product from there and add the product to sales/seller-wise/uid/category/prodname

    firebase.database().ref("Booking/" + uid + "/" + cat + "/" + buyerId + "/" + prodName).once('value', function (snap) {
        prodObj =  snap.val();
        prodObj['Amount_retrieved'] = prodObj['Amount_to_retrieve'];
        delete prodObj['Amount_to_retrieve'];
        firebase.database().ref("sales/seller_wise/" + uid + "/" + cat + "/" + prodName).set(prodObj,function(err){
            firebase.database().ref("Booking/" + uid + "/" + cat + "/" + buyerId + "/" + prodName).set(null);       
            //go to booked_products/buyerId/prodname
            // remove the product from there and add the product to sales/user-wise/buyerId/prodname
            firebase.database().ref("Booked_Products/" + buyerId + "/" + prodName).once('value', function (snap) {
                userObj =  snap.val(); 
                userObj['Amount_paid'] = userObj['Amount_to_pay'];
                delete userObj['Amount_to_pay'];
                firebase.database().ref("sales/buyer_wise/" + buyerId + "/" + prodName).set(userObj, function (err) {
                    firebase.database().ref("Booked_Products/" + buyerId + "/" + prodName).set(null,function(err){
                        document.getElementById("overlay").style.display = "none";
                        alert("product successfully added to sales");
                        location.reload();
                    });
                });
            })
        });
    })
        
}

function notSold(prodName, buyerId, cat) {
    document.getElementById("overlay").style.display = "block";
    var uid = firebase.auth().currentUser.uid;
    //get the qty,size weight
    firebase.database().ref("Booking/" + uid + "/" + cat + "/" + buyerId + "/" + prodName).once('value', function (snap) {
        bookedObj = snap.val();
        //console.log(bookedObj);
        if(bookedObj['PROMOTED']=='YES'){
            var sellerStore = "sellers/seller_wise/" + uid + "/promoted/" + cat + "/" + bookedObj['NAME'];
            var prodStore = "promoted_products/" + cat + "/" + bookedObj['NAME'] + "_" + uid;
           
        } else {
            var sellerStore = "sellers/seller_wise/" + uid + "/" + cat + "/" + bookedObj['NAME'];
            var prodStore = "categories/" + cat + "/" + bookedObj['NAME'] + "_" + uid;
        }
        var sellerNotSold = "sales/seller_wise/" + uid + "/not_Sold/" + cat + "/" + prodName;
        var bookedQtyArr = bookedObj['QTY'].split(',');
        if (cat == 'Clothing' || cat == 'Footwear' || cat == 'Luggage') {
            bookedSizeArr = bookedObj['SIZE'].split(',');
            //console.log(bookedSizeArr.length)
        }
        else if (cat == 'Groceries') {
            bookedWeightArr = bookedObj['WEIGHT'].split(',');
        }

        //add the qty back to both category and seller

        firebase.database().ref(sellerStore).once('value', function (snapi) {
            prodObj = snapi.val();
            var prodQtyArr = prodObj['QTY'].split(',');
            if (cat == 'Clothing' || cat == 'Footwear' || cat == 'Luggage') {
                var prodSizeArr = prodObj['SIZE'].split(',');
                for (var i = 0; i < bookedSizeArr.length; i++) {
                    index = prodSizeArr.indexOf(bookedSizeArr[i]);
                    prodQtyArr[index] = parseInt(prodQtyArr[index]) + parseInt(bookedQtyArr[i]);
                }
            }
            else if (cat == 'Groceries') {
                var prodWeightArr = prodObj['WEIGHT'].split(',');
                for (var i = 0; i < bookedWeightArr.length; i++) {
                    index = prodWeightArr.indexOf(bookedWeightArr[i]);
                    prodQtyArr[index] = parseInt(prodQtyArr[index]) + parseInt(bookedQtyArr[i]);
                }
            }
            else {
                prodQtyArr[0] = parseInt(prodQtyArr[0]) + parseInt(bookedQtyArr[0]);
            }
            var sizestring = prodQtyArr.join();
            //console.log(sizestring);
            //the object to be updated

            var sizeObj = { 'QTY': sizestring }
            //update count for seller-wise
            firebase.database().ref(sellerStore).update(sizeObj, function (err) {
                //update count global stock
                firebase.database().ref(prodStore).update(sizeObj, function (err) {
                    //put obj as not Sold in sales
                    firebase.database().ref(sellerNotSold).set(bookedObj,function(err){
                        //remove the obj from booking tab
                        firebase.database().ref("Booking/" + uid + "/" + cat + "/" + buyerId + "/" + prodName).set(null, function (err) {
                            //Obtain buyer's booked product
                            firebase.database().ref("Booked_Products/" + buyerId + "/" + prodName).once('value', function (snapi) {
                                buyerBookedObj = snapi.val();
                                //adding buyer's booked product to buyer's not bought
                                firebase.database().ref("sales/buyer_wise/"+buyerId+"/not_bought/"+prodName).set(buyerBookedObj,function(err){
                                    //removing product from buyer's booked product
                                    firebase.database().ref("Booked_Products/" + buyerId + "/" + prodName).set(null,function(err){
                                        document.getElementById("overlay").style.display = "none";
                                        alert("product removed from bookings");
                                        location.reload();
                                    })
                                })  
                            })
                        })
                    })
                })
            });
        })  
    })
}  