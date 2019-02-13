var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


function addComment(k){
// getting date and time
var d = new Date();
var date = d.getDate() + '-' + month[d.getMonth()] + '-' + d.getFullYear();
var time = d.getHours() + ':' + d.getMinutes();
// 
var uid = firebase.auth().currentUser.uid;
var comment = document.getElementById(`input${k}`).value;
    document.getElementById(`input${k}`).value ="";
var table = document.getElementById(`ctable${k}`);
var obj = {
    'comment':comment,
    'date':date,
    'time':time,
    'uid':uid
}
var row = table.insertRow(-1);
var cell1 = row.insertCell(0);
firebase.database().ref("sellers/sellers-list/" + uid).once('value', function (snap) {
    obj['username'] = snap.val().name;
    var username = snap.val().name;
    cell1.innerHTML = "<div class='postComments'> <div class='comm'>" + username + " : " + comment + "</div ><div class='timedetails'>" + time + " " + date + "</div></div >";
    firebase.database().ref("Posts/").once('value', function (snapi) {
    reqPost= Object.keys(snapi.val())[parseInt(k-1)];
    var commentKey = firebase.database().ref('Posts').push().key;
    firebase.database().ref('Posts/'+reqPost+'/Comments/'+commentKey).set(obj);
    });
}); 

}