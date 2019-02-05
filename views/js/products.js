var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var updateText = document.getElementById('updateText');
var productObject = {};
var uid,produpdate,userupdate;
function update(product) {
    productObject = createObject(product);
    //add innerhtml to updateText
    modal.style.display = "block";
    var text = "<form>";
    for (key in productObject) {
        if (key != 'URL' && key != 'CATEGORY' && key != 'NAME')
            text += '<label class = "tag">' + key + '</label><input type = "text" id ="' + key + '" value = "' + productObject[key] + '"><br>';
    }
    text += '<input type="button" onclick ="fireUpdate()" value ="Update"> <input type = "button" onclick = "cancel()" value ="Cancel"></form>';
    updateText.innerHTML = text;

};
function deleter(product) {
    productObject = createObject(product);
    var uid = firebase.auth().currentUser.uid;
    var produpdate = "categories/" + productObject.CATEGORY + "/" + productObject.NAME;
    var userupdate = "sellers/seller_wise/" + uid + "/" + productObject.CATEGORY + "/" + productObject.NAME;
    firebase.database().ref().child(userupdate).set(null);
    firebase.database().ref().child(produpdate).set(null, function (err) {
        console.log("deleted");
        location.reload();
    })
}
function fireUpdate() {
    var localObj = {};
    for (key in productObject) {
        if (key != 'URL' && key != 'CATEGORY' && key != 'NAME') {
            var changedVal = document.getElementById(key).value;
            if (changedVal != productObject[key])
                localObj[key] = changedVal;
        }
    }
    var uid = firebase.auth().currentUser.uid;
    var produpdate = "categories/" + productObject.CATEGORY + "/" + productObject.NAME;
    var userupdate = "sellers/seller_wise/" + uid + "/" + productObject.CATEGORY + "/" + productObject.NAME;
    firebase.database().ref().child(userupdate).update(localObj);
    firebase.database().ref().child(produpdate).update(localObj,function(err){
        console.log("updated");             
        location.reload();
    })
   
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
function cancel() {
    modal.style.display = "none";
    //remove innerhtml also
    document.getElementById('updateText').innerHTML = "";
}
function createObject(productArray) {
    var localArrKeys = [];
    var localArrVal = [];
    var object = {};
    var separated = productArray.split(",");
    // console.log(separated);
    //storings keys in separated array
    object['CATEGORY'] = separated.shift();
    for (var i = 0; i < separated.length; i++) {
        if (separated[i].charAt(0) == "k")
            localArrKeys.push(separated[i].slice(1));
    }
    //removing those keys from original array
    for (var i = 0; i < localArrKeys.length; i++)
        separated.shift();
    for (var i = 0; i < separated.length; i++) {

        if (separated[i].charAt(0) != "a") {
            var j = i;
            while (separated[j].charAt(0) != "a") {
                separated[i - 1] += "," + separated[j];
                separated.splice(j, 1)
            }

        }
        if (separated[i].charAt(0) == "a") {
            separated[i] = separated[i].slice(1);
        }
    }
    for (var i = 0; i < separated.length; i++)
        object[localArrKeys[i]] = separated[i];
    return object;
};