import express from "express";
const router = express.Router()

import installmentController from "./installment.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createInstallmentSchema, updateInstallmentSchema } from "./installment.validator";


router.get('/', authenticate, installmentController.getAll);
router.get('/:id', authenticate, installmentController.getOne);
router.post("/", authenticate, validate(createInstallmentSchema), installmentController.create);
router.patch('/:id', authenticate, validate(updateInstallmentSchema), installmentController.update);
router.delete('/:id', authenticate, installmentController.delete);
router.post("/pay", authenticate, validate(createInstallmentSchema), installmentController.payInstallment)

export default router;