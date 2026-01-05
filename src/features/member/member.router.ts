import express from 'express';
const router = express.Router();
import memberController from './member.controller';
import { CreateMemberValidation, UpdateMemberValidation } from './member.validator'
import { validate } from '../../middleware/validator';
import { convertDateFields } from '../../middleware/DateConversion';
import { authenticate } from '../../middleware/Authentication';
import { authorize } from '../../middleware/Authorization';


router.get('/', authenticate, authorize(["SUPERADMIN", "SEKRETARIS"]), memberController.getAll);
router.get('/search', authenticate, authorize(["SUPERADMIN", "SEKRETARIS", "BENDAHARA"]), memberController.search);
router.get('/count', authenticate, authorize(["SUPERADMIN", "KETUA", "BENDAHARA", "SEKRETARIS"]), memberController.getMemberCount);
router.get('/pinjaman/:id', authenticate, authorize(["SUPERADMIN", "SEKRETARIS", "BENDAHARA"]), memberController.getMemberWithLoansById)
router.get('/:id', authenticate, authorize(["SUPERADMIN", "SEKRETARIS"]), memberController.getOne);
router.post('/', authenticate, authorize(["SUPERADMIN", "SEKRETARIS"]), validate(CreateMemberValidation), convertDateFields(["dateOfBirth"]), memberController.create);
router.put('/:id', authenticate, authorize(["SUPERADMIN", "SEKRETARIS"]), validate(UpdateMemberValidation), convertDateFields(["dateOfBirth"]), memberController.update);
router.patch('/:id', authenticate, authorize(["SUPERADMIN", "SEKRETARIS"]), validate(UpdateMemberValidation), convertDateFields(["dateOfBirth"]), memberController.update);
router.delete('/:id', authenticate, authorize(["SUPERADMIN", "SEKRETARIS"]), memberController.delete);


export default router