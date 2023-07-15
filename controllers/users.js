import mongoose from "mongoose";
import User from '../models/auth.js'

export const getAllUsers = async (req, res) => {
    
    try {
        const allUsers = await User.find();
        const allUserDetails=[]
        allUsers.forEach(users=>{
            allUserDetails.push({name:users.name, email:users.email, _id:users._id, tags: users.tags, joinedOn: users.joinedOn, about: users.about})
        })
        res.status(200).json(allUserDetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    const {id: _id }=req.params;
    const {name ,about, tags}=req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with that id');

    try {
        const updatedProfile=await User.findByIdAndUpdate(_id, { $set: {'name': name, 'about': about, 'tags': tags}}, {new: true});
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(405).json({ message: error.message }); 
    }
}

export const follow=async(req,res)=>{
    if(req.body.userId !==req.params.id){
        try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("user has been followed")
            }
            else{
                res.status(403).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You cannot follow yourself")
    }
}

export const unfollow=async(req,res)=>{
    if(req.body.userId !==req.params.id){
        try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("user has been unfollowed")
            }
            else{
                res.status(403).json("You dont follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You cannot unfollow yourself")
    }
}

export const getFriends=async(req,res)=>{   
    try {
        const user=await User.findById(req.params.id);
        const friends=await Promise.all(
            user.followings.map(friendId=>{
                return User.findById(friendId)
            }))
            let friendList=[];
        friends.map(friend=>{
            const {_id,name,about,tags}=friend;
            friendList.push({_id,name,about,tags})
        })
        return res.status(200).json(friendList)
    } catch (error) {
        res.status(500).json(error)
    }
}