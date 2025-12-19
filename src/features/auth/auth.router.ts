import express from "express";
const router = express.Router()

import authController from "./auth.controller";
import { validate } from "../../middleware/validator";
import { registerValidation, loginValidation, refreshSessionValidation } from "./auth.validator";
import { authenticate } from "../../middleware/Authentication";
import { asyncHandler } from "../../utils/asyncHandlers";

router.post("/register", validate(registerValidation), asyncHandler(authController.register))
router.post("/registerAuth", authenticate, validate(registerValidation), asyncHandler(authController.register))
router.post("/refresh-token", validate(refreshSessionValidation), asyncHandler(authController.refreshSession))
router.post("/login", validate(loginValidation), asyncHandler(authController.login))
router.get("/user", authenticate, asyncHandler(authController.getAll))
router.get("/user/:id", authenticate, asyncHandler(authController.getOne))
router.patch("/user/:id", authenticate, asyncHandler(authController.updateUser))
router.delete("/user/:id", authenticate, asyncHandler(authController.delete))
export default router