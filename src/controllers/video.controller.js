import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //Todo: get all videos basedd on query ,sort, pagination
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  //pagination values
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  //filter
  let filters = {};

  if (query) {
    filters.title = { $regex: query, $options: "i" }; //case senstitive search by title
  }

  if (userId) {
    filters.owner = userId; // filter by userId
  }

  //sorting
  const sortOrder = sortType === "asc" ? 1 : -1;

  //fetch video with filter, pagination and sorting
  const allVideos = await Video.find(filters)
    .sort({ [sortBy]: sortOrder }) //sorting by field
    .skip(skip)
    .limit(limitNumber);

  // Count total videos for pagination metadata
  const totalVideos = await Video.countDocuments(filters);
  const totalPages = Math.ceil(totalVideos / limitNumber);

  console.log(allVideos, "all videos data", totalVideos, totalPages);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: allVideos,
        page: pageNumber,
        totalPages,
        totalVideos,
      },
      "All videos fetched successfully!"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  //Todo: get video, publish to cloudnary , create video
  const { title, description } = req.body;
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath && !thumbnailLocalPath) {
    throw new ApiError(
      400,
      "videoLocalPath and thumbnailLocalPath both is required!"
    );
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video) {
    throw new ApiError(400, "video file is required!");
  }

  if (!thumbnail) {
    throw new ApiError(400, "thumbnail file is required!");
  }

  // console.log(video, thumbnail, "clodnary data");

  const publishedVideo = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    owner: req.user._id,
    title,
    description,
    duration: video.duration,
  });

  const newPublishedVideo = await Video.findById({
    _id: publishedVideo._id,
  }); //.select("-password -refreshToken");

  if (!newPublishedVideo) {
    throw new ApiError(500, "Something went wrong while uploading video!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, newPublishedVideo, "Video uploaded successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  //Todo: get video by id
  const { videoId } = req.params;

  const video = await Video.findById(videoId); //new mongoose.Types.ObjectId(videoId));

  if (!video) {
    throw new ApiError(404, "no video found for the give video Id!");
  }

  return res.status(200).json(new ApiResponse(200, video, "Video Found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //Todo: get video, update video detials like title, description and thumbnail
  const { videoId } = req.params;
  const { title, description } = req.body;

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail Path  is required!");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "thumbnail file is required!");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { title, description, thumbnail: thumbnail.url },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "no video found for the give video Id!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //Todo: get video, delete video
  const { videoId } = req.params;

  const video = await Video.findByIdAndDelete(videoId); //new mongoose.Types.ObjectId(videoId));

  if (!video) {
    throw new ApiError(404, "no video found for the give video Id!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted succesfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  //Todo: get video, change togglePublishStatus

  const { videoId } = req.params;

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { isPublished: req.body.isPublished },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "no video found for the give video Id!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video published status changed successfully")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
