import express from 'express'
import { addItemToCart,updateCartItemQty,getCartItem,deleteCartItem } from '../controllers/cartController.js'
import auth from '../middlewares/auth.js'

const cartRouter = express.Router()


//add item to cart
cartRouter.post('/add',auth,addItemToCart)

//get cart items
cartRouter.get("/get",auth,getCartItem)

//update cart item quantity
cartRouter.put('/update-quantity',auth,updateCartItemQty)

//remove item from cart
cartRouter.delete('/delete',auth,deleteCartItem)




export default cartRouter