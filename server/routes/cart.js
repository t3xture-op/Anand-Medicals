import express from 'express'
import { addItemToCart,updateCartQuantity,getCartItem,deleteCartItem , clearCart } from '../controllers/cartController.js'
import auth from '../middlewares/auth.js'

const cartRouter = express.Router()


//add item to cart
cartRouter.post('/add',auth,addItemToCart)

//get cart items
cartRouter.get("/get",auth,getCartItem)

//update cart item quantity
cartRouter.put('/update-quantity',auth,updateCartQuantity)

//remove item from cart
cartRouter.delete('/delete',auth,deleteCartItem)

//clear cart
cartRouter.delete('/clear',auth,clearCart)




export default cartRouter