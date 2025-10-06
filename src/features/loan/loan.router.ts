import express from "express";
const router = express.Router()

import loanController from "./loan.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createLoanSchema, updateLoanSchema } from "./loan.validator";
import { convertDateFields } from "../../middleware/dateConversion";


router.get('/', authenticate, loanController.getAll);
router.get('/:id', authenticate, loanController.getOne);
router.get('/search/:id', authenticate, loanController.findLoanByMemberId);
router.post('/', authenticate, validate(createLoanSchema), convertDateFields(["LoanDate", "Deadline"]), loanController.createLoan);
router.patch('/:id', authenticate, validate(updateLoanSchema), convertDateFields(["LoanDate", "Deadline"]), loanController.update);
router.delete('/:id', authenticate, loanController.delete);

export default router;