import { v4 } from 'uuid';
import {
  Transactions,
  Groups,
  GroupUsers,
  Users,
} from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const addTransactionView = async (req, res) => {
  try {
    const { id } = req.query;

    req.flash('response', successResponse(req, res, 'You can add Transaction here.', 200));
    return res.render('addTransaction', { id });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Load Page.', 500, error));
    return res.redirect('/friend');
  }
};

export const addTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      totalAmount,
      friendId,
      description,
      userAmount,
      friendAmount,
    } = req.body;
    if (parseFloat(totalAmount) !== (parseFloat(friendAmount) + parseFloat(userAmount))) {
      req.flash('response', errorResponse(req, res, 'Divide Proper.', 400));
      return res.redirect('/transaction');
    }

    try {
      const payload = {
        id: v4(),
        userId,
        friendId,
        description,
        friendAmount: parseFloat(friendAmount),
      };

      await Transactions.create(payload);
    } catch (error) {
      req.flash('response', errorResponse(req, res, 'Error while create Expense.', 500, error));
      return res.redirect('/transaction');
    }

    req.flash('response', successResponse(req, res, 'Successfully add Expense.', 201));
    return res.redirect('/friend');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while add Expense.', 500, error));
    return res.redirect('/transaction');
  }
};

export const showAddGroupTransaction = async (req, res) => {
  try {
    const { id } = req.query;

    const result = await Groups.findOne({
      include: { model: GroupUsers, as: 'group', attributes: ['userId'] },
      where: { id },
      attributes: ['groupName', 'id'],
    });

    req.flash('response', successResponse(req, res, 'You can add Expense Here.', 200));
    return res.render('addGroupTransaction', { data: result });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Load Page.', 500, error));
    return res.redirect('/friend');
  }
};

export const addGroupTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId, totalAmount, description } = req.body;

    const { count, rows } = await GroupUsers.findAndCountAll({
      where: { groupId },
    });

    try {
      const perParson = totalAmount / count;
      const payloadArray = [];
      for (let i = 0; i < count; i += 1) {
        if (!(userId === rows[i].dataValues.userId)) {
          const payload = {
            id: v4(),
            userId,
            description,
            friendId: rows[i].dataValues.userId,
            friendAmount: perParson,
            groupId,
          };
          payloadArray.push(payload);
        }
      }

      await Transactions.bulkCreate(payloadArray);
    } catch (error) {
      req.flash('response', errorResponse(req, res, 'Error while create Expense.', 500, error));
      return res.redirect('/group');
    }


    req.flash('response', successResponse(req, res, 'Expense Added Successfully.', 201));
    return res.redirect('/group');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Add Expense.', 500, error));
    return res.redirect('/group');
  }
};

export const getOwesTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

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


    const result = await Transactions.findAndCountAll({
      include: { model: Users, as: 'friend', attributes: ['name'] },
      where: { userId },
      attributes: ['id', 'description', 'friendAmount', 'status'],
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


    req.flash('response', successResponse(req, res, 'Owes Details.', 200));
    return res.render('owes', {
      data: result.rows,
      current: result.current,
      limit,
      start,
      pages: end,
    });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Load page.', 500, error));
    return res.redirect('/friend');
  }
};

export const getBorrowsTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

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

    const result = await Transactions.findAndCountAll({
      include: { model: Users, as: 'user', attributes: ['name'] },
      where: { friendId: userId },
      attributes: ['id', 'description', 'friendAmount', 'status'],
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


    req.flash('response', successResponse(req, res, 'Borrow Details.', 200));
    return res.render('borrow', {
      data: result.rows,
      current: result.current,
      limit,
      start,
      pages: end,
    });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Load page.', 500, error));
    return res.redirect('/transaction/borrow');
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.query;

    await Transactions.update(
      { status: 'SETTLE' },
      { where: { id } },
    );

    req.flash('response', successResponse(req, res, 'Settle Successfully.', 200));
    return res.redirect('/transaction/owes');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while Load page.', 500, error));
    return res.redirect('/transaction/owes');
  }
};
