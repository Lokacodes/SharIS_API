import express from "express";
const router = express.Router()

import shuController from "./SHU.controller";
import { authenticate } from "../../middleware/Authentication";
import { asyncHandler } from "../../utils/asyncHandlers";
import { authorize } from "../../middleware/Authorization";


router.get('/', authenticate, authorize(['KETUA', 'SEKRETARIS', 'SUPERADMIN']), asyncHandler(shuController.getSHU));
router.get('/member', authenticate, authorize(['KETUA', 'SEKRETARIS', 'SUPERADMIN']), asyncHandler(shuController.getSHUMember));

export default router;