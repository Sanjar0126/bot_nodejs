const request = require('request');
const mongoose = require("mongoose");
const logger = require("./config/logger.js");
const cfg = require("./config");
const { Telegraf } = require('telegraf')
const botHandlers = require("./bot/handlers")
  
// Connecting to database
let mongoDBUrl =
    "mongodb://" +
    cfg.MONGO_USER +
    ":" +
    cfg.MONGO_PASSWORD +
    "@" +
    cfg.MONGO_HOST +
    ":" +
    cfg.MONGO_PORT +
    "/" +
    cfg.MONGO_DATABASE;

if (cfg.ENVIRONMENT == 'development') {
    mongoDBUrl = "mongodb://" + cfg.MONGO_HOST + ":" + cfg.MONGO_PORT + "/" + cfg.MONGO_DATABASE;
}

logger.info("MongoDb url: " + mongoDBUrl);
    
mongoose.connect(
    mongoDBUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        if (err) {
            logger.error("Error while connecting to database (" + 
            mongoDBUrl + ") "+ err.message);
        }
    }
);

mongoose.connection.once("open", function () {
    logger.info("Connected to the databasee");
});
  
const bot = new Telegraf(cfg.BOT_TOKEN)

bot.launch()
logger.info("Bot started ...");

bot.start(botHandlers.handleStartCommand)
bot.on('text', botHandlers.handleTextMessage)
bot.on('callback_query', botHandlers.handleInlineQuery)
bot.on('contact', botHandlers.handleContactMessage)
