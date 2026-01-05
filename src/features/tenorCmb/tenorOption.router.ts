import express from "express";
const router = express.Router()

import TenorController from "./tenorOption.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createTenorOptionSchema, updateTenorOptionSchema } from "./tenorOption.validator";
import { asyncHandler } from "../../utils/asyncHandlers";
import { authorize } from "../../middleware/Authorization";

router.get('/', authenticate, authorize(['SUPERADMIN', 'BENDAHARA']), asyncHandler(TenorController.getAll))
router.get('/search', authenticate, authorize(['SUPERADMIN', 'BENDAHARA']), asyncHandler(TenorController.search))
router.get('/:id', authenticate, authorize(['SUPERADMIN']), asyncHandler(TenorController.getOne))
router.post('/', authenticate, authorize(['SUPERADMIN']), validate(createTenorOptionSchema), asyncHandler(TenorController.create));
router.patch('/:id', authenticate, authorize(['SUPERADMIN']), validate(updateTenorOptionSchema), asyncHandler(TenorController.update));
router.delete('/:id', authenticate, authorize(['SUPERADMIN']), asyncHandler(TenorController.delete));


export default router;