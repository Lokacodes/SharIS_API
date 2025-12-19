import express from "express";
const router = express.Router()

import installmentController from "./installment.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createInstallmentSchema, updateInstallmentSchema } from "./installment.validator";
import { asyncHandler } from "../../utils/asyncHandlers";

router.get('/', authenticate, asyncHandler(installmentController.getAll));
router.get('/:id', authenticate, asyncHandler(installmentController.getOne));
router.post("/", authenticate, validate(createInstallmentSchema), asyncHandler(installmentController.create));
router.patch('/:id', authenticate, validate(updateInstallmentSchema), asyncHandler(installmentController.update));
router.delete('/:id', authenticate, asyncHandler(installmentController.delete));
router.post("/pay", authenticate, validate(createInstallmentSchema), asyncHandler(installmentController.payInstallment));

export default router;