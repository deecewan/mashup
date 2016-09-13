import config from '../../config.json';

function loadConfig(forceEnv) {
  let env = null;
  if (forceEnv) {
    env = forceEnv;
  } else if (process.env.NODE_ENV) {
    env = process.env.NODE_ENV;
  } else {
    env = 'production';
  }

  console.log(config[env]);

  Object.keys(config[env]).forEach(key => {
    process.env[key] = config[env][key];
  });
}

// set up the environment
loadConfig();