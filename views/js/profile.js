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
    console.log(locObj);
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
    var input = 'Address <input type="text" id = "addi"><button onclick ="geocode()">location</button>';
    document.getElementById('add').innerHTML = input;
}
function updateinput() {
    var input = 'Address <input type="text" id = "addi"><button onclick ="updategeocode()">location</button>';
    document.getElementById('add').innerHTML = input;
}
function addLocation(locObj){
    var id = firebase.auth().currentUser.uid;
    var updateObj = "sellers/sellers-list/"+id+"/location";
    firebase.database().ref().child(updateObj).set(locObj, function (err) {
        console.log("updateds");
        location.reload();
    });
}
function updateLocation(locObj) {
    var id = firebase.auth().currentUser.uid;
    var updateObj = "sellers/sellers-list/" + id + "/location";
    firebase.database().ref().child(updateObj).update(locObj,function(err){
        console.log("updated");
        location.reload();
    });
}
