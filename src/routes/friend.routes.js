import express from 'express';
import * as friendController from '../controllers/friend/friend.controller';
import authentication from '../middlewares/authentication';

const router = express.Router();

router.get('/add', authentication, friendController.addFriend);
router.get('/', authentication, friendController.getFriends);
router.get('/remove', authentication, friendController.removeFriend);

module.exports = router;
