import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // pagination values
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const video = await Video.findById(videoId).skip(skip).limit(limitNumber);

  if (!video) {
    throw new ApiError(404, "please give a valid video id!");
  }

  const comments = await Comment.find({ video: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "All comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(404, "please write something for a Comment!");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "please give a valid video id!");
  }

  const createdComment = await Comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });

  const newCreatedComment = await Comment.findById({
    _id: createdComment._id,
  }); //.select("-password -refreshToken");

  if (!newCreatedComment) {
    throw new ApiError(500, "Something went wrong while creating comment!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, newCreatedComment, "comment created successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(404, "no comment found with the given id!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(404, "no comment found for the give video Id!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted succesfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
