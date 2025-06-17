import Offers from "../models/offers.js";



export async function applyActiveOfferToProduct(product) {
  const activeOffers = await Offers.find({ status: 'active' }).populate('products');

  for (const offer of activeOffers) {
    const match = offer.products.find(p => p._id.toString() === product._id.toString());
    if (match) {
      const discountAmount = (product.price * offer.discount) / 100;
      product = product.toObject(); // convert from Mongoose document
      product.discount = offer.discount;
      product.discount_price = Math.round((product.price - discountAmount) * 100) / 100;
      return product;
    }
  }

  return product.toObject(); // if no offer, return normal product
}
