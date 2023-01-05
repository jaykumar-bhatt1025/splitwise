/* eslint-disable import/prefer-default-export */
import { Op } from 'sequelize';
import { Users } from '../../models';
import { errorResponse, successResponse } from '../../helpers';

export const allUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const search = req.query.searchWord || '';

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
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
        [Op.and]: { [Op.not]: { id: userId } },
      },
      attributes: ['email', 'name', 'contactNumber', 'id'],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
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


    req.flash('response', successResponse(req, res, 'Successfully Featch all Users.', 200));
    return res.render('allUsers', {
      data: result.rows,
      current: result.current,
      limit,
      start,
      pages: end,
    });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while fatch Users.', 500, error));
    return res.redirect('/friend');
  }
};
