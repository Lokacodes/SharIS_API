import express from "express";
const router = express.Router()

import cashbookController from "./shu_config.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { asyncHandler } from "../../utils/asyncHandlers";
import { createSHUConfigSchema, updateSHUConfigSchema } from "./shu_config.validator";
import { authorize } from "../../middleware/Authorization";


router.get('/', authenticate, authorize(['SUPERADMIN', 'SEKRETARIS', 'KETUA']), asyncHandler(cashbookController.getAllSHUConfig));
router.get('/:id', authenticate, authorize(['SUPERADMIN', 'SEKRETARIS', 'KETUA']), asyncHandler(cashbookController.getOne));
router.post("/", authenticate, authorize(['SUPERADMIN', 'SEKRETARIS', 'KETUA']), validate(createSHUConfigSchema), asyncHandler(cashbookController.createSHUConfig));
router.patch('/:id', authenticate, authorize(['SUPERADMIN', 'SEKRETARIS', 'KETUA']), validate(updateSHUConfigSchema), asyncHandler(cashbookController.updateSHUConfig));
router.delete('/:id', authenticate, authorize(['SUPERADMIN', 'SEKRETARIS', 'KETUA']), asyncHandler(cashbookController.delete));
export default router;