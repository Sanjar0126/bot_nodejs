const Bot = require("./bot")
const steps = require("../config/bot_steps");
const logger = require("../config/logger.js");

const handlers = {
    handleStartCommand: async (ctx) => {
        try {
            let bot = new Bot(ctx)
            await bot.init(ctx.from)
            if (bot.user.is_active) {
                bot.displayMainMenu()
            } else {
                bot.displaySelectLanguageMenu()
            }
        }
        catch (e) {
            logger.error("Error while handling start command: " + e)
            handlers.sendErrorMessage(ctx)
        }
    },
    handleTextMessage: async (ctx) => {
        try {
            let bot = new Bot(ctx)
            await bot.init()
        
            text = ctx.message.text
            switch(bot.user.step) {
                case steps.SELECT_LANGUAGE:
                    bot.displaySelectLanguageMenu()
                    break;
                case steps.LOGIN:
                    bot.handleLoginMenu(text)
                    break;
                case steps.CONFIRM_LOGIN:
                    bot.handleConfirmLoginMenu(text)
                    break;
            }
        } catch(e) {
            logger.error("Error while handling text message: " + e)
            handlers.sendErrorMessage(ctx)
        }
    },
    handleContactMessage: async (ctx) => {
        try {
            let text = ctx.message.contact.phone_number
    
            let bot = new Bot(ctx)
            await bot.init()
            
            switch(bot.user.step) {
                case steps.LOGIN:
                    bot.handleLoginMenu(text)
                    break;
            }
        } catch(e) {
            logger.error("Error while handling contact message: " + e)
            handlers.sendErrorMessage(ctx)
        }
    },
    handleInlineQuery: async (ctx) => {
        try {
            ctx.answerCbQuery()
            
            let text = ctx.update.callback_query.data
        
            let bot = new Bot(ctx)
            await bot.init()
            
            switch(bot.user.step) {
                case steps.SELECT_LANGUAGE:
                    bot.handleSelectLanguageMenu(text)
                    break;
                case steps.CONFIRM_LOGIN:
                    bot.handleConfirmLoginMenu(text)
                    break;
                case steps.MAIN:
                    bot.handleMainMenu(text)
                    break;
                case steps.CREDITS:
                    bot.handleCreditsMenu(text)
                    break;
                case steps.CREDIT_DETAIL:
                    bot.handleCreditDetailMenu(text)
                    break;
                case steps.CREDIT_PAYMENT_SCHEDULE:
                    bot.handleCreditPaymentScheduleMenu(text)
                    break;
                case steps.ABOUT:
                    bot.handleAboutMenu(text)
                    break;
                case steps.TRANSACTIONS:
                    bot.handleTransactionsMenu(text)
                    break;
                case steps.TRANSACTION_DETAIL:
                    bot.handleTransactionDetailMenu(text)
                    break;
                case steps.ABOUT_MISSION:
                    bot.handleMissionMenu(text)
                    break
                case steps.ISLAM_FINANCE:
                    bot.handleIslamMenu(text)
                    break
                case steps.ABOUT_MUSAVAMA:
                    bot.handleMusavamaMenu(text)
                    break;
                case steps.ABOUT_MUDARABA:
                    bot.handleMudarabaMenu(text)
                    break
            }
        } catch(e) {
            logger.error("Error while handling inline message: " + e)
            handlers.sendErrorMessage(ctx)
        }
    },
    sendErrorMessage: (ctx) => {
        ctx.reply("Xatolik sodir bo'ldi, botni qayta ishga tushuring!\n"
            + "-----\n" 
            + "Произошла ошибка, перезапустите бота!"
            + "\n\n👉 /start")
    }
}

module.exports = handlers;
