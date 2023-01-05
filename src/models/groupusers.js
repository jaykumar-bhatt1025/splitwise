/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
  const GroupUsers = sequelize.define(
    'GroupUsers',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
  );

  GroupUsers.associate = function (models) {
    GroupUsers.belongsTo(models.Groups, {
      as: 'group',
      foreignKey: 'groupId',
    });
    GroupUsers.belongsTo(models.Users, {
      as: 'groupMember',
      foreignKey: 'userId',
    });
  };
  return GroupUsers;
};
