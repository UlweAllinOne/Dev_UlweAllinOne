var map = {};
var deliveryCharge=0;
var disc=0;
var context = "https://m8gohcb5gc.execute-api.ap-south-1.amazonaws.com/dev/veg/";
cardCount();
function initMap(type){
	$('#lodaingModal').modal('show');
	$.ajax({
			  type: 'POST',
			  url: context + "getAllVegProducts",
			  success: function (response) { 
				
					$(response).each(function(){
							map[$(this).attr('id')]=$(this).attr('productName')+","+$(this).attr('maxPrice')+","+$(this).attr('minPrice')+","+$(this).attr('discount')+","+$(this).attr('productDesc')+","+$(this).attr('stockStatus');
							
					})
						if(type == 'H'){
							generateProduct();
							
						}
						localStorage.setItem("vegmymap",JSON.stringify(map))	;
						
						setTimeout(hidePopup, 500);
					},
			  error : function (response) { 						
					setTimeout(hidePopup, 500);
					alert(response);
					}

			});
			
		
}

function hidePopup(){
	$('#lodaingModal').modal('hide');
}


function cardCount(){
	var count= 0;
	var iteams  = localStorage.getItem("vegcard");
	if(iteams != null){
		$.each(iteams.split(','),function(i,j){
			if(j != "null" && j != ""){
				count++;
			}
		});
	}
	$(".cardCount").html("["+count+"]");
}

function addtoCard(id){
	localStorage.setItem("vegcard",localStorage.getItem("vegcard")+","+id);
	alert(map[id].split(",")[0]+ " successfully added to cart.");
	cardCount();
	return false;
}

function calcuateAmt(obj,j,orgValue,id){
	if($(obj).val() > 0 && $(obj).val() < 10){
		var value= $(obj).val() * orgValue;
		$("#totVal"+j).html(value + " Rs").attr('data-val',id+','+$(obj).val());
	}
	mainTotal();
	return false;
}
var finalOrderDetails="";
function mainTotal(){
	var sum = 0;
	$.each($(".total"),function(i,j){
		var value = $(j).html().split(" ");
		sum = sum + parseInt(value[0]);
	});
	$("#finalTotal").html(sum + " Rs");
	if(sum <= 50){
		deliveryCharge=20;
	}else if(sum <= 100 && sum > 50){
		deliveryCharge=10;
	}else if(sum <= 200 && sum > 101){
		deliveryCharge=5;
	}else if(sum > 200){
		deliveryCharge=0;
	}
	$("#deliveryCharge").html(deliveryCharge + " Rs");
	$("#disc").html(disc + " Rs");
	var finalTot = parseInt(sum) + parseInt(deliveryCharge) - parseInt(disc);
	$("#mainTotal").html(finalTot + " Rs");
	finalOrderDetails = sum+","+finalTot;
}

function removeProduct(j,i){
	var iteams  = localStorage.getItem("vegcard");
	iteams = iteams.replace(j,"");
	localStorage.setItem("vegcard",iteams);
	$("#sectiondetails"+i).remove();
	mainTotal();
	cardCount();
	return false;
}
function initCart(){
	map = JSON.parse(localStorage.getItem("vegmymap"));
	displayCardDetails();
}

function displayCardDetails(){
	
	var iteams  = localStorage.getItem("vegcard");
	$.each(iteams.split(','),function(i,j){
	if(j != "null" && j != ""){
		var value = map[j].split(',');
		var str = '<tr class="text-center" id="sectiondetails'+i+'"><td class="product-remove"><a href="#" onclick="return removeProduct('+j+','+i+')"><span class="ion-ios-close"></span></a></td><td class="image-prod"><div class="img" style="background-image:url(images/product-'+j+'.jpg);"></div></td><td class="product-name"><h3>'+value[0]+'</h3><p>'+value[4]+'</p></td><td class="price">'+value[2]+' Rs</td><td class="quantity"><div class="input-group mb-3"><input type="text" name="quantity'+i+'"  onkeyup="return calcuateAmt(this,'+i+','+value[2]+','+j+')" onchange="return calcuateAmt(this,'+i+','+value[2]+','+j+')" class="quantity form-control input-number" value="1" maxlength="1"></div></td><td id="totVal'+i+'" data-val="'+j+',1" class="total">'+value[2]+' Rs</td></tr>';
		$("#cardDetails").append(str);
	}
	});
	mainTotal();
}

function generateProduct(){
	
	$.map(map, function(value,key){
	var valuesDetails = value.split(",");
	var disc = '';
	if(valuesDetails[3] != "" && valuesDetails[3] != " "){
		disc='<span class="status">'+valuesDetails[3] +'</span>'
	}
	var outOfStock
	if(valuesDetails[5] == "Y" ){
		outOfStock='<input type="button" onClick="return addtoCard('+key+')" class="btn btn-primary" value="Add to Cart">';
	}else{
		outOfStock='<span class="btn btn-danger">Out of Stock</span>';
	}
	var ourProducts = '<div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated"><div class="product"><a href="#" class="img-prod"><img class="img-fluid" src="images/product-'+key+'.jpg" alt="UlweAllinOne">'+disc +'<div class="overlay"></div></a><div class="text py-3 pb-4 px-3 text-center"><h3><a href="#">'+valuesDetails[0]+'</a></h3><div class="d-flex"><div class="pricing123"><p class="price"><span class="mr-2 price-dc">'+valuesDetails[1]+' Rs</span><span class="price-sale">'+valuesDetails[2]+' Rs</span><span class="price-sale">&nbsp;&nbsp;</span>'+outOfStock+'</p></div></div></div></div></div>';
	$("#productDetails").append(ourProducts);
	});
}

function checkOut(){
	
	var details="";
	$(".total").each(function(){
		details = details + $(this).attr("data-val") +"#";
	})
	details = details.substr(0,details.length -1);

	localStorage.setItem("vegdetailsitms",details);
	location.href="checkout.html";	
}

function closePopup(){
	$('#lodaingModal').modal('hide');
	localStorage.removeItem("vegmymap");
	localStorage.removeItem("vegcard");
	localStorage.removeItem("vegdetailsitms");
	location.href="VegeFruitsindex.html";
	
}


function placeOrder(){
	
	if($("#fname").val() == '' ){
		   alert('Please enter your Name.');
		   $("#fname").focus()
		   return false;
	   	}
	 	if($("#streetAddress").val() == '' ){
		   alert('Please enter Address.');
		 $("#streetAddress").focus()
		   return false;
	   	}
		 if($("#mobileNo").val() == '' ){
		   alert('Please enter Mobile Number.');
		 $("#mobileNo").focus()
		   return false;
	   	}
		 if($("#mobileNo").val().length != 10 ){
			   alert('Please enter 10 digit Mobile Number.');
			 $("#mobileNo").focus()
			   return false;
		   	}
		 if($("#emailid").val() == '' ){
		   alert('Please enter emailid.');
		   $("#emailid").focus()
		   return false;
	   }
	
	var r = confirm("Are you sure you want to place order?");
		if (r == true) {
		
	$('#lodaingModal').modal('show');
	$("#closeButton").hide();
	var iteams  = finalOrderDetails;
	$("#finalTotal").html(iteams.split(',')[0]);
	$("#deliveryCharge").html(deliveryCharge);
	$("#disc").html(disc);
	$("#mainTotal").html(iteams.split(',')[1]);
	var array = {};
	array["userName"]=$("#fname").val() + " "+$("#lname").val();
	array["address"]=$("#sector").val()+ ", "+$("#apartment").val()+ ", "+$("#streetAddress").val()+", "+$("#city").val()+ ", "+$("#pincode").val();
	array["emailid"]=$("#emailid").val();
	array["mobileNo"]=$("#mobileNo").val();
	array["devCharge"]=deliveryCharge;
	array["discount"]=disc;
	array["totPrice"]=iteams.split(',')[0];
	array["finalPrice"]=iteams.split(',')[1];
	
	var details="";
	$(".total").each(function(){
		details = details + $(this).attr("data-val") +"#";
	})
	details = details.substr(0,details.length -1);

	
	array["orderDetails"]=details;
	$.ajax({
			  type: 'POST',
			  url: context + "saveVegOrders",
			  data:JSON.stringify(array),
			  success: function (response) { 
						$("#orderConfirmationContent").html(response);
						$("#closeButton").show();
					},
			  error : function (response) { 						
					$('#lodaingModal').modal('hide');
					$("#closeButton").show();
					alert(response);
					}

			});
	
		}
}