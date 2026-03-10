import * as Sentry from "@sentry/node";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../configs/prisma.js";
//create projecty
//this controller will create the image only
export const createProject = async (req: Request, res: Response) => {
  //temporary projid
  let tempProjectId: string;
  const { userId } = req.auth();
  let isCreditDeducted = false;

  const {
    name = "New Project",
    aspectRatio,
    userPrompt,
    productName,
    productDescription,
    targetLength = 5,
  } = req.body;
  //we will use multer to recieve images
  const images: any = req.files;

  if (images.length < 2 || !productName) {
    return res.status(400).json({
      message: "please upload atleast two images",
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  //when there is no user
  if (!user || user.credits < 5) {
    return res.status(401).json({
      message: "insufficient credits",
    });
  } else {
    //deduct credits for video generations
    await prisma.user
      .update({
        where: { id: userId },
        data: { credits: { decrement: 5 } },
      })
      .then(() => {
        isCreditDeducted = true;
      });
  }
  try {
    let uploadedImages = await Promise.all(
      images.map(async (item: any) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    const project = await prisma.project.create({
      data: {
        name,
        userId,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(targetLength),
        uploadedImages,
        isGenerating: true,
      },
    });

    tempProjectId = project.id;
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
//creating the video
export const createVideo = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
//get all published projects
//creating the video
export const getAllPublishedProjects = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
//for a user to delete a single project
//creating the video
export const deleteProject = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
