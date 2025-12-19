import express from "express";
const router = express.Router()

import loanController from "./loanOption.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createLoanOptionSchema, updateLoanOptionSchema } from "./loanOption.validator";

router.get('/', authenticate, loanController.getAll)
router.get('/search', authenticate, loanController.search)
router.get('/:id', authenticate, loanController.getOne)
router.post('/', authenticate, validate(createLoanOptionSchema), loanController.create);
router.patch('/:id', authenticate, validate(updateLoanOptionSchema), loanController.update);
router.delete('/:id', authenticate, loanController.delete);

export default router;