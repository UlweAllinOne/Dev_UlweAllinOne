var map = {};
var deliveryCharge=0;
var disc=0;
var context = "https://m8gohcb5gc.execute-api.ap-south-1.amazonaws.com/dev/veg/";
var contextCommon = "https://m8gohcb5gc.execute-api.ap-south-1.amazonaws.com/dev/common/";

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
			if(j != "null" && j != "" && j.split("#")[0] != ""){
				count++;
			}
		});
	}
	$(".cardCount").html("["+count+"]");
}

function addtoCard(id,obj){
	var cardId = id +"#"+ $(obj).parent().parent().find('input').eq(0).val()
	localStorage.setItem("vegcard",localStorage.getItem("vegcard")+","+cardId);
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
	$.each(iteams.split(','),function(i,p){
	if(p != "null" && p != ""){
		var k=p.split("#")[1];
		if(k == undefined){
			k=1;
		}
		var j=p.split("#")[0];
		if(j != ""){
		var value = map[j].split(',');
		var finalPrice = value[2] * k;
		var clickFn = "return removeProduct('"+p+"',"+i+")";
		var str = '<div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated" id="sectiondetails'+i+'"><div class="product"><a href="#" style="text-align: center" class="img-prod"><img class="img-fluid" src="images/product-'+j+'.jpg" alt="Colorlib Template"><div class="overlay"></div></a><div class="text py-3 pb-4 px-3 text-center"><h3><a href="#">'+value[0]+'</a></h3><div class="pricing123"><p class="price"><span class="price-sale">Price - '+value[2]+' Rs</span><br><span class="price-sale">&nbsp;&nbsp;Quantity - '+k+'</span><br><span class="price-sale">&nbsp;&nbsp;Final Price - '+finalPrice+' Rs</span><br><span class="price-sale">&nbsp;&nbsp;<input type="button" value="Remove from cart" onclick="'+clickFn +'" class="btn btn-primary"  ></span><span class="total" style="display:none" data-val="'+j+','+k+'" id="totVal'+i+'">'+finalPrice+' Rs</span></p></div></div></div></div>';
		$("#cardDetailsData").append(str);
		}
	}
	});
	mainTotal();
}

function checkQty(obj){
	if($(obj).val() != ""){
	if(! ($(obj).val() > 0 && $(obj).val() < 10)){
		$(obj).val('1')
	}
	}
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
		outOfStock='<br><span> Quantity <input type="number" value="1" min="1" max="9" size="4" onKeyup="return checkQty(this)" style="margin-bottom: 6px;text-align: center;"></span><input type="button" onClick="return addtoCard('+key+',this)" class="btn btn-primary" value="Add to Cart">';
	}else{
		outOfStock='<span class="btn btn-danger">Out of Stock</span>';
	}
	var ourProducts = '<div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated productNameClass" data-id="'+valuesDetails[0]+'" ><div class="product"><a href="#" class="img-prod" style="text-align: center"><img class="img-fluid" src="images/product-'+key+'.jpg" alt="UlweAllinOne">'+disc +'<div class="overlay"></div></a><div class="text py-3 pb-4 px-3 text-center"><h3><a href="#">'+valuesDetails[0]+'</a></h3><div class="d-flex"><div class="pricing123"><p class="price"><span class="mr-2 price-dc">'+valuesDetails[1]+' Rs</span><span class="price-sale">'+valuesDetails[2]+' Rs</span><span class="price-sale">&nbsp;&nbsp;</span>'+outOfStock+'</p></div></div></div></div></div>';
	$("#productDetails").append(ourProducts);
	});
}

function displaySearchResult(obj){
	
	if($(obj).val() != ""){
		$(".productNameClass").each(function(){
			if($(this).attr('data-id').toLowerCase().indexOf($(obj).val().toLowerCase()) == -1){
				$(this).hide();
			}
		})
	}else{
		$(".productNameClass").show();
	}
}

function checkOut(){
	
	var details="";
	$(".total").each(function(){
		details = details + $(this).attr("data-val") +"#";
	})
	details = details.substr(0,details.length -1);

	localStorage.setItem("milkdetailsitms",details);
	location.href="checkout.html";	
}

function closePopup(){
	$('#lodaingModal').modal('hide');
	localStorage.removeItem("vegmymap");
	localStorage.removeItem("vegcard");
	localStorage.removeItem("vegdetailsitms");
	location.href="MilkProductindex.html";

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

function initOrderDetails(){
		$('#lodaingModal').modal('show');
			var data = '{"category":"V","password":"'+$("#password").val()+'"}';
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "getOrderHistory",
			  data : data,
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					generateDetails(response);
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);					
					alert(response.responseJSON);
					
					}

			});



}

function generateDetails(response1){
	$("#orderDetails").html("");
	var str ="";
	var lastDate = "";
	var count =1;
	var detailsmsg = "";
	$(response1).each(function(i,response){
		var selectdd ="";
		if($($(response).attr('master')).attr('orderStatus') != 'Delivered'){
		selectdd = '<select id="statusddval'+count+'"><option value="In-Progress">In-Progress</option><option value="Delivered">Delivered</option><option value="UnReachable">UnReachable</option></select>&nbsp;&nbsp;<input type="button" data-id="'+$($(response).attr('master')).attr('id')+'" class="btn btn-primary" onclick="return updatestatus(this,'+count+')" value="update" />';
	
		}
		if(lastDate != $($(response).attr('user')).attr('datetime').substr(0,10)){
			str = str.replace("#runtime#",detailsmsg);
			detailsmsg = "";
			detailsmsg = detailsmsg + '<p >'+count +'. OrderId <b>'+$($(response).attr('master')).attr('orderid')+'</b> placed by <b>'+$($(response).attr('user')).attr('userName')+'</b> using Mobile No. <b>'+$($(response).attr('user')).attr('mobileNo')+'</b> with Total amount <b>'+ $($(response).attr('master')).attr('finalPrice')+' Rs</b> having order status <b>'+$($(response).attr('master')).attr('orderStatus')+'</b>.'+selectdd;
			str = str +  '<div class="col-sm-12"><div class="cart-wrap ftco-animate fadeInUp ftco-animated"><div class="cart-total mb-3"><h3>'+$($(response).attr('user')).attr('datetime').substr(0,10)+'</h3><div id="detailssub">#runtime#</div></div></div></div>';
			
			lastDate = $($(response).attr('user')).attr('datetime').substr(0,10);
			
		}else{
			detailsmsg = detailsmsg + '<p >'+count +'. OrderId <b>'+$($(response).attr('master')).attr('orderid')+'</b> placed by <b>'+$($(response).attr('user')).attr('userName')+'</b> using Mobile No. <b>'+$($(response).attr('user')).attr('mobileNo')+'</b> with Total amount <b>'+ $($(response).attr('master')).attr('finalPrice')+' Rs</b> having order status <b>'+$($(response).attr('master')).attr('orderStatus')+'</b>.'+selectdd;
				
		}
	
	count++;
	});
	str = str.replace("#runtime#",detailsmsg);
	$("#orderDetails").append(str);



}

function updatestatus(obj,count){

	var data = '{"category":"V","password":"'+$("#password").val()+'","masterid":"'+$(obj).attr('data-id')+'","status":"'+$("#statusddval"+count).val()+'"}';
		 $.ajax({
			  type: 'POST',
			  url: contextCommon + "updateOrderStatus",
			  data : data,
			  success: function (response) { 
					
					alert(response);
					},
			  error : function (response) { 						
					
					alert(response);
					}

			});


}		