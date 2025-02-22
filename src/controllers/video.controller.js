import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //Todo: get all videos basedd on query ,sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //Todo: get video, publish to cloudnary , create video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //Todo: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //Todo: get video, update video detials like title, description and thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //Todo: get video, delete video
});

const toggglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //Todo: get video, delete video
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  toggglePublishStatus,
};
