import Address from "../models/Address.js";

//add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
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

    const newAddress = new Address({
      user: userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      coordinates: { lat: req.body.latitude, lng: req.body.longitude }, 
    });

    await newAddress.save();
    res.status(201).json({ message: "Address saved", address: newAddress });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving address", error: error.message });
  }
};

//get all users address

export const getUserAddresses = async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const addresses = await Address.find({ user: req.userId });

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
    const userId = req.userId; 

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
    const userId = req.userId; // assuming auth middleware sets this

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