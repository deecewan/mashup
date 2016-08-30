export default function (sequelize, DataTypes) {
  const Uber = sequelize.define('Uber', {
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    expires: DataTypes.DATE,
  }, {
    classMethods: {
      associate: models => {
        Uber.belongsTo(models.User);
      },
    },
  });

  return Uber;
}
