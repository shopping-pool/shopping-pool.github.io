
function add_banner(){
    document.getElementById("overlay").style.display = "block";
    let uid = firebase.auth().currentUser.uid;
    var d = new Date();
    var adObj = {}
    adObj['DATE'] = d.getDate() + '-' + parseInt(d.getMonth()+1) + '-' + d.getFullYear();
    adObj['EMAIL'] = firebase.auth().currentUser.email;
    adObj['DURATION'] = document.getElementById("duration").value;
    let key = firebase.database().ref('classifieds').push().key;
    let file = document.getElementById("bannerPic").files[0];
    const ref = firebase.storage().ref()
    const file_name = file.name;
    const metadata = { contentType: file.type };
    const task = ref.child(file_name).put(file, metadata);
    task.then(snap => snap.ref.getDownloadURL())
        .then(url => {
            adObj['URL'] = url;
            firebase.database().ref("classifieds/advert/" + uid+"/"+key).set(adObj,function(err){
                console.log("updated");
                document.getElementById("bannerPic").value = null;
                document.getElementById("duration").value = null;
                document.getElementById("overlay").style.display = "none";
                location.reload();
            })
        })
}

function add_vaccancies(){
    document.getElementById("overlay").style.display = "block";
    let uid = firebase.auth().currentUser.uid;
    let key = firebase.database().ref('classifieds').push().key;
    var jobObj = {}
    var d = new Date();
    jobObj['DATE'] = d.getDate() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getFullYear();
    jobObj['POST'] = document.getElementById("post").value;
    jobObj['EXPERIENCE'] = document.getElementById("experience").value;
    jobObj['SALARY'] = document.getElementById("salary").value;
    firebase.database().ref("classifieds/job_vaccancies/" + uid+"/"+key).set(jobObj,function(err){
        document.getElementById("post").value = null;
        document.getElementById("experience").value = null;
        document.getElementById("salary").value = null;
        document.getElementById("overlay").style.display = "none";
        location.reload();
    })
}