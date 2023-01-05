import { v4 } from 'uuid';
import { Groups, GroupUsers, Users } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const addGroupShow = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await Users.findAll({
      include: {
        model: Users,
        as: 'User_Friend',
        attributes: ['name', 'id'],
      },
      attributes: [],
      where: { id },
    });

    req.flash('response', successResponse(req, res, 'You can add Group here.', 200));
    return res.render('addGroup', { data: result });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while fatch Page.', 500, error));
    return res.redirect('/group');
  }
};

export const addGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupName, friends } = req.body;
    const id = v4();

    const groupPayload = {
      id,
      groupName,
      userId,
    };
    const groupUserPayload = [{
      id: v4(),
      groupId: id,
      userId,
    }];

    if (!(Array.isArray(friends))) {
      groupUserPayload.push({
        id: v4(),
        groupId: id,
        userId: friends,
      });
    } else {
      for (let i = 0; i < friends.length; i += 1) {
        const payload = {
          id: v4(),
          groupId: id,
          userId: friends[i],
        };
        groupUserPayload.push(payload);
      }
    }

    try {
      await Groups.create(groupPayload);
      await GroupUsers.bulkCreate(groupUserPayload);
    } catch (error) {
      req.flash('response', errorResponse(req, res, 'Error while creating Group.', 500, error));
      return res.redirect('/group');
    }

    req.flash('response', successResponse(req, res, 'Group created Successfully.', 201));
    return res.redirect('/group');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while creating Group.', 500, error));
    return res.redirect('/group');
  }
};

export const getGroup = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Groups.findAll({
      include: {
        model: GroupUsers,
        as: 'group',
        attributes: ['userId'],
        include: {
          model: Users,
          as: 'groupMember',
          attributes: ['name'],
        },
      },
      where: { userId },
      attributes: ['groupName', 'id'],
    });

    req.flash('response', successResponse(req, res, 'All Group fetch successfully.', 200));
    return res.render('showGroup', { data: result });
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while get Group.', 500, error));
    return res.redirect('/user');
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.query;

    await Groups.destroy({
      where: { id },
    });

    req.flash('response', successResponse(req, res, 'Group delete successfully.', 200));
    return res.redirect('/group');
  } catch (error) {
    req.flash('response', errorResponse(req, res, 'Error while delete Group.', 500, error));
    return res.redirect('/group');
  }
};
