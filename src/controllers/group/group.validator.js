/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */

import joi from 'joi';
import { errorResponse } from '../../helpers/index';

const addGroupObj = joi.object({
  groupName: joi.string().trim(true).required(),
  friends: joi.required(),
});

export const addGroupValidation = async (req, res, next) => {
  const { groupName, friends } = req.body;

  const payload = {
    groupName,
    friends,
  };

  const { error } = addGroupObj.validate(payload);
  if (error) {
    req.flash('response', errorResponse(req, res, error.message, 404));
    return res.redirect('/group/add');
  }
  next();
};
