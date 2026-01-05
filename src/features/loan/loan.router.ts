import express from "express";
const router = express.Router();

import { asyncHandler } from "../../utils/asyncHandlers";

import loanController from "./loan.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createLoanSchema, updateLoanSchema } from "./loan.validator";
import { convertDateFields } from "../../middleware/DateConversion";
import { authorize } from "../../middleware/Authorization";

router.get(
    '/',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA"]),
    asyncHandler(loanController.getLoan)
);

router.get(
    '/search',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA", "KETUA"]),
    asyncHandler(loanController.getLoanByStatus)
);

router.get(
    '/sum',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA", "SEKRETARIS"]),
    asyncHandler(loanController.getLoanSum)
);

router.get(
    '/search/:id',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA"]),
    asyncHandler(loanController.findLoanByMemberId)
);

router.get(
    '/:id',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA", "KETUA"]),
    asyncHandler(loanController.findLoanById)
);

router.post("/:id/approve", authenticate, authorize(["SUPERADMIN", "KETUA"]), asyncHandler(loanController.approveLoan));

router.post(
    '/',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA"]),
    validate(createLoanSchema),
    convertDateFields(["LoanDate", "Deadline"]),
    asyncHandler(loanController.createLoan)
);

router.patch(
    '/:id',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA"]),
    validate(updateLoanSchema),
    convertDateFields(["LoanDate", "Deadline"]),
    asyncHandler(loanController.update)
);

router.delete(
    '/:id',
    authenticate,
    authorize(["SUPERADMIN", "BENDAHARA"]),
    asyncHandler(loanController.delete)
);

export default router;
