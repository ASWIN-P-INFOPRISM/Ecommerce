const { response } = require("express")



function addToCart(productId){
    $.ajax({
        url : '/add-to-cart/'+productId,
        method : 'get',
        success : (response)=>{
            if(response.status){
                let count = $('#count').html()
                count = parseInt(count)+1
                $('#count').html(count)
            }
        }
    })
}

function changeQuantity(cartId,productId,changeCount){
    let quantity = parseInt(document.getElementById(productId).innerHTML)
    $.ajax({
        url : '/change-quantity',
        data :{
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
                document.getElementById(productId).innerHTML=quantity + changeCount
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