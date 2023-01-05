/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
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

  Groups.associate = function (models) {
    Groups.hasMany(models.GroupUsers, {
      as: 'group',
      foreignKey: 'groupId',
    });
    Groups.belongsTo(models.Users, {
      as: 'users',
      foreignKey: 'userId',
    });
  };
  return Groups;
};
