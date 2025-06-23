import express from 'express';
import { getAllOrders,getOrderById,createOrder,cancelOrder,updateOrder ,getAllOrdersOfUser ,getAllUserOrderStats} from '../controllers/orderController.js';
import auth from '../middlewares/auth.js';

const orderRouter = express.Router();


//get all orders 
orderRouter.get('/admin',getAllOrders)


// Get all orders for a user
orderRouter.get('/my',auth,getAllOrdersOfUser)

// Create new order
orderRouter.post('/add',auth,createOrder)

// Update order status (admin only)
orderRouter.patch('/admin/:id/status',auth,updateOrder)

// Cancel order
orderRouter.patch('/:id/cancel',auth,cancelOrder)

//get order status of all users
orderRouter.get('/admin/user-order-stats',auth,getAllUserOrderStats)


// Get order by ID
orderRouter.get('/admin/:id',auth,getOrderById)

export default orderRouter;