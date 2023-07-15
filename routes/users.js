import express from 'express';
import { signup, login } from '../controllers/auth.js';
import { follow, getAllUsers, getFriends, unfollow, updateProfile } from '../controllers/users.js';
import auth from '../middlewares/auth.js';

const router=express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/getAllUsers', getAllUsers )
router.patch('/update/:id', auth , updateProfile)
router.put('/follow/:id', follow)
router.put('/unfollow/:id', unfollow)
router.get('/friends/:id', getFriends)

export default router;