import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = asyncHandler(async (req, res) => {
  //Todo: build a healthcheck response that simply retrun ok status as json with a message
  messge = "everthing is okay!";
});

export { healthCheck };
