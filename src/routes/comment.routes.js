import { Router } from "express";
import {
  addComments,
  deleteComments,
  getVideoComments,
  updateComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // apply verifyjwt middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComments);

router.route("/c/:commentId").delete(deleteComments).patch(updateComments);

export default router;
