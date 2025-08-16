import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getReccommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs } from "../controllers/user.controller.js";

const router=express.Router();

//auth middleware is applied to all routes and can be accessed only if the user is authenticated
router.use(protectRoute);

router.get("/", getReccommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;