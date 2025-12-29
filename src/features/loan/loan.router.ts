import express from "express";
const router = express.Router();

import { asyncHandler } from "../../utils/asyncHandlers";

import loanController from "./loan.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createLoanSchema, updateLoanSchema } from "./loan.validator";
import { convertDateFields } from "../../middleware/DateConversion";

// GET routes
router.get(
    '/',
    authenticate,
    asyncHandler(loanController.getLoan)
);

router.get(
    '/search',
    authenticate,
    asyncHandler(loanController.getLoanByStatus)
);

router.get(
    '/sum',
    authenticate,
    asyncHandler(loanController.getLoanSum)
);

router.get(
    '/search/:id',
    authenticate,
    asyncHandler(loanController.findLoanByMemberId)
);

router.get(
    '/:id',
    authenticate,
    asyncHandler(loanController.findLoanById)
);

router.post("/:id/approve", authenticate, asyncHandler(loanController.approveLoan));

// POST
router.post(
    '/',
    authenticate,
    validate(createLoanSchema),
    convertDateFields(["LoanDate", "Deadline"]),
    asyncHandler(loanController.createLoan)
);

// PATCH
router.patch(
    '/:id',
    authenticate,
    validate(updateLoanSchema),
    convertDateFields(["LoanDate", "Deadline"]),
    asyncHandler(loanController.update)
);


// DELETE
router.delete(
    '/:id',
    authenticate,
    asyncHandler(loanController.delete)
);

export default router;
