import { v4 } from 'uuid';
import { Friends, Users } from '../../models';
import { successResponse, errorResponse } from '../../helpers/index';

export const addFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.query;

    const payload = {
      id: v4(),
      friendId,
      userId,
    };

    try {
      await Friends.create(payload);
    } catch (error) {
      req.flash('response', errorResponse(req, res, 'Error while create Friend.', 500, error));
      return res.redirect('/allUser');
    }

    req.flash('response', successResponse(req, res, 'Successfully add Friend.', 201));
    return res.redirect('/allUser');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while add Friend.', 500, error));
    return res.redirect('/allUser');
  }
};

export const getFriends = async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.query.page || req.query.page === 1) {
      req.query.page = 1;
    }

    const page = parseInt(req.query.page, 10);
    let limit = 5;

    const pageCount = 5;
    if (pageCount) {
      limit = pageCount;
    }

    const offset = 0 + (req.query.page - 1) * limit;

    const result = await Users.findAndCountAll({
      include: {
        model: Users,
        as: 'User_Friend',
        attributes: ['name', 'email', 'id', 'contactNumber'],
      },
      attributes: [],
      where: { id },
      offset,
      limit,
    });

    let start = 1;

    let totalPages = Math.floor(result.count / limit);

    const mod = result.count % limit;
    if (mod !== 0) {
      totalPages += 1;
    }

    let end = totalPages;
    if (totalPages > 10) {
      if (page > 5) {
        start = page - 4;
      }
      if (start + 9 < totalPages) {
        end = start + 9;
      }
    }

    result.current = { page };

    req.flash('response', successResponse(req, res, 'Successfully Fetch Friend.', 200));
    return res.render('friend', {
      data: result.rows,
      current: result.current,
      limit,
      start,
      pages: end,
    });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Fetch Friend.', 500, error));
    return res.render('login');
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { id } = req.query;

    await Friends.destroy({
      where: { id },
    });

    req.flash('response', successResponse(req, res, 'Remove Friend Successfully.', 201));
    return res.redirect('/friend');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while delete Friend.', 500, error));
    return res.redirect('/friend');
  }
};
