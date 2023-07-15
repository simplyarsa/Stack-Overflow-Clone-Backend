import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({ 
    questionTitle:{type:String, default:''},
    questionBody:{type:String,required: "Question must have a body"},
    questionTags:{type:[String], default:''},
    noOfAnswers:{type:Number,default:0},
    upVote:{type:[String], default:[]},
    downVote:{type:[String], default:[]},
    userPosted:{type:String,required: "Question must have a user"},
    userId:{type:String},
    askedOn:{type:Date,default:Date.now},
    answer:[{
        answerBody:String,
        userAnswered:String,
        userId:String,
        answeredOn:{type:Date,default:Date.now},
    }],
    img:{type:String},
    type: { type: String, default: 'Q' },
})

export default mongoose.model("Question",QuestionSchema);