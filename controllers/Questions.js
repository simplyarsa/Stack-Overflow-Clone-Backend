import Questions from "../models/Questions.js"
import mongoose from "mongoose"
import users from "../models/auth.js"

export const AskQuestion = async (req, res) => {
    
    const {userId}=req.body
    const postQuestionData=req.body;
    const postQuestion=new Questions(postQuestionData);
    try{
        await postQuestion.save();
        if(req.body.type==='S'){
            await users.findByIdAndUpdate(userId);
        }
        else{
            await users.findByIdAndUpdate(userId,{$inc:{numberOfQuestions:1}});
        }
        res.status(200).json(postQuestion);
    }catch(error){
        res.status(409).json({message:error.message});
    }

}

export const getAllQuestions = async (req, res) => {
    try {
        const questionList = await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No question with that id');
    }
    try {
        await Questions.findByIdAndRemove(_id);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const voteQuestion = async (req, res) => {
    const {id: _id}=req.params;
    const {value, userId}=req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No question with that id');
    }

    try {
        const question=await Questions.findById(_id);
        const upIndex=question.upVote.findIndex((id)=>id===String(userId));
        const downIndex=question.downVote.findIndex((id)=>id===String(userId));

        if(value==='upvote'){
            if(downIndex!==-1){
                question.downVote=question.downVote.filter((id)=>id!==String(userId));
            }
            if(upIndex===-1){
                question.upVote.push(userId);
            }else{
                question.upVote=question.upVote.filter((id)=>id!==String(userId));
            }
        }

        else if(value==='downvote'){
            if(upIndex!==-1){
                question.upVote=question.upVote.filter((id)=>id!==String(userId));
            }
            if(downIndex===-1){
                question.downVote.push(userId);
            }else{
                question.downVote=question.downVote.filter((id)=>id!==String(userId));
            }
        }

        await Questions.findByIdAndUpdate( _id, question);
        res.status(200).json({message:'voted successfully'});
    } catch (error) {
        res.status(404).json({ message: "id not found" });
    }
}

export const getAllFriendsQuestions = async (req, res) => {
    const {id: _id}=req.params;
    try {
        const user=await users.findById(_id);    
        const questions=await Questions.find({userId: _id})
        const questionList = await Questions.find( {$or : [{userId: {$in:user.followings}}, {userId: _id} ,  ] , type: "S"}).sort({askedOn :-1});
        // const questionList = await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}