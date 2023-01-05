import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { Users } from '../../models';
import { createToken, errorResponse, successResponse } from '../../helpers';

export const loginPage = async (req, res) => {
  try {
    req.flash('response', successResponse(req, res, 'Welcome To Splitwise App.', 200));
    return res.render('login');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Not found Login Page.', 404, error));
    return res.redirect('/signin');
  }
};


export const signinPage = async (req, res) => {
  try {
    req.flash('response', successResponse(req, res, 'Welcome To Splitwise App.', 200));
    return res.render('signin');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Not found Signin Page.', 404, error));
    return res.redirect('/login');
  }
};


export const signin = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.password, 10);
    const { name, email, contactNumber } = req.body;
    const id = v4();

    const payload = {
      id,
      name,
      email,
      contactNumber,
      password,
    };

    try {
      const newUser = await Users.create(payload);
      const token = createToken(newUser.dataValues);
      res.cookie('token', token);
    } catch (error) {
      req.flash('response', errorResponse(req, res, 'Error while create User.', 500, error));
      return res.redirect('/signin');
    }

    req.flash('response', successResponse(req, res, 'User Created Successfully.'));
    return res.redirect('/friend');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error in Signin.', 500, error));
    return res.redirect('/signin');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: { email }, attributes: ['email', 'id', 'contactNumber', 'password'],
    });

    if (!user) {
      req.flash('response', errorResponse(req, res, 'Invalid credential.', 404));
      return res.redirect('/login');
    }

    try {
      const result = await bcrypt.compare(password, user.dataValues.password);

      if (!result) {
        req.flash('response', errorResponse(req, res, 'Invalid credential.', 401));
        return res.redirect('/login');
      }
    } catch (error) {
      req.flash('response', errorResponse(req, res, 'Error while Compare password.', 500, error));
      return res.redirect('/login');
    }

    const token = createToken(user.dataValues);
    res.cookie('token', token);

    req.flash('response', successResponse(req, res, 'User Login Successfully.'));
    return res.redirect('/friend');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while create user.', 500, error));
    return res.redirect('/login');
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');

    req.flash('response', successResponse(req, res, 'User Logout Successfully.', 200));
    return res.redirect('/login');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Logout.', 500, error));
    return res.redirect('/login');
  }
};
