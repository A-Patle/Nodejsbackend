import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //Todo: toggle like on video

  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "no video found for the given video Id!");
  }

  const LikedContent = await Like.create({
    comment: null,
    video: videoId,
    likedBy: req.user._id,
    tweet: null,
  });

  const newLikedContent = await Like.findById({
    _id: LikedContent._id,
  }); //.select("-password -refreshToken");

  if (!newLikedContent) {
    throw new ApiError(500, "Something went wrong while giving like to video!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, LikedContent, "video liked succesfully!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //Todo: toggle like on Comment

  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "no comment found for the given comment Id!");
  }

  const LikedContent = await Like.create({
    comment: commentId,
    video: null,
    likedBy: req.user._id,
    tweet: null,
  });

  const newLikedContent = await Like.findById({
    _id: LikedContent._id,
  }); //.select("-password -refreshToken");

  if (!newLikedContent) {
    throw new ApiError(
      500,
      "Something went wrong while giving like to comment!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        LikedContent,
        "comment liked succesfully deleted successfully"
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //Todo: toggle like on tweet

  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "no tweet found for the given tweet Id!");
  }

  const LikedContent = await Like.create({
    comment: null,
    video: null,
    likedBy: req.user._id,
    tweet: tweetId,
  });

  const newLikedContent = await Like.findById({
    _id: LikedContent._id,
  }); //.select("-password -refreshToken");

  if (!newLikedContent) {
    throw new ApiError(500, "Something went wrong while giving like to tweet!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        LikedContent,
        "tweet liked succesfully deleted successfully"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //Todo: get all liked videos
  //by a particular user / login user

  // const { videoId } = req.params;

  const likeVideos = await Like.find({
    likedBy: req.user._id,
    video: { $ne: null },
  }).select("-comment -tweet -__v");

  if (!likeVideos) {
    throw new ApiError(404, "no videos found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeVideos, "like Videos fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
