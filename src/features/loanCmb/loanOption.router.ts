import express from "express";
const router = express.Router()

import loanController from "./loanOption.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createLoanOptionSchema, updateLoanOptionSchema } from "./loanOption.validator";
import { authorize } from "../../middleware/Authorization";

router.get('/', authenticate, authorize(['SUPERADMIN', 'BENDAHARA']), loanController.getAll)
router.get('/search', authenticate, authorize(['SUPERADMIN', 'BENDAHARA']), loanController.search)
router.get('/:id', authenticate, authorize(['SUPERADMIN']), loanController.getOne)
router.post('/', authenticate, authorize(['SUPERADMIN']), validate(createLoanOptionSchema), loanController.create);
router.patch('/:id', authenticate, authorize(['SUPERADMIN', 'BENDAHARA']), validate(updateLoanOptionSchema), loanController.update);
router.delete('/:id', authenticate, authorize(['SUPERADMIN']), loanController.delete);

export default router;