/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { errorResponse } from '../helpers/index';

// Authentication Middelware
const authentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      req.flash('response', errorResponse(req, res, 'Please Login...'));
      return res.redirect('/login');
    }

    jwt.verify(token, process.env.SECRET, (error, user) => {
      if (error) {
        req.flash('response', errorResponse(req, res, 'Please Login...'));
        return res.redirect('/login');
      }
      req.user = user;

      next();
    });
  } catch (error) {
    return errorResponse(req, res, 'Error in authentication.', 500);
  }
};

export default authentication;
