import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  const { channelId } = req.params;
  const subscriberId = req.user._id; // ✅ Fix: Use logged-in user's ID

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "no channel found for the given channelId!");
  }

  // ✅ Check if the user is trying to subscribe to themselves
  if (subscriberId.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself!");
  }

  // ✅ Check if the user is already subscribed
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });
  let newSubscription;
  if (existingSubscription) {
    // ✅ If subscribed, remove the subscription (unsubscribe)
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Channel unsubscribed successfully!"));
  } else {
    // ✅ If not subscribed, create a new subscription
    newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: subscriberId,
    });
  }
  if (!newSubscription) {
    throw new ApiError(
      500,
      "Something went wrong while subscribing the channel!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, newSubscription, "channel subscribed succesfully!")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribedChannels = await Subscription.find({ channel: channelId })
    .populate("subscriber", "username email avatar") // ✅ Fetch subscriber details
    .select("-__v");

  if (subscribedChannels.length === 0) {
    throw new ApiError(404, "No subscribers found for this channel.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "subscribers list fetched successfully!!"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id; // ✅ Fix: Use logged-in user's ID

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "username email avatar") // ✅ Fetch channel details
    .select("-__v");

  if (subscribedChannels.length === 0) {
    throw new ApiError(404, "You haven't subscribed to any channels yet.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully!"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
