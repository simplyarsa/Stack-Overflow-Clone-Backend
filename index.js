import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import questionRoutes from './routes/Questions.js';
import answerRoutes from './routes/Answers.js';
import subscriptionRoutes from './routes/subscription.js';
import multer from 'multer';
import path from 'path';

const app=express();
dotenv.config();
app.use(express.json({limit:"30mb",extended:true}));
app.use(express.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')))

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    }
})
const upload=multer({storage});

app.post('/api/upload', upload.single('file'), (req,res)=>{
    try {
        return res.status(200).json('File uploded successfully');
    } catch (error) {
        console.error(error);
    }
})


app.get('/',(req,res)=>{
    res.send("Hello to memories API");
});

app.use('/user', userRoutes)
app.use('/questions', questionRoutes)
app.use('/answer',answerRoutes)
app.use('/subscription',subscriptionRoutes)

const PORT=process.env.PORT||5000;

const CONNECTION_URL=process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>console.log(`Server running on port: ${PORT}`)))
.catch((error)=>console.log(error.message));