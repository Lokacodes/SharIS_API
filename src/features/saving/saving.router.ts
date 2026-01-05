import express from "express";
const router = express.Router()

import savingController from "./saving.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createSavingSchema, updateSavingSchema } from "./saving.validator";
import { convertDateFields } from "../../middleware/DateConversion";
import { asyncHandler } from "../../utils/asyncHandlers";
import { authorize } from "../../middleware/Authorization";

router.get('/', authenticate, authorize(['BENDAHARA', 'SUPERADMIN']), asyncHandler(savingController.getAll));
router.get('/sum', authenticate, authorize(['BENDAHARA', 'SUPERADMIN', 'SEKRETARIS', 'KETUA']), asyncHandler(savingController.getSavingSum));
router.get('/:id', authenticate, authorize(['BENDAHARA', 'SUPERADMIN']), asyncHandler(savingController.getOne));
router.get('/member/:id', authenticate, authorize(['BENDAHARA', 'SUPERADMIN']), asyncHandler(savingController.findSavingByMemberId));
router.post('/', authenticate, authorize(['BENDAHARA', 'SUPERADMIN', 'SEKRETARIS']), validate(createSavingSchema), convertDateFields(["date"]), asyncHandler(savingController.createSaving));
router.patch('/:id', authenticate, authorize(['BENDAHARA', 'SUPERADMIN']), validate(updateSavingSchema), convertDateFields(["date"]), asyncHandler(savingController.update));
router.delete('/:id', authenticate, authorize(['BENDAHARA', 'SUPERADMIN']), asyncHandler(savingController.delete));

export default router;