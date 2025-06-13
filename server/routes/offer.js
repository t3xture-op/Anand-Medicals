// server/routes/offer.js
import express from 'express';
import {
  addOffer,
  editOffer,
  deleteOffer,
  getAllOffers,
} from '../controllers/offerController.js';

const router = express.Router();

router.post('/', addOffer);
router.put('/edit/:id', editOffer);
router.delete('/:id', deleteOffer); // ✅ delete route
router.get('/', getAllOffers);

export default router;
