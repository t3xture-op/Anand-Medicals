import Address from "../models/Address.js";
import User from '../models/User.js'

//add address

export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newAddressData = {
      user: userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    };

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Only add coordinates if valid
    if (!isNaN(lat) && !isNaN(lng)) {
      newAddressData.coordinates = { lat, lng };
    }

    const newAddress = new Address(newAddressData);
    await newAddress.save();

    const allAddresses = await Address.find({ user: userId }).sort({ createdAt: -1 });

    res.status(201).json({ message: "Address saved", addresses: allAddresses });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Error saving address", error: error.message });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const addresses = await Address.find({ user: req.user._id });

    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error in getUserAddresses:", error.message);
    res.status(500).json({
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};


//update default address
export async function changeDefaultAddress(req, res) {
  try {
    const addressId = req.params.id;
    const userId = req.user._id  

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.updateMany(
      { user: userId, isDefault: true },
      { $set: { isDefault: false } }
    );

    address.isDefault = true;
    await address.save();

    res.status(200).json({ message: "Default address updated", address });
  } catch (error) {
    console.error("changeDefaultAddress error:", error.stack);
    res.status(500).json({ message: "Server error" });
  }
}


//get default address of a user
export async function getDefaultAddress(req, res) {
  try {
    const userId = req.user._id  

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const defaultAddress = await Address.findOne({ user: userId, isDefault: true });

    if (!defaultAddress) {
      return res.status(404).json({ message: 'Default address not found' });
    }

    res.status(200).json({ address: defaultAddress });
  } catch (error) {
    console.error('getDefaultAddress error:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
}


//edit an address
export const editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user._id;

    const {
      fullName,
      phoneNumber,
      addressLine1, 
      addressLine2,
      city,
      state,
      pincode,
      country, 
      latitude,
      longitude,
    } = req.body;

    if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    address.fullName = fullName;
    address.phoneNumber = phoneNumber;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2 || "";
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    if (country) address.country = country;

    // Update coordinates only if provided
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      address.coordinates = {
        lat,
        lng,
      };
    }

    await address.save();

    const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Address updated", addresses });
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//delete address

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.isDefault) {
      return res.status(400).json({ message: "Default address cannot be deleted" });
    }

    await Address.findByIdAndDelete(addressId);

    const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ addresses });
  } catch (err) {
    console.error("Error deleting address:", err);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
