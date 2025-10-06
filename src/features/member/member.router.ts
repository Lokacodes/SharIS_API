import express from 'express';
const router = express.Router();
import memberController from './member.controller';
import { CreateMemberValidation, UpdateMemberValidation } from './member.validator'
import { validate } from '../../middleware/validator';
import { convertDateFields } from '../../middleware/dateConversion';
import { authenticate } from '../../middleware/Authentication';


router.get('/', authenticate, memberController.getAll);
router.get('/:id', authenticate, memberController.getOne);
router.post('/', authenticate, validate(CreateMemberValidation), convertDateFields(["dateOfBirth"]), memberController.create);
router.put('/:id', authenticate, validate(UpdateMemberValidation), convertDateFields(["dateOfBirth"]), memberController.update);
router.patch('/:id', authenticate, validate(UpdateMemberValidation), convertDateFields(["dateOfBirth"]), memberController.update);
router.delete('/:id', authenticate, memberController.delete);

export default router