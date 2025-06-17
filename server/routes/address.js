import express from 'express'
import { getUserAddresses ,addAddress ,editAddress ,changeDefaultAddress ,getDefaultAddress ,deleteAddress} from "../controllers/addressController.js";
import auth from '../middlewares/auth.js'
const addressRouter = express.Router()


//add address
addressRouter.post('/add',auth,addAddress);

//get all user address
addressRouter.get('/',auth,getUserAddresses);

//change default address
addressRouter.put('/edit-default/:id',auth,changeDefaultAddress)

//get deafaut address
addressRouter.get('/default',auth,getDefaultAddress);

//edit an address
addressRouter.put("/edit/:id", auth, editAddress);

//delete an address by a user
addressRouter.delete("/delete/:id", auth, deleteAddress);

export default addressRouter