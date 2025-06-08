import express from 'express';
import { getAllOrders,getOrderById,createOrder,cancelOrder,updateOrder ,getAllOrdersOfUser} from '../controllers/orderController.js';
import auth from '../middlewares/auth.js';

const orderRouter = express.Router();


//get all orders 
orderRouter.get('/',getAllOrders)


// Get all orders for a user
orderRouter.get('/my',auth,getAllOrdersOfUser)

// Get order by ID
orderRouter.get('/:id',auth,getOrderById)

// Create new order
orderRouter.post('/add',auth,createOrder)

// Update order status (admin only)
orderRouter.patch('/:id/status',auth,updateOrder)

// Cancel order
orderRouter.patch('/:id/cancel',auth,cancelOrder)


export default orderRouter;