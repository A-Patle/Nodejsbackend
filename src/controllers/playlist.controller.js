import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //Todo: create playlist

  const { name, description, videos } = req.body;

  if (!(name && description)) {
    throw new ApiError(404, "please give name and description for playlist!");
  }

  const videosFound = await Video.find({
    _id: { $in: videos.map((video) => new mongoose.Types.ObjectId(video)) },
  });
  if (!videosFound) {
    throw new ApiError(404, "please give a valid video id!");
  }

  const createdPlayList = await Playlist.create({
    name,
    description,
    videos: videos.map((video) => new mongoose.Types.ObjectId(video)), // Directly store ObjectId array
    owner: req.user._id,
  });

  const newCreatedPlayList = await Playlist.findById({
    _id: createdPlayList._id,
  }); //.select("-password -refreshToken");

  if (!newCreatedPlayList) {
    throw new ApiError(500, "Something went wrong while creating playlist!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, newCreatedPlayList, "playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //Todo: get user playlist

  const { userId } = req.params;

  const playlistByUserId = await Playlist.findOne({ owner: userId });
  if (!playlistByUserId) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No playlist found for this user!!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlistByUserId, "playlist fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //Todo: get playlist by id

  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist does not exist!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  //Todo: add video to playlist

  const { playlistId, videoId } = req.params;

  // ✅ Step 1: Check if video exists
  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    throw new ApiError(404, "Invalid video ID! Video does not exist.");
  }

  // ✅ Step 2: Find and update playlist (prevents duplicates using $addToSet)
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    { $addToSet: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found! Please check the playlist ID."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  //Todo: remove video to playlist

  const { playlistId, videoId } = req.params;

  // ✅ Step 1: Check if video exists
  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    throw new ApiError(404, "Invalid video ID! Video does not exist.");
  }

  // ✅ Step 2: Find and update playlist (prevents duplicates using $addToSet)
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    { $pull: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found! Please check the playlist ID."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  //Todo: delete playlist

  const { playlistId } = req.params;

  // ✅ Step 1: Find and update playlist (prevents duplicates using $addToSet)
  const deletedPlaylist = await Playlist.findOneAndDelete(
    { _id: playlistId },
    { new: true }
  );

  if (!deletedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found! Please check the playlist ID."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //Todo: update playlist

  const { playlistId } = req.params;
  const { name, description } = req.body;

  // ✅ Step 1: Find and update playlist (prevents duplicates using $addToSet)
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    { $set: { name, description } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found! Please check the playlist ID."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  deletePlaylist,
  updatePlaylist,
  removeVideoFromPlaylist,
};
