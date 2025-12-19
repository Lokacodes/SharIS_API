import express from "express";
const router = express.Router()

import savingController from "./saving.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createSavingSchema, updateSavingSchema } from "./saving.validator";
import { convertDateFields } from "../../middleware/DateConversion";
import { asyncHandler } from "../../utils/asyncHandlers";

router.get('/', authenticate, asyncHandler(savingController.getAll));
router.get('/sum', authenticate, asyncHandler(savingController.getSavingSum));
router.get('/:id', authenticate, asyncHandler(savingController.getOne));
router.get('/member/:id', authenticate, asyncHandler(savingController.findSavingByMemberId));
router.post('/', authenticate, validate(createSavingSchema), convertDateFields(["date"]), asyncHandler(savingController.createSaving));
router.patch('/:id', authenticate, validate(updateSavingSchema), convertDateFields(["date"]), asyncHandler(savingController.update));
router.delete('/:id', authenticate, asyncHandler(savingController.delete));

export default router;