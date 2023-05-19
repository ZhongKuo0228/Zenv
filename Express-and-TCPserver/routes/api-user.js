import express from "express";
import { signUp, signIn, getUserProfile, getUserProjects } from "../controllers/user.js";
import { userCheck } from "../middleware/userCheck.js";
import wrapAsync from "../util/wrapAsync.js";
const userApiRouter = express.Router();
//---router----------------------------------------------
userApiRouter.post("/signup", wrapAsync(signUp));
userApiRouter.post("/signin", wrapAsync(signIn));
userApiRouter.get("/profile", userCheck, wrapAsync(getUserProfile));
userApiRouter.get("/user-projects", userCheck, wrapAsync(getUserProjects));

//---export----------------------------------------------
export { userApiRouter };
