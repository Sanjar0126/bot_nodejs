const config = {
    ENVIRONMENT: getConf("NODE_ENV", "development"),
    MONGO_HOST: getConf("MONGO_HOST", "localhost"),
    MONGO_PORT: getConf("MONGO_PORT", "27017"),
    MONGO_USER: getConf("MONGO_USER", "iman"),
    MONGO_PASSWORD: getConf("MONGO_PASSWORD", "iman"),
    MONGO_DATABASE: getConf("MONGO_DATABASE", "iman_client_bot_db"),
    BOT_TOKEN: "1774588977:AAGv60xqpghyhh-k89_D-ptioEkgrDE6wzQ",
    SERVER_URL: 'https://customer-user.api.iman.uz',
};

function getConf(name, def = "") {
    if (process.env[name]) {
      return process.env[name];
    }
    return def;
  }
  
module.exports = config;
  