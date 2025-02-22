import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  //Todo: create tweet
});

const getUserTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //Todo: get user tweets
});

const updateTweets = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //Todo: update tweets
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //Todo: delete tweet
});

export { createTweet, getUserTweet, deleteTweet, updateTweets };
