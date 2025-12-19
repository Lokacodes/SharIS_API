import express from "express";
const router = express.Router()

import shuController from "./SHU.controller";
import { authenticate } from "../../middleware/Authentication";
import { asyncHandler } from "../../utils/asyncHandlers";


router.get('/', authenticate, asyncHandler(shuController.getSHU));
router.get('/member', authenticate, asyncHandler(shuController.getSHUMember));

export default router;