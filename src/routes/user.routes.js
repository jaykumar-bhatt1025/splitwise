import express from 'express';
import * as userController from '../controllers/user/user.controller';
import authentication from '../middlewares/authentication';

const router = express.Router();

router.get('/', authentication, userController.allUser);

module.exports = router;
