$(document).ready(function () {
    setTimeout(function () {
        $("#main").removeClass("is-loading");
        $("#box1").removeClass("is-loading");

    }, 100)
});
function whenclicked() {
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
        window.location.href = user.uid;
    } else {
        console.log("not signed in")
    }
});

function e_login(email, password) {
    console.log("old user");
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            console.log(error);
        });
}

function e_signIn(name, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((data) => {
            firebase.database().ref('sellers/sellers-list/' + data.user.uid).set({
                name: name,
                email: email
            })
            //console.log("new user");
            window.location.href = data.user.uid;
        })
        .catch((error) => {
            alert(error.message);
        });
}
//function e_logout() {
//     if (inn == 1) {
//         inn = 0;
//         firebase.auth().signOut().then(function () {
//             console.log('Signed Out');
//         }, function (error) {
//             console.error('Sign Out Error', error);
//         });
//     }
//     else
//         console.log("User already logged Out")
// }