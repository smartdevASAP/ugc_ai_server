import express from "express";
import {
  createProject,
  createVideo,
  deleteProject,
  getAllPublishedProjects,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../configs/multer.js";

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  upload.array("images", 2),
  protect,
  createProject,
); //upload.array() will add images to the req.files to be used in the controllers
projectRouter.post("/video", protect, createVideo);
projectRouter.get("/published", getAllPublishedProjects);
projectRouter.delete("/:projectId", protect, deleteProject);

export default projectRouter;
