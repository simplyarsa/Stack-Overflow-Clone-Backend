import mongoose from 'mongoose';

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String, required:true},
    password:{type:String,required:true},
    about:{type:String,default:""},
    tags:{type:[String]},
    joinedOn:{type:Date,default:Date.now},
    followers:{type:Array, default:[]},
    followings:{type:Array, default:[]},
    subscription: {type: String, default: "free"},
    subsExpire: {type: Number},
    numberOfQuestions: {type: Number, default: 0},
})

export default mongoose.model('User',userSchema);