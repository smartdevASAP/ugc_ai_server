import "./configs/instrument.mjs"; //has no default export
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
//import clerkWebhooks from "./controllers/clerk.js";
import clerkWebhooks from "./controllers/clerk.js";
import * as Sentry from "@sentry/node";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks,
); //adding this before express.json(()) because it will use express.raw
app.use(express.json()); //cookies
app.use(clerkMiddleware());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
//main server routes
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
