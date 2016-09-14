import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

let db = null;

const url = process.env.MYSQL_ENV_MYSQL_USER ?
  `mysql://${process.env.MYSQL_ENV_MYSQL_USER}:${process.env.MYSQL_ENV_MYSQL_USER}@`
  + `${process.env.MYSQL_PORT_3306_TCP_ADDR}:${process.env.MYSQL_PORT_3306_TCP_PORT}/`
  + `${process.env.MYSQL_ENV_MYSQL_DATABASE}` : false;

export default class Database {
  constructor() {
    if (this.db) {
      return db;
    }

    switch (process.env.NODE_ENV) {
      case 'development':
        this.url = 'mysql://mashup@localhost:3306/mashup';
        break;
      case 'testing':
        this.url = 'mysql://mashup@localhost:3306/mashup_test';
        break;
      default:
        this.url = url || 'mysql://mashup@localhost:3306/mashup';
        break;
    }
    this.models = {};
    this.sequelize = new Sequelize(this.url, {
      dialect: 'postgres',
      logging: (...args) => {
        if ([
          'development',
          // 'testing',
        ].indexOf(process.env.NODE_ENV) > 0) {
          console.log(args); // eslint-disable-line no-console
        }
      },
    });
    this.Sequelize = Sequelize;
    this.initModels();
    db = this;
    return db;
  }

  initModels() {
    fs
      .readdirSync(__dirname)
      .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
      .forEach(file => {
        const model = this.sequelize.import(path.join(__dirname, file));
        this.models[model.name] = model;
      });

    Object.keys(this.models).forEach(modelName => {
      if ('associate' in this.models[modelName]) {
        this.models[modelName].associate(this.models);
      }
    });
  }

  syncModels(force = false) {
    return this.sequelize.sync({ force });
  }
}
