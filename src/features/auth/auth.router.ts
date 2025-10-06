import express from "express";
const router = express.Router()

import authController from "./auth.controller";
import { validate } from "../../middleware/validator";
import { registerValidation, loginValidation } from "./auth.validator";
import { authenticate } from "../../middleware/Authentication";

router.post("/register", validate(registerValidation), authController.register)
router.post("/registerAuth", authenticate, validate(registerValidation), authController.register)
router.post("/login", validate(loginValidation), authController.login)
router.get("/user", authenticate, authController.getAll)
router.get("/user/:id", authenticate, authController.getOne)
router.patch("/user/:id", authenticate, authController.updateUser)
router.delete("/user/:id", authenticate, authController.delete)
export default router