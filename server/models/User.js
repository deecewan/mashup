export default function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    photo: DataTypes.STRING,
  }, {
    classMethods: {
      associate: models => {
        User.hasOne(models.Tanda);
        User.hasOne(models.Uber)
      },
    },
  });

  return User;
}
