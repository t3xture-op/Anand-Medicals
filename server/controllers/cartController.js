import Cart from '../models/Cart.js'
import Product from '../models/Product.js';

//add item to cart
export async function addItemToCart(req,res){
     try {
    const userId = req.userId;
    const { product, quantity } = req.body;

    if (!product) {
      return res.status(400).json({ message: "Provide product ID" });
    }

    // Check if cart exists for this user
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if product already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

      if (itemIndex > -1) {
        return res.status(400).json({ message: "Item already in cart" });
      } else {
        cart.items.push({ product, quantity: quantity || 1 });
      }
    } else {
      // If no cart, create a new one
      cart = new Cart({
        user: userId,
        items: [{ product, quantity: quantity || 1 }]
      });
    }

    await cart.save();
     
    res.status(201).json({ message: "Item added successfully", cart });

  } catch (error) {
    res.status(400).json({ message: "Cannot add item to cart", error: error.message });
  }
}




//get cart item 
export async function getCartItem(req,res){
   try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    return res.json({ cartItems: cart.items });
  } catch (error) {
    return res.status(400).json({
      message: 'Error fetching cart items',
      error: error.message
    });
  }
}




//update cart item quantity

export async function updateCartQuantity(req, res) {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (quantity > product.stock) {
    return res.status(400).json({ message: `Only ${product.stock} items in stock` });
  }

  const cart = await Cart.findOne({ user: userId });
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Cart item not found' });

  item.quantity = quantity;
  await cart.save();

  res.status(200).json({ message: 'Cart updated successfully' });
}



//delete cart item
export async function deleteCartItem(req,res){
     try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Provide product ID' });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    return res.status(400).json({
      message: 'Error deleting product from cart',
      error: error.message
    });
  }
}

//clear cart item controller
export async function clearCart(req, res) {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
}
