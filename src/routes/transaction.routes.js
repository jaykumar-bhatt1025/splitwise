import express from 'express';
import * as transactionController from '../controllers/transaction/transaction.controller';
import authentication from '../middlewares/authentication';
import { addTransactionValidation, addGroupTransactionValidation } from '../controllers/transaction/transaction.validator';

const router = express.Router();

router.get('/', authentication, transactionController.addTransactionView);
router.post('/', authentication, addTransactionValidation, transactionController.addTransaction);
router.get('/group', authentication, transactionController.showAddGroupTransaction);
router.post('/group', authentication, addGroupTransactionValidation, transactionController.addGroupTransaction);

router.get('/owes', authentication, transactionController.getOwesTransaction);
router.get('/borrow', authentication, transactionController.getBorrowsTransaction);
router.get('/update', authentication, transactionController.updateTransaction);

module.exports = router;
