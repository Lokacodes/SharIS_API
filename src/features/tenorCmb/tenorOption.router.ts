import express from "express";
const router = express.Router()

import TenorController from "./tenorOption.controller";
import { validate } from "../../middleware/validator";
import { authenticate } from "../../middleware/Authentication";
import { createTenorOptionSchema, updateTenorOptionSchema } from "./tenorOption.validator";

router.get('/', authenticate, TenorController.getAll)
router.get('/search', authenticate, TenorController.search)
router.get('/:id', authenticate, TenorController.getOne)
router.post('/', authenticate, validate(createTenorOptionSchema), TenorController.create);
router.patch('/:id', authenticate, validate(updateTenorOptionSchema), TenorController.update);
router.delete('/:id', authenticate, TenorController.delete);

export default router;