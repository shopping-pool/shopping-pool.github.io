$(document).ready(function () {
    setTimeout(function () {
        $("#main").removeClass("is-loading");
        $("#box1").removeClass("is-loading");

    }, 100)
});
var i = 0;
function whenclicked() {
    document.getElementById("overlay").style.display = "block"; 
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById('pass').value;

    if (name == "")
        e_login(email, password);
    else
        e_signIn(name, email, password);
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById('pass').value = "";
}



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //console.log(user.uid);
        console.log("hello");
            
    } else {
        console.log("not signed in")
    }
});

function e_login(email, password) {
    console.log("old user");
     
    firebase.auth().signInWithEmailAndPassword(email, password).then((data) =>{
        document.getElementById("overlay").style.display = "none";  
        window.location.href = data.user.uid;
    })
        .catch(function (error) {
            document.getElementById("overlay").style.display = "none"; 
            alert("Something went wrong,please try again.");
        });
        
}

function e_signIn(name, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((data) => {
            firebase.database().ref('sellers/sellers-list/' + data.user.uid).set({
                name: name,
                email: email
            },function(err){
                if(err)
                    {
                        document.getElementById("overlay").style.display = "none"; 
                        alert("Error,please try again.");
                    }
                else 
                    {
                    document.getElementById("overlay").style.display = "none"; 
                        window.location.href = data.user.uid+"/profile";
                    }    
            })
            
        })
        .catch((error) => {
            document.getElementById("overlay").style.display = "none"; 
            alert("Error,please try again.");
        });
}
