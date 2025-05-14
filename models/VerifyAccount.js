module.exports = (sequelize, DataTypes) => {
  const VerifyAcoount = sequelize.define("VerifyAcoount", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  VerifyAcoount.associate = (models) => {
    VerifyAcoount.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return VerifyAcoount;
};
