const config = {
  ENVIRONMENT: getConf("NODE_ENV", "development"),
  MONGO_HOST: getConf("MONGO_HOST", "cluster0.3yg4b.mongodb.net"),
  MONGO_PORT: getConf("MONGO_PORT", "27017"),
  MONGO_USER: getConf("MONGO_USER", "iman"),
  MONGO_PASSWORD: getConf("MONGO_PASSWORD", "iman"),
  MONGO_DATABASE: getConf("MONGO_DATABASE", "iman_client_bot_db"),
  BOT_TOKEN: "1774588977:AAE4cJ63fto2fWZxZhfzhMQ5XkWXgJG8Ocs"
};

function getConf(name, def = "") {
    if (process.env[name]) {
      return process.env[name];
    }
    return def;
  }
  
module.exports = config;
  