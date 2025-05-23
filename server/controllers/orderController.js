import Order from '../models/Order.js';

//get all orders
export async function getAllOrders(req,res){
 try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .populate('shippingAddress');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
  }


  //get order by id
  export async function getOrderById(req,res){
     try {
        const order = await Order.findOne({
          _id: req.params.id,
          user: req.user._id
        })
          .populate('items.product')
          .populate('shippingAddress');
        
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
      }
  }


  //create new order
  export async function createOrder(req,res){
    try {
        const order = new Order({
          user: req.user._id,
          items: req.body.items,
          shippingAddress: req.body.shippingAddress,
          totalAmount: req.body.totalAmount,
          paymentMethod: req.body.paymentMethod
        });
        await order.save();
        res.status(201).json(order);
      } catch (error) {
        res.status(400).json({ message: 'Error creating order' });
      }
  }


  //Update order status (admin only)
  export async function updateOrder(req,res){
     try {
        const order = await Order.findByIdAndUpdate(
          req.params.id,
          { status: req.body.status },
          { new: true }
        );
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
      } catch (error) {
        res.status(400).json({ message: 'Error updating order status' });
      }
  }

  //cancel order
  export async function cancelOrder(req,res){
      try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error cancelling order' });
  }
  }