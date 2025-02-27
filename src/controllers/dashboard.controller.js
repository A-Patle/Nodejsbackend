import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // ✅ Get channel ID from request

  // ✅ Step 1: Check if the channel exists
  const channelExists = await Subscription.exists({ channel: channelId });
  if (channelExists) {
    throw new ApiError(404, "Channel not found!");
  }

  // ✅ Step 2: Count total videos uploaded by the channel
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // ✅ Step 3: Count total views across all videos by the channel
  const totalViews = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const viewsCount = totalViews.length > 0 ? totalViews[0].totalViews : 0;

  // ✅ Step 4: Count total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // ✅ Step 5: Count total likes received on all videos by the channel
  const totalLikes = await Like.countDocuments({
    video: { $in: await Video.find({ owner: channelId }).distinct("_id") },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalViews: viewsCount,
        totalSubscribers,
        totalLikes,
      },
      "Channel statistics fetched successfully!"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // ✅ Get channel ID from request

  // ✅ Step 1: Validate if the channel exists
  const channelExists = await Video.exists({ owner: channelId });
  if (!channelExists) {
    throw new ApiError(404, "No videos found for this channel!");
  }

  // ✅ Step 2: Fetch all videos uploaded by the channel
  const allVideos = await Video.find({ owner: channelId })
    .select("-__v") // ✅ Remove unnecessary fields
    .sort({ createdAt: -1 }); // ✅ Sort by newest first

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allVideos,
        "All videos uploaded by the channel fetched successfully!"
      )
    );
});

export { getChannelStats, getChannelVideos };
