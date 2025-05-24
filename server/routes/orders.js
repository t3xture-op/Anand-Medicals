import express from 'express';
import { getAllOrders,getOrderById,createOrder,cancelOrder,updateOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Get all orders for a user
orderRouter.get('/',getAllOrders)

// Get order by ID
orderRouter.get('/:id',getOrderById)

// Create new order
orderRouter.post('/',createOrder)

// Update order status (admin only)
orderRouter.patch('/:id/status',updateOrder)

// Cancel order
orderRouter.patch('/:id/cancel',cancelOrder)

export default orderRouter;