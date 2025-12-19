import express from "express";
const router = express.Router()

import cashbookController from "./shu_config.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { asyncHandler } from "../../utils/asyncHandlers";
import { createSHUConfigSchema, updateSHUConfigSchema } from "./shu_config.validator";


router.get('/', authenticate, asyncHandler(cashbookController.getAllSHUConfig));
router.get('/:id', authenticate, asyncHandler(cashbookController.getOne));
router.post("/", authenticate, validate(createSHUConfigSchema), asyncHandler(cashbookController.createSHUConfig));
router.patch('/:id', authenticate, validate(updateSHUConfigSchema), asyncHandler(cashbookController.updateSHUConfig));
router.delete('/:id', authenticate, asyncHandler(cashbookController.delete));
export default router;