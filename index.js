const request = require('request');
const mongoose = require("mongoose");
const logger = require("./config/logger.js");
const cfg = require("./config");
const { Telegraf } = require('telegraf')
const botHandlers = require("./bot/handlers")
logger.info('testing1')

// Connecting to database
// let mongoDBUrl =
//     "mongodb://" +
//     cfg.MONGO_USER +
//     ":" +
//     cfg.MONGO_PASSWORD +
//     "@" +
//     cfg.MONGO_HOST +
//     ":" +
//     cfg.MONGO_PORT +
//     "/" +
//     cfg.MONGO_DATABASE;

if (cfg.ENVIRONMENT == 'development') {
    mongoDBUrl = "mongodb+srv://iman:iman@cluster0.3yg4b.mongodb.net/iman_client_bot_db?retryWrites=true&w=majority";
}
mongoDBUrl = "mongodb+srv://iman:iman@cluster0.3yg4b.mongodb.net/iman_client_bot_db?retryWrites=true&w=majority";

// if (cfg.ENVIRONMENT == 'development') {
//     mongoDBUrl = "mongodb://" + cfg.MONGO_HOST + ":" + cfg.MONGO_PORT + "/" + cfg.MONGO_DATABASE;
// }

logger.info("MongoDb url: " + mongoDBUrl);
console.log("MongoDb url: " + mongoDBUrl)
    
mongoose.connect(
    mongoDBUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        if (err) {
            console.log("Error while connecting to database (" +
                mongoDBUrl + ") "+ err.message)
            logger.error("Error while connecting to database (" + 
            mongoDBUrl + ") "+ err.message);
        }
    }
);

mongoose.connection.once("open", function () {
    logger.info("Connected to the database");
    console.log("Connected to the database");
});
  
const bot = new Telegraf(cfg.BOT_TOKEN)

bot.launch()
logger.info("Bot started ...");
console.log("Bot started ...")

bot.start(botHandlers.handleStartCommand)
bot.on('text', botHandlers.handleTextMessage)
bot.on('callback_query', botHandlers.handleInlineQuery)
bot.on('contact', botHandlers.handleContactMessage)
