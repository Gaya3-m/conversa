import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getReccommendedUsers(req, res){
    try{
        const currUserId=req.user.id;
        const currUser=req.user;

        const reccommendedUsers=await User.find({
            $and:[
                {_id: {$ne: currUserId}},
                {_id: {$nin: currUser.friends}},
                {isOnboarded: true},
            ],
        });
        res.status(200).json(reccommendedUsers);
    }
    catch(error){
        console.error("Error in getReccommendedUsers controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getMyFriends(req, res){
    try{
        const currUserId=req.user.id;

        const user=await User.findById(currUserId).select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    }
    catch(error){
        console.error("Error in getMyFriends controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function sendFriendRequest(req, res){
    try{
        const myId=req.user.id;
        const {id: recipientId}=req.params;

        //sending a friend request to yourself is not allowed
        if(myId===recipientId){
            return res.status(400).json({message: "You can't send a friend request to yourself"});
        }

        //check if the recipient exists
        const recipient=await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message: "Recipient not found"});
        }

        //check if the recipient is already a friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"});
        }

        //check if you already sent a friend request to this user
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ]
        })

        if(existingRequest){
            return res.status(400).json({message: "Friend request already sent"});
        }

        const friendRequest=await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });
        res.status(201).json(friendRequest);        
    }
    catch(error){
        console.error("Error in sendFriendRequest controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function acceptFriendRequest(req, res){
    try {
        const myId=req.user.id;
        const {id: requestId}=req.params;
        const friendRequest=await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message: "Friend request not found"});
        }

        if(friendRequest.recipient.toString()!==myId){
            return res.status(403).json({message: "You are not authorized to accept this friend request"});
        }

        friendRequest.status="accepted";
        await friendRequest.save();

        //add each other to friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({message: "Friend request accepted"});

    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getFriendRequests(req, res){
    try{
        const userId = req.user.id;

        // Incoming pending requests
        const incomingRequests = await FriendRequest.find({
            recipient: userId,
            status:"pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        // Accepted requests where user is sender or recipient
        const acceptedRequests = await FriendRequest.find({
            $or: [
                {sender: userId, status: "accepted"}
            ]
        })
        .populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingRequests, acceptedRequests });
    }
    catch(error){
        console.error("Error in getFriendRequests controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getOutgoingFriendReqs(req, res){
    try{
        const outgoingRequests=await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    }
    catch(error){
        console.error("Error in getOutgoingFriendReqs controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}