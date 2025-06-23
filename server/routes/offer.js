// server/routes/offer.js
import express from 'express';
import {  addOffer,  editOffer,  deleteOffer,  getAllOffers, getOfferById ,getActiveOffer} from '../controllers/offerController.js';

const router = express.Router();

router.post('/admin/add', addOffer);
router.put('/admin/edit/:id', editOffer);
router.delete('/admin/:id', deleteOffer); 
router.get('/', getAllOffers);
router.get('/active',getActiveOffer)
router.get('/admin/:id', getOfferById);


export default router;
