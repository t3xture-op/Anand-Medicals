// server/routes/offer.js
import express from 'express';
import {  addOffer,  editOffer,  deleteOffer,  getAllOffers, getOfferById ,getActiveOffer} from '../controllers/offerController.js';

const router = express.Router();

router.post('/add', addOffer);
router.put('/edit/:id', editOffer);
router.delete('/:id', deleteOffer); 
router.get('/', getAllOffers);
router.get('/active',getActiveOffer)
router.get('/:id', getOfferById);


export default router;
