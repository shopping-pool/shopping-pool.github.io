// function add_product(){
//     let cat = document.getElementById("cat").value;
//     let prod_name = document.getElementById("prod_name").value;
//     let gender =  document.querySelector('input[name="gender"]:checked').value;
//     let size = document.getElementById("size").value;
//     let qty = document.getElementById("qty").value;
//     let prices = document.getElementById("prices").value;
//     let file = document.getElementById("photo").files[0];
//     var uid = firebase.auth().currentUser.uid;
//     var produpdate = "categories/" + cat + "/" + prod_name;
//     var userupdate = "sellers/seller_wise/" + uid + "/" + cat + "/" + prod_name;
//     // console.log(cat,prod_name,gender,size,qty,prices,file)
    
function try1() {


    var category = document.getElementById("cat").value;
    // selct from div
    var addform = document.getElementById("form");
    //prod_name
    var prod_name = '<form><label > Product Name</label><input type="text" id="prod_name" placeholder="(enter in the format Brand-producttype eg lotto-shoes) required"><br>';
    //price and qty
    var qty_price = '<label > Quantity</label><input type="text" id="qty" placeholder="Enter qty available for respective sizes/weights in same format eg 3,4,5" required><br><label>Prices</label><input type="text" id="prices" placeholder="Enter prices for respective sizes/weights in same format eg 300,400,500" required><br>';
    //image
    var image = '<label >Product Image</label><input type="file" id = "photo" required><br>';
    //size
    var size = '<label >Size</label><input type="text"  id="size" placeholder="Enter sizes available separated by comma" required><br>';
    //gender
    var gender = '<label >Gender</label><input type="radio" name="gender" value="male"> Male<input type="radio" name="gender" value="female"> Female<input type="radio" name="gender" value="both"> Both<br>';
    //color
    var color = '<label >Color</label><input type="text"  id="color" placeholder="Enter colors available separated by comma" required><br>';

    //Material
    var material = '<label >Material</label><input type="text"  id="material" placeholder="Material" required><br>';

    // weight
    var weight = '<label >Weight</label><input type="text"  id="weight" placeholder="Enter weights available separated by comma" required><br>';
    //water ressistance
    var water_ressistance = '<label >Water Ressistance</label><input type="radio" name="water_ressistance" value="yes"> Yes<input type="radio" name="water_ressistance" value="No"> No<br>';
    //edition
    var edition = '<label >Edition</label><input type="radio" name="edition" value="hardcover"> hardcover<input type="radio" name="edition" value="paperback"> paperback<br>';
    var submit = '<input type="button" onclick="add_product()" value="Submit"><form>'
    addform.innerHTML = "";

    if (category == "empty")
        addform.innerHTML = "";


    else if (category == "Clothing" || category == "Footwear")
        addform.innerHTML = prod_name + gender + size + qty_price + image + submit;
    else if (category == "Groceries")
        addform.innerHTML = prod_name + weight + qty_price + image + submit;
    else if (category == "Luggage")
        addform.innerHTML = prod_name + water_ressistance + size + qty_price + image + submit;
    else if (category == "Books")
        addform.innerHTML = prod_name + edition + qty_price + image + submit;

}
function add_product() {
    document.getElementById("overlay").style.display = "block";
    var category = document.getElementById("cat").value;
    var obj_for_seller = {};
    var obj_for_prod = {};

    //common-elements
    let prod_name = document.getElementById("prod_name").value;
    let qty = document.getElementById("qty").value;
    let prices = document.getElementById("prices").value;
    let file = document.getElementById("photo").files[0];
    //firebase part
    var uid = firebase.auth().currentUser.uid;
    var produpdate = "categories/" + category + "/" + prod_name;
    var userupdate = "sellers/seller_wise/" + uid + "/" + category + "/" + prod_name;
    //category-based
    obj_for_prod['NAME'] = prod_name;
    obj_for_prod['QTY'] = qty;
    obj_for_prod['PRICE'] = prices;
    obj_for_prod['SOLD_BY'] = uid;
    obj_for_seller['NAME'] = prod_name;
    obj_for_seller['QTY'] = qty;
    obj_for_seller['PRICE'] = prices;
    //emptying feilds
    document.getElementById("prod_name").value = null;
    document.getElementById("qty").value = null;
    document.getElementById("prices").value= null;
    


    if (category == "Clothing" || category == "Footwear") {
        let gender = document.querySelector('input[name="gender"]:checked').value;
        let size = document.getElementById("size").value;
        obj_for_seller['GENDER'] = gender;
        obj_for_seller['SIZE'] = size;
        obj_for_prod['GENDER'] = gender;
        obj_for_prod['SIZE'] = size;
        document.getElementById("size").value = null;
    }
    else if (category == "Groceries") {
        let weight = document.getElementById('weight').value;
        obj_for_prod['WEIGHT'] = weight;
        obj_for_seller['WEIGHT'] = weight;
        document.getElementById('weight').value = null;
    }
    else if (category == "Luggage") {
        let water_ressistance = document.querySelector('input[name="water_ressistance"]:checked').value;
        let size = document.getElementById("size").value;
        obj_for_seller['SIZE'] = size;
        obj_for_prod['SIZE'] = size;

        obj_for_prod['WATER_RESSISTANT'] = water_ressistance;
        obj_for_seller['WATER_RESSISTANT'] = water_ressistance;
        document.getElementById("size").value = null;
    }
    else if (category == "Books") {

        let edition = document.querySelector('input[name="edition"]:checked').value;
        obj_for_seller['EDITION'] = edition;
        obj_for_prod['EDITION'] = edition;
    }

    console.log(obj_for_prod);
    console.log(obj_for_seller);

    
    // console.log(referral);
    const ref = firebase.storage().ref()

    const file_name = file.name;
    const metadata = {contentType:file.type};

    const task = ref.child(file_name).put(file,metadata);
    task.then( snap => snap.ref.getDownloadURL())
    .then(url => {
        console.log("hello");
        obj_for_prod['URL'] = url;
        obj_for_seller['URL'] = url;
        firebase.database().ref(userupdate).set(obj_for_seller);
        firebase.database().ref(produpdate).set(obj_for_prod);
        document.getElementById("photo").value = null;
        document.getElementById("overlay").style.display = "none";        
        });
       
        
    
}