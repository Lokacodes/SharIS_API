import express from "express";
const router = express.Router()

import cashbookController from "./cashbook.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createCashbookSchema, updateCashbookSchema } from "./cashbook.validator";
import { convertDateFields } from "../../middleware/DateConversion";


router.get('/', authenticate, cashbookController.getAllCash);
router.get('/:id', authenticate, cashbookController.getOne);
router.post("/", authenticate, validate(createCashbookSchema), convertDateFields(["date"]), cashbookController.InsertCashEntry);
router.patch('/:id', authenticate, validate(updateCashbookSchema), cashbookController.update);
router.delete('/:id', authenticate, cashbookController.delete);

export default router;