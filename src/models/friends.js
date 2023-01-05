/* eslint-disable no-unused-vars */
/* eslint-disable func-names */


module.exports = (sequelize, DataTypes) => {
  const Friends = sequelize.define(
    'Friends',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      friendId: {
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

  Friends.associate = function (models) {
  };
  return Friends;
};
