   function try1() {


    var category = document.getElementById("cat").value;
    // selct from div
    var addform = document.getElementById("form");
    //prod_name
       var prod_name = '<form class = "dataform"><label class = "label" > Product Name<sup class = "req">*</sup></label><input type="text" class = "text" id="prod_name" placeholder="(enter in the format Brand-producttype eg lotto-shoes)" required ><br>';
    //price and qty
       var qty_price = '<label class = "label" > Quantity<sup class = "req">*</sup></label><input type="text" class = "text" id="qty" placeholder="Enter qty available for respective sizes/weights in same format eg 3,4,5" required ><br><label class = "label">Prices<sup class = "req">*</sup></label><input type="text" class = "text" id="prices" placeholder="Enter prices for respective sizes/weights in same format eg 300,400,500" required ><br>';
    //image
       var image = '<label class = "label" >Product Image<sup class = "req">*</sup></label><input type="file" id = "photo" required ><br>';
    //size
       var size = '<label class = "label" >Size<sup class = "req">*</sup></label><input type="text" class = "text"  id="size" placeholder="Enter sizes available separated by comma" required ><br>';
    //gender
       var gender = '<label class = "label" >Gender<sup class = "req">*</sup></label><input type="radio" name="gender" value="male" required > Male<input type="radio" name="gender" value="female"> Female<input type="radio" name="gender" value="both"> Both<br>';
    //color
       var color = '<label class = "label" >Color<sup class = "req">*</sup></label><input type="text" class = "text"  id="color" placeholder="Enter colors available separated by comma" required ><br>';

    //Material
       var material = '<label class = "label" >Material<sup class = "req">*</sup></label><input type="text" class = "text"  id="material" placeholder="Material" required ><br>';
    //offer
    var offer = '<label class = "label" >Offer</label><input type="text" class = "text"  id="offer" placeholder="Any Special offer on this product"><br>';
    //discount
    var discount = '<label class = "label" >Any Discount</label><input type="text" class = "text"  id="discount" placeholder="Any disount percentage"><br>';
    // weight
       var weight = '<label class = "label" >Weight<sup class = "req">*</sup></label><input type="text" class = "text"  id="weight" placeholder="Enter weights available separated by comma" required><br>';
    //water ressistance
       var water_ressistance = '<label class = "label" >Water Ressistance<sup class = "req">*</sup></label><input type="radio" name="water_ressistance" value="yes" required > Yes<input type="radio" name="water_ressistance" value="No"> No<br>';
    //edition
       var edition = '<label class = "label" >Edition<sup class = "req">*</sup></label><input type="radio" name="edition" value="hardcover" required> hardcover<input type="radio" name="edition" value="paperback"> paperback<br>';
       var submit = '<input class = "form submit" type="submit" onclick="add_product()" value="Submit"><form><div id = "infoBox"><sup class = "req">*</sup> = Required</div>';

    if (category == "empty")
        addform.innerHTML = "";


    else if (category == "Clothing" || category == "Footwear")
        addform.innerHTML = prod_name + gender + size + qty_price +color+ offer+discount+image + submit;
    else if (category == "Groceries")
        addform.innerHTML = prod_name + weight + qty_price + offer + discount +image + submit;
    else if (category == "Luggage")
        addform.innerHTML = prod_name + water_ressistance + size + qty_price + offer + discount +image + submit;
    else if (category == "Books")
        addform.innerHTML = prod_name + edition + qty_price + offer + discount +image + submit;

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
    let offer = document.getElementById("offer").value;
    let discount = document.getElementById("discount").value;
    //firebase part
    var uid = firebase.auth().currentUser.uid;
    var promotedprod = "promoted_products/"+category+"/"+prod_name;
    var promoteduser = "sellers/seller_wise/" + uid + "/promoted/" + category + "/" + prod_name;
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
    if(offer!=""){
        obj_for_prod['OFFER'] = offer;
        obj_for_seller['OFFER'] = offer;
    }
    if (discount!= "") {
        obj_for_prod['DISCOUNT'] = discount;
        obj_for_seller['DISCOUNT'] = discount;
    }
    //emptying feilds
    document.getElementById("prod_name").value = null;
    document.getElementById("qty").value = null;
    document.getElementById("prices").value= null;
    document.getElementById("offer").value = null;
    document.getElementById("discount").value = null;
    


    if (category == "Clothing" || category == "Footwear") {
        let gender = document.querySelector('input[name="gender"]:checked').value;
        let size = document.getElementById("size").value;
        let color = document.getElementById("color").value;
        obj_for_seller['GENDER'] = gender;
        obj_for_seller['SIZE'] = size;
        obj_for_seller['COLOR'] = color;
        obj_for_prod['COLOR'] = color;
        obj_for_prod['GENDER'] = gender;
        obj_for_prod['SIZE'] = size;
        document.getElementById("color").value = null;
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
        
        if('DISCOUNT' in obj_for_prod || 'OFFER' in obj_for_prod){
        firebase.database().ref(promotedprod).set(obj_for_prod); 
        firebase.database().ref(promoteduser).set(obj_for_seller);   
        }else{
        firebase.database().ref(produpdate).set(obj_for_prod);
        firebase.database().ref(userupdate).set(obj_for_seller);
        }
        document.getElementById("photo").value = null;
        document.getElementById("overlay").style.display = "none";        
        });    
}