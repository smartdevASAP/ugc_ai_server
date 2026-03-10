import express from "express";
import {
  getAllProjects,
  getProjectById,
  getUserCredits,
  toggleProjectPublic,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/credits", protect, getUserCredits);
userRouter.get("/projects", protect, getAllProjects); //getting all projects of the user
userRouter.get("/projects/:projectId", protect, getProjectById);
userRouter.get("/publish/:projectId", protect, toggleProjectPublic); //added projectId because the project id will be dynamic(changing )

export default userRouter;
