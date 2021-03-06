var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var updateText = document.getElementById('updateText');
var productObject = {};
var uid,produpdate,userupdate;
var yes = 0;

function update(product) {
    productObject = createObject(product);
    //add innerhtml to updateText
    modal.style.display = "block";
    var text = "<form>";
    for (key in productObject) {
        if (key != 'URL' && key != 'CATEGORY' && key != 'NAME' && key !='PRODUCT')
            text += '<label class = "tag">' + key + '</label><input type = "text" class ="modal-input" id ="' + key + '" value = "' + productObject[key] + '"><br>';
    }
    text += '<div class ="center"><input type="button" onclick ="fireUpdate()" value ="Update"> <input type = "button"  class = "closeModal" onclick = "canceli()" value ="Cancel"></div></form>';
    updateText.innerHTML = text;

};


//function to delete product from db
function deleter(product) {
    modal.style.display = "block";
    var text ='<h3>Confirm Delete</h3><br>';
    text += '<div class ="center"><input type="button" onclick = "setYes(\''+product+'\')" value ="Delete"> <input type = "button"  class = "closeModal" onclick = "canceli()" value ="Cancel"></div>';
    updateText.innerHTML = text;
}
//function to confirm delete
function setYes(product){
    productObject = createObject(product);
    var uid = firebase.auth().currentUser.uid;
    //delete promoted project
    if ('PRODUCT' in productObject) {
        var produpdate = "promoted_products/" + productObject.CATEGORY + "/" + productObject.NAME + "_" + uid;
        var userupdate = "sellers/seller_wise/" + uid + "/promoted/" + productObject.CATEGORY + "/" + productObject.NAME;
    } else {
        produpdate = "categories/" + productObject.CATEGORY + "/" + productObject.NAME + "_" + uid;
        userupdate = "sellers/seller_wise/" + uid + "/" + productObject.CATEGORY + "/" + productObject.NAME;
    }
    firebase.database().ref().child(userupdate).set(null, function (err) {
        firebase.database().ref().child(produpdate).set(null, function (err) {
            location.reload();
        });
    })
    setTimeout(()=>canceli(),500);
}

//function to update value in db
function fireUpdate() {
    var localObj = {};
    for (key in productObject) {
        if (key != 'URL' && key != 'CATEGORY' && key != 'NAME' && key!='PRODUCT') {
            var changedVal = document.getElementById(key).value;
            if (changedVal != productObject[key])
                localObj[key] = changedVal;
        }
    }
    var uid = firebase.auth().currentUser.uid;
    var produpdate = "categories/" + productObject.CATEGORY + "/" + productObject.NAME+"_"+uid;
    var userupdate = "sellers/seller_wise/" + uid + "/" + productObject.CATEGORY + "/" + productObject.NAME;
    if('PRODUCT' in productObject  ){
        if (('DISCOUNT' in localObj && localObj['DISCOUNT'] != "" && localObj['DISCOUNT'] != 0 ) || !('DISCOUNT' in localObj )){
            produpdate = "promoted_products/" + productObject.CATEGORY+ "/" + productObject.NAME+"_"+uid;
            userupdate = "sellers/seller_wise/" + uid + "/promoted/" + productObject.CATEGORY + "/" + productObject.NAME;
            firebase.database().ref().child(userupdate).update(localObj,function(err){
            firebase.database().ref().child(produpdate).update(localObj, function (err) {
            location.reload();
            });
        })
        }
        else{
            //remove from promoted section
            deletepromotedproducts = "promoted_products/" + productObject.CATEGORY + "/" + productObject.NAME+"_"+uid;
            deleteuserpromoted = "sellers/seller_wise/" + uid + "/promoted/" + productObject.CATEGORY + "/" + productObject.NAME;
            firebase.database().ref().child(deletepromotedproducts).set(null);
            firebase.database().ref().child(deleteuserpromoted).set(null,function(err){
                for (k in localObj)
                    productObject[k] = localObj[k];
                localObj = {};
                delete productObject['PRODUCT'];
                delete productObject['DISCOUNT'];
                delete productObject['CATEGORY'];
                localObj = productObject;
                firebase.database().ref().child(userupdate).update(localObj, function (err) {
                    //adding sold by attribute
                    localObj['SOLD_BY'] = uid;
                    firebase.database().ref().child(produpdate).update(localObj, function (err) {
                        location.reload();
                    });
                });    
            })
        } 
    }else{
        firebase.database().ref().child(userupdate).update(localObj, function (err) {
            firebase.database().ref().child(produpdate).update(localObj, function (err) {
                location.reload();
            });
        })
    }
    setTimeout(()=>{canceli()},500);
   
}
//close btn for modal
span.onclick = function () {
    modal.style.display = "none";
    //remove innerhtml also
    document.getElementById('updateText').innerHTML = "";
}
//close modal if click outside screen
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        //remove innerhtml also
        document.getElementById('updateText').innerHTML = "";
    }
}
//cancel button
function canceli() {
    modal.style.display = "none";
    //remove innerhtml also
    document.getElementById('updateText').innerHTML = "";
}
//return product Object with feilds that can be updated
function createObject(productArray) {
    var localArrKeys = [];
    var object = {};
    var separated = productArray.split(",");
    if(separated[0]=="promoted"){
        object['PRODUCT'] = separated.shift();
    }
    object['CATEGORY'] = separated.shift();
    for (var i = 0; i < separated.length; i++) {
        if (separated[i].charAt(0) == "k")
            localArrKeys.push(separated[i].slice(1));
    }
    //removing those keys from original array
    for (var i = 0; i < localArrKeys.length; i++)
        separated.shift();
    for (var i = 0; i < separated.length; i++) {

        if (separated[i] != null && separated[i].charAt(0) != "a") {
            var j = i;
            while (separated[j] != null && separated[j].charAt(0) != "a" )  {
                separated[i - 1] += "," + separated[j];
                separated.splice(j, 1)
            }

        }
        if (separated[i] != null && separated[i].charAt(0) == "a") {
            separated[i] = separated[i].slice(1);
        }
    }
    for (var i = 0; i < separated.length; i++)
        object[localArrKeys[i]] = separated[i];
    return object;
}