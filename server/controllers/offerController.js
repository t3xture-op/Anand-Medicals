import Offer from '../models/offers.js';
import Product from '../models/Product.js'
import { applyActiveOfferToProduct } from '../utils/applyActiveOfferToProduct.js';

// Add Offer
export const addOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ message: 'Offer created successfully', offer });
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ message: 'Failed to add offer' });
  }
};


// Edit Offer
export const editOffer = async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: 'Offer updated', offer: updatedOffer });
  } catch (error) {
    console.error('Error editing offer:', error);
    res.status(500).json({ message: 'Failed to update offer' });
  }
};


// Delete Offer 
export const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Failed to delete offer' });
  }
};


// Get All Offers
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
};


//get offer by id
export async function getOfferById(req, res) {
  try {
    const offer = await Offer.findById(req.params.id).populate('products', 'name image');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.status(200).json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ message: 'Failed to fetch offer' });
  }
}

//get Active offers
export async function getActiveOffer(req, res) {
  try {
    const offers = await Offer.find({ status: "active" }).populate('products');
    if (!offers || offers.length === 0) {
      return res.status(404).json({ message: "No active offers" });
    }

    // Apply offer price to each product in each offer
    const updatedOffers = await Promise.all(offers.map(async (offer) => {
      const updatedProducts = await Promise.all(
        offer.products.map((product) => applyActiveOfferToProduct(product))
      );

      return {
        ...offer.toObject(),
        products: updatedProducts
      };
    }));

    res.status(200).json(updatedOffers);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ message: 'Failed to fetch offers', error: error.message });
  }
}


