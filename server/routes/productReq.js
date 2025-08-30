import express from 'express'
import auth from '../middlewares/auth.js'
import { getAllProductReq ,changeReqStatus ,getProductReqById , reqProduct ,deleteProductReq} from '../controllers/productReqController.js'

const router = express.Router();

router.post('/add', auth, reqProduct);
router.get('/all',  getAllProductReq);
router.get('/:id', getProductReqById);
router.put('/status/:id',  changeReqStatus);
router.delete('/delete/:id',  deleteProductReq);

export default router;
