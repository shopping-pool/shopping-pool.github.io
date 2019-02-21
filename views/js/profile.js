function addShopName(){
    var shopName = document.getElementById("shopName").value;
    var id = firebase.auth().currentUser.uid;
    var updateObj = "sellers/sellers-list/" + id;
    if(shopName.length!=0)
    {
        firebase.database().ref(updateObj).update({
            'Shop-name':shopName
        },function(err){
            console.log("updated");
        })
    }
}

async function geocode() {
    var add = document.getElementById("addi").value;
    add = add.split(" ").join("+");
    add = add.split(",").join("+");

    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + add + "&key=AIzaSyByu372YfRKcjhhlEYxCvTRjcx9PuRwPM0";
    var res = await fetch(url);
    userDetailsJSON = await res.json();
    locObj = userDetailsJSON.results[0].geometry.location;
    document.getElementById('add').innerHTML = "";
    addLocation(locObj);
}
async function updategeocode() {
    var add = document.getElementById("addi").value;
    add = add.split(" ").join("+");
    add = add.split(",").join("+");

    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + add + "&key=AIzaSyByu372YfRKcjhhlEYxCvTRjcx9PuRwPM0";
    var res = await fetch(url);
    userDetailsJSON = await res.json();
    locObj = userDetailsJSON.results[0].geometry.location;
    document.getElementById('add').innerHTML = "";
    updateLocation(locObj);
}
//adding input box for geocode

function latlang() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            addLocation(pos);
        })
    }
}
async function updatelatlng() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            updateLocation(pos);
        })
    }
    
}
function addinput() {
    var input = 'Address <input type="text" id = "addi"> <button class ="buttons" onclick ="geocode()">Get location</button>';
    document.getElementById('add').innerHTML = input;
}
function updateinput() {
    var input = 'Address <input type="text" id = "addi"><button class ="buttons" onclick ="updategeocode()">Get location</button>';
    document.getElementById('add').innerHTML = input;
}
function addLocation(locObj){
    var id = firebase.auth().currentUser.uid;
    var updateObj = "sellers/sellers-list/"+id+"/location";
    firebase.database().ref().child(updateObj).set(locObj, function (err) {
        location.reload();
    });
}
function updateLocation(locObj) {
    var id = firebase.auth().currentUser.uid;
    var updateObj = "sellers/sellers-list/" + id + "/location";
    firebase.database().ref().child(updateObj).update(locObj,function(err){
        location.reload();
    });
}
