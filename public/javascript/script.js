const { response } = require("express")




function addToCart(productId){
    $.ajax({
        url : '/add-to-cart/'+productId,
        method : 'get',
        success : (response)=>{
            if(response.value == "1"){
                let count = $('#count').html()
                count = parseInt(count)+1
                $('#count').html(count)
            }
            else{

            }
        }
    })
}

function changeQuantity(cartId,userId,productId,changeCount){
    let quantity = parseInt(document.getElementById(productId).innerHTML)
    $.ajax({
        url : '/change-quantity',
        data :{
            userId : userId,
            cartId : cartId,
            productId : productId,
            changeCount : changeCount,
            quantity : quantity
        },
        method : 'post',
        success:(response)=>{
            if(response.removeProduct){
                alert("Product removed from cart")
                location.reload()
            }
            else{
                console.log(response);
                document.getElementById(productId).innerHTML=quantity + changeCount
                document.getElementById('total').innerHTML = response.total
            }
        }
    })
}

function removeProduct(cartId,productId){
    $.ajax({
        url : '/remove-product',
        data : {
            cartId : cartId,
            productId : productId
        },
        method : 'post',
        success : (response)=>{
                alert("Product removed from cart")
                location.reload()
        }
    })
}
    
function shipping(orderId){
        $.ajax({
            url : '/admin/shipping',
            data : {
                orderId : orderId
            },
            method : 'post',
            success : (status)=>{

                alert('Shipped!!!')
                location.reload()
                document.getElementById('status').innerHTML = status
            }
        })
}

function Cancel(orderId){
    $.ajax({
        url : '/admin/cancel/'+orderId,
        success : (status)=>{
            location.reload()
        }
    })
}

function userCancel(orderId){
    $.ajax({
        url : '/cancel/'+orderId,
        success : (status)=>{
            location.reload()
        }
    })
}