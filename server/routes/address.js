import express from 'express'
import { getUserAddresses ,addAddress ,changeDefaultAddress ,getDefaultAddress } from "../controllers/addressController.js";
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

export default addressRouter