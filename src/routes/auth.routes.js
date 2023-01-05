import express from 'express';
import * as authController from '../controllers/auth/auth.controller';
import { signinValidation, loginValidation } from '../controllers/auth/auth.validator';

const router = express.Router();

router.get('/login', authController.loginPage);
router.get('/signin', authController.signinPage);

router.post('/login', loginValidation, authController.login);
router.post('/signin', signinValidation, authController.signin);

router.get('/logout', authController.logout);

module.exports = router;
