import express from 'express';
import {AskQuestion, getAllQuestions, deleteQuestion, voteQuestion, getAllFriendsQuestions} from '../controllers/Questions.js';
import auth from '../middlewares/auth.js';
import { chatbot } from '../controllers/chatbot.js';

const router = express.Router();

router.post('/Ask', auth, AskQuestion);
router.get('/get', getAllQuestions);
router.delete('/delete/:id', auth, deleteQuestion);
router.patch('/vote/:id', auth, voteQuestion);
router.post('/chatbot', chatbot)
router.get('/friendspost/:id', getAllFriendsQuestions)

export default router;