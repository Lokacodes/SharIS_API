import express from "express";
const router = express.Router()

import cashbookController from "./cashbook.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createCashbookSchema, updateCashbookSchema } from "./cashbook.validator";
import { convertDateFields } from "../../middleware/DateConversion";
import { authorize } from "../../middleware/Authorization";
import { asyncHandler } from "../../utils/asyncHandlers";


router.get('/', authenticate, authorize(["SUPERADMIN", "KETUA", "SEKRETARIS", "BENDAHARA"]), asyncHandler(cashbookController.getAllCash));
router.get('/search', authenticate, authorize(["SUPERADMIN", "KETUA", "SEKRETARIS", "BENDAHARA"]), asyncHandler(cashbookController.getCashByModule));
router.get('/:id', authenticate, authorize(["SUPERADMIN", "KETUA", "SEKRETARIS"]), asyncHandler(cashbookController.getOne));
router.post("/", authenticate, authorize(["SUPERADMIN", "KETUA", "SEKRETARIS", "BENDAHARA"]), validate(createCashbookSchema), convertDateFields(["date"]), asyncHandler(cashbookController.InsertCashEntry));
router.patch('/:id', authenticate, authorize(["SUPERADMIN", "KETUA", "SEKRETARIS", "BENDAHARA"]), validate(updateCashbookSchema), asyncHandler(cashbookController.update));
router.delete('/:id', authenticate, authorize(["SUPERADMIN", "KETUA", "SEKRETARIS", "BENDAHARA"]), asyncHandler(cashbookController.delete));

export default router;