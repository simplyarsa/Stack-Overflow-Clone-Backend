import express from 'express';
import auth from '../middlewares/auth.js';
import { order, verifyOrder, checkSubscription } from '../controllers/subscription.js';

const router=express.Router();

router.post('/order', order);
router.post('/verify', verifyOrder);
router.get('/check/:id', checkSubscription)


export default router;