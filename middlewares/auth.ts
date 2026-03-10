import { Response, Request, NextFunction } from "express";
import * as Sentry from "@sentry/node";
// routes protection middleware function to be written here
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.auth(); //extraction of the user id
    if (!userId) {
      return res.status(401).json({
        message: "unauthorized",
      });
    }
    //when userid is available
    next();
  } catch (error: any) {
    Sentry.captureException(error); //sentry will capture the error that is there
    res.status(401).json({ message: error.code || error.message });
  }
};
