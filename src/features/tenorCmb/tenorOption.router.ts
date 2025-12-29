import express from "express";
const router = express.Router()

import TenorController from "./tenorOption.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createTenorOptionSchema, updateTenorOptionSchema } from "./tenorOption.validator";
import { asyncHandler } from "../../utils/asyncHandlers";

router.get('/', authenticate, asyncHandler(TenorController.getAll))
router.get('/search', authenticate, asyncHandler(TenorController.search))
router.get('/:id', authenticate, asyncHandler(TenorController.getOne))
router.post('/', authenticate, validate(createTenorOptionSchema), asyncHandler(TenorController.create));
router.patch('/:id', authenticate, validate(updateTenorOptionSchema), asyncHandler(TenorController.update));
router.delete('/:id', authenticate, asyncHandler(TenorController.delete));

export default router;