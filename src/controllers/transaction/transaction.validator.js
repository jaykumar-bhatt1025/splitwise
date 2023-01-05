/* eslint-disable consistent-return */

import joi from 'joi';
import { errorResponse } from '../../helpers/index';

const addTransactionObj = joi.object({
  totalAmount: joi.number().required(),
  description: joi.string().required(),
  userAmount: joi.number().required(),
  friendAmount: joi.number().required(),
});

export const addTransactionValidation = async (req, res, next) => {
  const {
    totalAmount,
    description,
    userAmount,
    friendAmount,
  } = req.body;

  const payload = {
    totalAmount,
    description,
    userAmount,
    friendAmount,
  };

  const { error } = addTransactionObj.validate(payload);
  if (error) {
    req.flash('response', errorResponse(req, res, error.message, 404));
    return res.redirect('/transaction');
  }
  next();
};

const addGroupTransactionObj = joi.object({
  totalAmount: joi.number().required(),
  description: joi.string().required(),
});

export const addGroupTransactionValidation = async (req, res, next) => {
  const {
    totalAmount,
    description,
  } = req.body;

  const payload = {
    totalAmount,
    description,
  };

  const { error } = addGroupTransactionObj.validate(payload);
  if (error) {
    req.flash('response', errorResponse(req, res, error.message, 404));
    return res.redirect('/transaction');
  }
  next();
};
