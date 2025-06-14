import express from 'express';
import { addPrescription, getAllPrescriptions ,getPrescriptionById ,reviewPrescription ,deletePrescription} from '../controllers/prescriptionController.js';
import { uploadPrescription } from '../middlewares/cloudinary.js';
import auth  from '../middlewares/auth.js'; // Auth middleware

const router = express.Router();

router.post('/add', auth,uploadPrescription.single('file'), addPrescription);
router.get('/all', auth, getAllPrescriptions);
router.get('/:id',auth, getPrescriptionById);
router.put('/review/:id',auth, reviewPrescription);
router.delete('/:id', auth, deletePrescription)

export default router;
