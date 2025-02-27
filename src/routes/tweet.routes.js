import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweet,
  updateTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(updateTweets).delete(deleteTweet);

export default router;
