/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
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

  Users.associate = function (models) {
    Users.belongsToMany(models.Users, {
      as: 'User_Friend',
      through: 'Friends',
      foreignKey: 'userId',
    });
    Users.belongsToMany(models.Users, {
      as: 'Friend_data',
      through: 'Friends',
      foreignKey: 'friendId',
    });
    Users.hasMany(models.Transactions, {
      as: 'user',
      foreignKey: 'userId',
    });
    Users.hasMany(models.Transactions, {
      as: 'friend',
      foreignKey: 'friendId',
    });
    Users.hasMany(models.GroupUsers, {
      as: 'groupMember',
      foreignKey: 'userId',
    });
    Users.hasMany(models.Groups, {
      as: 'users',
      foreignKey: 'userId',
    });
  };
  return Users;
};
