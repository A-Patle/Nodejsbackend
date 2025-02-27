import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  //Todo: create tweet
  const { content } = req.body;

  if (!content) {
    throw new ApiError(404, "please write something for a Tweet!");
  }

  const createdTweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  const newCreatedTweet = await Tweet.findById({
    _id: createdTweet._id,
  }); //.select("-password -refreshToken");

  if (!newCreatedTweet) {
    throw new ApiError(500, "Something went wrong while creating tweet!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newCreatedTweet, "Tweet created successfully"));
});

const getUserTweet = asyncHandler(async (req, res) => {
  //Todo: get user tweets

  const { userId } = req.params;

  const userTweet = await Tweet.find({ owner: userId });

  if (!userTweet) {
    throw new ApiError(404, "there is no tweet for this userId!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userTweet, "Tweets fetched successfully"));
});

const updateTweets = asyncHandler(async (req, res) => {
  //Todo: update tweets

  const { tweetId } = req.params;
  const { content } = req.body;

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "there is no tweet for this tweetID!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //Todo: delete tweet

  const { tweetId } = req.params;

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  if (!tweet) {
    throw new ApiError(404, "there is no tweet for this tweetID!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweet, deleteTweet, updateTweets };
