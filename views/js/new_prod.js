   function try1() {


    var category = document.getElementById("cat").value;
    // selct from div
    var addform = document.getElementById("form");
    //prod_name
       var prod_name = '<form class = "dataform"><label class = "label" > Product Name<sup class = "req">*</sup></label><input type="text" class = "text" id="prod_name" placeholder="(enter in the format Brand-producttype eg lotto-shoes)" ><br>';
    //price and qty
       var qty_price = '<label class = "label" > Quantity<sup class = "req">*</sup></label><input type="text" class = "text" id="qty" placeholder="Enter qty available for respective sizes/weights in same format eg 3,4,5"  ><br><label class = "label">Prices<sup class = "req">*</sup></label><input type="text" class = "text" id="prices" placeholder="Enter prices for respective sizes/weights in same format eg 300,400,500" ><br>';
    //image
       var image = '<label class = "label" >Product Image<sup class = "req">*</sup></label><input type="file" id = "photo" required ><br>';
    //size
       var size = '<label class = "label" >Size<sup class = "req">*</sup></label><input type="text" class = "text"  id="size" placeholder="Enter sizes available separated by comma" ><br>';
    //gender
       var gender = '<label class = "label" >Gender<sup class = "req">*</sup></label><input type="radio" name="gender" value="male"> Male<input type="radio" name="gender" value="female"> Female<input type="radio" name="gender" value="both"> Both<br>';
    //color
       var color = '<label class = "label" >Color<sup class = "req">*</sup></label><input type="text" class = "text"  id="color" placeholder="Enter colors available separated by comma"  ><br>';

    //Material
       var material = '<label class = "label" >Material<sup class = "req">*</sup></label><input type="text" class = "text"  id="material" placeholder="Material"  ><br>';
    //discount    
    var discount = '<label class = "label" >Any Discount</label><input type="text" class = "text"  id="discount" placeholder="Any disount percentage"><br>';
    // weight
       var weight = '<label class = "label" >Weight<sup class = "req">*</sup></label><input type="text" class = "text"  id="weight" placeholder="Enter weights available separated by comma" ><br>';
    //water ressistance
       var water_ressistance = '<label class = "label" >Water Ressistance<sup class = "req">*</sup></label><input type="radio" name="water_ressistance" value="yes" > Yes<input type="radio" name="water_ressistance" value="No"> No<br>';
    //edition
       var edition = '<label class = "label" >Edition<sup class = "req">*</sup></label><input type="radio" name="edition" value="hardcover" > hardcover<input type="radio" name="edition" value="paperback"> paperback<br>';
       var submit = '<input class = "form submit" type="button" onclick="add_product()" value="Submit"><form><div id = "infoBox"><sup class = "req">*</sup> Required Fields</div>';

    if (category == "empty")
        addform.innerHTML = "";
    else if (category == "Clothing" || category == "Footwear")
        addform.innerHTML = prod_name + gender + size + qty_price +color+ discount+image + submit;
    else if (category == "electronic-accessories" || category == "home-and-life-style")
        addform.innerHTML = prod_name + size + qty_price + color + discount + image + submit;
    else if (category == "Groceries")
        addform.innerHTML = prod_name + weight + qty_price + discount +image + submit;
    else if (category == "Luggage")
        addform.innerHTML = prod_name + water_ressistance + size + qty_price +  discount +image + submit;
    else if (category == "Books")
        addform.innerHTML = prod_name + edition + qty_price + discount +image + submit;

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
    let discount = document.getElementById("discount").value;
    //firebase part
    var uid = firebase.auth().currentUser.uid;
    var promotedprod = "promoted_products/"+category+"/"+prod_name+"_"+uid;
    var promoteduser = "sellers/seller_wise/" + uid + "/promoted/" + category + "/" + prod_name;
    var produpdate = "categories/" + category + "/" + prod_name+"_"+uid;
    var userupdate = "sellers/seller_wise/" + uid + "/" + category + "/" + prod_name;
    //category-based
    obj_for_prod['NAME'] = prod_name;
    obj_for_prod['QTY'] = qty;
    obj_for_prod['PRICE'] = prices;
    obj_for_prod['SOLD_BY'] = uid;
    obj_for_seller['NAME'] = prod_name;
    obj_for_seller['QTY'] = qty;
    obj_for_seller['PRICE'] = prices;
    if (discount!= "") {
        obj_for_prod['DISCOUNT'] = discount;
        obj_for_seller['DISCOUNT'] = discount;
        document.getElementById("discount").value = "";
    }
    //emptying feilds
    document.getElementById("prod_name").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("prices").value = "";
    


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
        document.getElementById("size").value = "";
        document.getElementById("color").value = "";
  
    }
    if (category == "electronic-accessories" || category == "home-and-life-style") {
        let size = document.getElementById("size").value;
        let color = document.getElementById("color").value;
        obj_for_seller['SIZE'] = size;
        obj_for_seller['COLOR'] = color;
        obj_for_prod['COLOR'] = color;
        obj_for_prod['SIZE'] = size;
        document.getElementById("size").value = "";
        document.getElementById("color").value = "";

    }
    else if (category == "Groceries") {
        let weight = document.getElementById('weight').value;
        obj_for_prod['WEIGHT'] = weight;
        obj_for_seller['WEIGHT'] = weight;
        document.getElementById('weight').value = "";
       
    }
    else if (category == "Luggage") {
        let water_ressistance = document.querySelector('input[name="water_ressistance"]:checked').value;
        let size = document.getElementById("size").value;
        obj_for_seller['SIZE'] = size;
        obj_for_prod['SIZE'] = size;
        document.getElementById("size").value = "";
        obj_for_prod['WATER_RESSISTANT'] = water_ressistance;
        obj_for_seller['WATER_RESSISTANT'] = water_ressistance;
        
    }
    else if (category == "Books") {

        let edition = document.querySelector('input[name="edition"]:checked').value;
        obj_for_seller['EDITION'] = edition;
        obj_for_prod['EDITION'] = edition;
    }

    console.log(obj_for_prod);
    console.log(obj_for_seller);

    
    // console.log(referral);
    let key = firebase.database().ref(category+"/").push().key;
   
    const ref = firebase.storage().ref(category+"/")

    const file_name = file.name+key;
    const metadata = {contentType:file.type};

    const task = ref.child(file_name).put(file,metadata);
    task.then( snap => snap.ref.getDownloadURL())
    .then(url => {
        obj_for_prod['URL'] = url;
        obj_for_seller['URL'] = url;
        
        
        if('DISCOUNT' in obj_for_prod ){
        firebase.database().ref(promotedprod).set(obj_for_prod,function(err){
            firebase.database().ref(promoteduser).set(obj_for_seller, function (err) {          
                document.getElementById("photo").value = null;
                document.getElementById("overlay").style.display = "none";  
            });
        }); 
           
        }else{
        firebase.database().ref(produpdate).set(obj_for_prod,function(err){
            firebase.database().ref(userupdate).set(obj_for_seller,function(err){
                document.getElementById("photo").value = null;
                document.getElementById("overlay").style.display = "none";
            });   
        });
        
    }       
    });    
}