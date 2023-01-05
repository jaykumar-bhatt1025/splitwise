/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    'Transactions',
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      friendAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'SETTLE'),
        defaultValue: 'PENDING',
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
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

  Transactions.associate = function (models) {
    Transactions.belongsTo(models.Users, {
      as: 'user',
      foreignKey: 'userId',
    });
    Transactions.belongsTo(models.Users, {
      as: 'friend',
      foreignKey: 'friendId',
    });
  };
  return Transactions;
};
