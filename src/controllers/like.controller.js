import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //Todo: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  //Todo: toggle like on Comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //Todo: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //Todo: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
