import express from 'express';
import * as groupController from '../controllers/group/group.controller';
import authentication from '../middlewares/authentication';
import { addGroupValidation } from '../controllers/group/group.validator';

const router = express.Router();

router.get('/add', authentication, groupController.addGroupShow);
router.post('/', authentication, addGroupValidation, groupController.addGroup);
router.get('/', authentication, groupController.getGroup);
router.get('/delete', authentication, groupController.deleteGroup);

module.exports = router;
