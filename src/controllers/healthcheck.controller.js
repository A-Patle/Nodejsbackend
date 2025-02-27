import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = asyncHandler(async (req, res) => {
  //Todo: build a healthcheck response that simply retrun ok status as json with a message
  return res.status(200).json(new ApiResponse(200, {}, "everthing is okay!"));
});

export { healthCheck };
