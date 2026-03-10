import * as Sentry from "@sentry/node";
import { Request, Response } from "express";
import { prisma } from "../configs/prisma.js";
//controllers of the users to get the credites of any user
//get user credits
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth(); //the req has more values (eg: req.auth is added from the middleware function)
    if (!userId) {
      return res.status(401).json({ message: "unauthorzed" });
    } //un auth

    //whan user is availble
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json({ credits: user?.credits });
  } catch (error: any) {
    Sentry.captureException(error); //error  handling with sentry
    res.status(500).json({ message: error.code || error.message });
  }
};
//get all users projects
export const getAllProjects = async (req: Request, res: Response) => {
  //finding all the projects of a user
  try {
    const { userId } = req.auth();
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ projects });
  } catch (error: any) {
    Sentry.captureException(error); //error  handling with sentry
    res.status(500).json({ message: error.code || error.message });
  }
};

//get project by id
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    const { projectId } = req.params;

    // VALIDATION GUARD: This prevents the crash {might crash}
    if (!projectId || typeof projectId !== "string") {
      return res
        .status(400)
        .json({ message: "A valid Project ID is required" });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId, // Now it's 100% a string
        userId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }

    res.json({ project });
  } catch (error: any) {
    Sentry.captureException(error); //error  handling with sentry
    res.status(500).json({ message: error.code || error.message });
  }
};
//publish & unpublish projects
export const toggleProjectPublic = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    const { projectId } = req.params;

    // VALIDATION GUARD: This prevents the crash {might crash}
    if (!projectId || typeof projectId !== "string") {
      return res
        .status(400)
        .json({ message: "A valid Project ID is required" });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId, // Now it's 100% a string
        userId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    //when found and vido |image not generated
    if (!project?.generatedImage && !project?.generatedVideo) {
      return res.status(404).json({ message: "image or video not available" });
    }
    await prisma.project.update({
      where: { id: projectId },
      data: { isPublished: !project.isPublished },
    });

    res.json({ isPublished: !project.isPublished });
  } catch (error: any) {
    Sentry.captureException(error); //error  handling with sentry
    res.status(500).json({ message: error.code || error.message });
  }
};
