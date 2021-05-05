const userStorage = require('../storage/mongo/user')
const keyboards = require('./keyboards')
const steps = require('../config/bot_steps')
const utils = require('./utils')
const httpClient = require('./http_client')
const {i18n, activateLanguage} = require('./i18n')

class Bot {
    constructor(ctx) {
        this.ctx = ctx
        this.tg_user_id = ctx.from.id
    }

    async init() {
        this.user = await userStorage.getOrCreate(this.tg_user_id, this.ctx.from.username)
        activateLanguage(this.user.language)
    }
    
    async displaySelectLanguageMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.SELECT_LANGUAGE)
        let text = "O'zingizga qulay tilni tanlang!\n"
            + "-----\n" 
            + "Выберите удобный Вам язык!.\n"

        this.ctx.reply(text, keyboards.selectLanguageMenuKeyboard)
    } 

    async handleSelectLanguageMenu(text) {
        await this.ctx.deleteMessage()
        await userStorage.update(this.tg_user_id, {'language': text})
        
        this.user.language = text
        activateLanguage(text)
        
        if (this.user.is_active) {
            this.displayMainMenu()
        } else {
            this.displayLoginMenu()
        }
    }

    async displayLoginMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.LOGIN)

        this.ctx.replyWithHTML(i18n('Enter phone number'), await keyboards.loginMenuKeyboard(i18n))
    }
    
    async handleLoginMenu(text) {
        switch (text) {
            case '⬅️ Orqaga':
            case '⬅️ Назад':
                this.displaySelectLanguageMenu()
                break
            default:
                if (!text.startsWith("+", 0)) {
                    text = '+' + text
                }
                
                if (utils.validatePhoneNumber(text)) {
                    await userStorage.update(this.tg_user_id, {'phone_number': text})
                    
                    this.user.phone_number = text
                    this.displayConfirmLoginMenu()
                } else {
                    await this.ctx.reply(i18n("Incorrect phone number"))
                    this.displayLoginMenu()
                }     
        }
    }
    
    async displayConfirmLoginMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.CONFIRM_LOGIN)

        this.ctx.replyWithHTML(i18n('Confirm with sms code'), 
            await keyboards.backKeyboard(i18n))
    }
    async handleConfirmLoginMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayLoginMenu()
                break
            default:
                res = httpClient.confirmLogin(this.user.phone_number, text)
                if (res.status == 200) {
                    await userStorage.update(this.tg_user_id, {is_active: true})
                    this.displayMainMenu()
                } else {
                    await this.ctx.reply(i18n("Incorrect code"))
                    this.displayConfirmMenu()
                }     
        }
    }
    
    async displayMainMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.MAIN)

        this.ctx.reply(i18n("Main menu"), 
            await keyboards.mainMenuKeyboard(i18n))
    }
    async handleMainMenu(text) {
        switch (text) {
            case 'credits':
                await this.ctx.deleteMessage()
                this.displayCreditsMenu()
                break
            case 'payment':
                await this.ctx.deleteMessage()
                this.displayPaymentMenu()
                break
            case 'transactions':
                await this.ctx.deleteMessage()
                this.displayTransactionsMenu()
                break
            case 'change_language':
                await this.ctx.deleteMessage()
                this.displaySelectLanguageMenu()
                break
        }
    }

    async displayCreditsMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.CREDITS)
        
        let credits = httpClient.getCredits()
        this.ctx.reply(i18n("Credits"), 
            await keyboards.creditsMenuKeyboard(i18n, credits))
    }
    async handleCreditsMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
            default:
                await this.ctx.deleteMessage()
                this.displayCreditDetailMenu()
        }
    }

    async displayCreditDetailMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_DETAIL)
        let credit = httpClient.getCreditDetail()
        let text = utils.getCreditDetailText(i18n, credit)
        this.ctx.replyWithHTML(text, 
            await keyboards.creditDetailMenuKeyboard(i18n))
    }
    async handleCreditDetailMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayCreditsMenu()
                break
            case 'credit_payment_schedule':
                await this.ctx.deleteMessage()
                this.displayCreditPaymentScheduleMenu()
                break
        }
    }

    async displayCreditPaymentScheduleMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_PAYMENT_SCHEDULE)
        let creditPaymentSchedule = httpClient.getCreditPaymentSchedule()
        
        let text = utils.getCreditPaymentScheduleText(i18n, creditPaymentSchedule)
        this.ctx.reply(text, 
            await keyboards.backKeyboard(i18n))
    }
    async handleCreditPaymentScheduleMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayCreditDetailMenu()
                break
        }
    }

    async displayPaymentMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.MAIN)

        this.ctx.reply(i18n("Main menu"), 
            await keyboards.selectMainMenuKeyboard(i18n))
    }
    async handlePaymentMenu(text) {
        switch (text) {
            case 'Мои рассрочки':
            case 'Mening rasrochkalarim':
                this.displayCreditsMenu()
                break
        }
    }

    async displayTransactionsMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.TRANSACTIONS)
        let transactions = httpClient.getTransactions()
        this.ctx.reply(i18n('Transactions'), 
            await keyboards.transactionsMenuKeyboard(i18n, transactions))
    }
    async handleTransactionsMenu(text) {
        switch (text) {
            case 'back':
                this.displayMainMenu()
                break
            default:
                this.displa()
        }
    }

    async displayTransactionDetailMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.TRANSACTIONS)
        let transaction = httpClient.getTransactionDetail()
        let text = utils.getTransactionDetail(i18n, transaction)
        this.ctx.reply(text, 
            await keyboards.backKeyboard(i18n))
    }
    async handleTransactionDetailMenu(text) {
        switch (text) {
            case 'back':
                this.displayTransactionsMenu()
                break
        }
    }
}

module.exports = Bot;