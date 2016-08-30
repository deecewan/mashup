import config from '../config.json';

export default function (forceEnv) {
  let env = null;
  if (forceEnv) {
    env = forceEnv;
  } else if (process.env.NODE_ENV) {
    env = process.env.NODE_ENV;
  } else {
    env = 'production';
  }

  Object.keys(config[env]).forEach(key => {
    process.env[key] = config[env][key];
  });
}
