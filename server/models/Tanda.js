export default function (sequelize, DataTypes) {
  const Tanda = sequelize.define('Tanda', {
    tandaId: DataTypes.INTEGER,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    expires: DataTypes.DATE,
  }, {
    classMethods: {
      associate: models => {
        Tanda.belongsTo(models.User);
      },
    },
  });

  return Tanda;
}
