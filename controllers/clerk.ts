import { verifyWebhook } from "@clerk/express/webhooks";
import * as Sentry from "@sentry/node";

import { Request, Response } from "express";
import { prisma } from "../configs/prisma.js";
const clerkWebhooks = async (req: Request, res: Response) => {
  try {
    const evt: any = await verifyWebhook(req); //this helps us get event, from the event we get data and type from the request body
    const { data, type } = evt;
    //adding switch cases for different events
    //user.created, "".deleted etc are set in the clerk and payments updated
    switch (type) {
      case "user.created": {
        await prisma.user.create({
          //to create user data on the neon database id,email
          data: {
            id: data.id,
            email: data?.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          },
        });
        break;
      }
      //second case (uodating)
      case "user.updated": {
        await prisma.user.update({
          //to update user data on the neon database id,email
          where: {
            id: data.id, //findinf the data and updating [email,name,image]
          },
          data: {
            email: data?.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          },
        });
        break;
      }
      // user.deleted
      case "user.deleted": {
        await prisma.user.delete({
          //to update user data on the neon database id,email
          where: { id: data.id }, //finding the data with that id and deleting it from the database
        });
        break;
      }
      // payment attepmt updated
      case "paymentAttempt.updated": {
        if (
          (data.charged_type === "recurring" ||
            data.charged_type === "checkout") &&
          data.status === "paid"
        ) {
          const credits = { pro: 80, premium: 240 };
          const clerkUserId = data?.payer?.user_id;
          const planId: keyof typeof credits =
            data.subscription_items?.[0]?.plan?.slug;

          if (planId !== "pro" && planId !== "premium") {
            return res.status(400).json({
              message: "Invalid plan",
            });
          }
          console.log(planId);
          await prisma.user.update({
            where: { id: clerkUserId },
            data: {
              credits: { increment: credits[planId] },
            },
          });
        }
        break;
      }

      default:
        break;
    }
    res.json({ message: "webhook recieved: " + type });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.message });
  }
};

export default clerkWebhooks;
//webhook controller to be consumed at an API endpoint
