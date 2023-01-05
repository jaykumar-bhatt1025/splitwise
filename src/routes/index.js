import express from 'express';
import auth from './auth.routes';
import user from './user.routes';
import friend from './friend.routes';
import transaction from './transaction.routes';
import group from './group.routes';

const router = express.Router();

router.use('/', auth);
router.use('/allUser', user);
router.use('/friend', friend);
router.use('/transaction', transaction);
router.use('/group', group);


module.exports = router;
