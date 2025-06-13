// server/controllers/offerController.js
import Offer from '../models/offers.js';

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

// Delete Offer (🛠️ Fixed Version)
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
