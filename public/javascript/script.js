const { json } = require("express")


function addToCart(productId){
    $.ajax({
        url : 'add-to-cart/'+productId,
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