/* eslint-disable consistent-return */

import joi from 'joi';
import { errorResponse } from '../../helpers/index';

const signinObj = joi.object({
  name: joi.string().trim(true).required(),
  email: joi.string().email().required(),
  contactNumber: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
  password: joi.string().required(),
});

export const signinValidation = async (req, res, next) => {
  const {
    name,
    email,
    password,
    contactNumber,
  } = req.body;

  const payload = {
    name,
    email,
    password,
    contactNumber,
  };

  const { error } = signinObj.validate(payload);
  if (error) {
    req.flash('response', errorResponse(req, res, error.message, 404));
    return res.redirect('/signin');
  }
  next();
};

const loginObj = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const loginValidation = async (req, res, next) => {
  const { email, password } = req.body;

  const payload = {
    email,
    password,
  };

  const { error } = loginObj.validate(payload);
  if (error) {
    req.flash('response', errorResponse(req, res, error.message, 404));
    return res.redirect('/login');
  }
  next();
};
