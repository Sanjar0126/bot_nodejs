const userStorage = require('../storage/mongo/user')
const keyboards = require('./keyboards')
const steps = require('../config/bot_steps')
const utils = require('./utils')
const httpClient = require('./http_client')
const {i18n, activateLanguage} = require('./i18n')
var credits
var transactions;
var page_num;
var trans_page_num;

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
            + "Выберите удобный Bам язык!.\n"

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
                let res
                res = await httpClient.check_phone(text)
                if (res.status_code==200 && utils.validatePhoneNumber(text)) {
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
                let res = await httpClient.confirmLogin(this.user.phone_number, text)
                if (res.response.status == 200) {
                    await userStorage.update(this.tg_user_id, {is_active: true,
                                                                     access_token: res.response.data.access_token,
                                                                     refresh_token: res.response.data.refresh_token})
                    this.displayMainMenu()
                } else {
                    await this.ctx.reply(i18n("Incorrect code"))
                    this.displayConfirmLoginMenu()
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
                this.displayCreditsMenu(1)
                break
            case 'about':
                await this.ctx.deleteMessage()
                this.displayAboutMenu()
                break
            case 'transactions':
                await this.ctx.deleteMessage()
                this.displayTransactionsMenu(1)
                break
            case 'change_language':
                await this.ctx.deleteMessage()
                this.displaySelectLanguageMenu()
                break
        }
    }

    async displayCreditsMenu(page) {
        await userStorage.changeStep(this.tg_user_id, steps.CREDITS)
        page_num=page
        credits = await httpClient.getCredits(this.user.phone_number, this.user.access_token, page_num)

        this.ctx.reply(i18n("Credits"), 
            await keyboards.creditsMenuKeyboard(i18n, credits, page_num))
    }
    async handleCreditsMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
            case 'prev':
                page_num--
                await this.ctx.deleteMessage()
                this.displayCreditsMenu(page_num)
                break
            case 'next':
                page_num++
                await this.ctx.deleteMessage()
                this.displayCreditsMenu(page_num)
                break
            default:
                await this.ctx.deleteMessage()
                this.displayCreditDetailMenu(text)
        }
    }

    async displayCreditDetailMenu(contract_number) {
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_DETAIL)
        // let credits = await httpClient.getCredits(this.user.phone_number, this.user.access_token)
        let credit
        try {
            credits.result.data.installment_list.forEach(res => {
                if (res['contract_number'] == contract_number) {
                    credit = res
                }
            })
        }catch (e) {
            this.displayCreditsMenu()
            return
        }
        let text = utils.getCreditDetailText(i18n, credit)
        this.ctx.replyWithHTML(text, 
            await keyboards.creditDetailMenuKeyboard(i18n, contract_number))
    }
    async handleCreditDetailMenu(res) {
        let text = res.split('/', 2)
        switch (text[0]) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayCreditsMenu(page_num)
                break
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
            case 'pay':
                await this.ctx.deleteMessage()
                this.displayCreditPaymentMenu(text[1])
                break
            case 'credit_payment_schedule':
                await this.ctx.deleteMessage()
                this.displayCreditGraph(text[1])
                break
        }
    }

    async displayCreditGraph(contract_number){
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_GRAPH)
        let credit
        try {
            credits.result.data.installment_list.forEach(res => {
                if (res['contract_number'] == contract_number) {
                    credit = res
                }
            })
        }catch (e) {
            await this.ctx.reply('error occurred')
            this.displayCreditsMenu()
            return
        }
        let text = utils.getCreditGraph(i18n, credit)
        this.ctx.replyWithHTML(text,
            await keyboards.graphMenuKeyboard(i18n, contract_number))
    }

    async handleCreditGraph(res){
        let text = res.split('/', 2)
        switch (text[0]) {
            case 'back':
                this.ctx.deleteMessage()
                await this.displayCreditDetailMenu(text[1])
                break;
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayCreditPaymentMenu(contract_number) {
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_PAY_MENU)
        this.ctx.reply(i18n('pay'),
            await keyboards.payMenuKeyboard(i18n, contract_number))
    }
    async handleCreditPaymentMenu(res) {
        let text = res.split('/', 2)
        switch (text[0]){
            case 'card_list':
                this.ctx.deleteMessage()
                await this.ctx.reply("hello world")
                await this.displayBankCardMenu(text[1])
                break
            case 'paynet':
                this.ctx.deleteMessage()
                await this.ctx.reply("Инфо о способе оплаты через пайнет:\nF U")
                await this.displayCreditPaymentMenu(text[1])
                break
            case 'back':
                this.ctx.deleteMessage()
                await this.displayCreditDetailMenu(text[1])
                break
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayBankCardMenu(){

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
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayAboutMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.ABOUT)

        this.ctx.reply(i18n("About Iman"),
            await keyboards.aboutMenuKeyboard(i18n))
    }
    async handleAboutMenu(text) {
        switch (text) {
            case 'mission':
                await this.ctx.deleteMessage()
                this.displayMissionMenu()
                break
            case 'about_islam':
                await this.ctx.deleteMessage()
                this.displayIslamMenu()
                break
            case 'musavama':
                await this.ctx.deleteMessage()
                this.displayMusavamaMenu()
                break
            case 'mudaraba':
                await this.ctx.deleteMessage()
                this.displayMudarabaMenu()
                break
            case 'back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }
    async displayMissionMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.ABOUT_MISSION)
        this.ctx.reply(i18n('Mission content'),
            await keyboards.backKeyboard(i18n))
    }
    async handleMissionMenu(text){
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayAboutMenu()
                break;
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayIslamMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.ISLAM_FINANCE)
        this.ctx.reply(i18n('Islam content'),
            await keyboards.backKeyboard(i18n))
    }
    async handleIslamMenu(text){
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayAboutMenu()
                break;
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayMusavamaMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.ABOUT_MUSAVAMA)
        this.ctx.reply(i18n('Musavama content'),
            await keyboards.backKeyboard(i18n))
    }
    async handleMusavamaMenu(text){
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayAboutMenu()
                break;
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayMudarabaMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.ABOUT_MUDARABA)
        this.ctx.reply(i18n('Mudaraba content'),
            await keyboards.backKeyboard(i18n))
    }
    async handleMudarabaMenu(text){
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayAboutMenu()
                break;
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayTransactionsMenu(page) {
        await userStorage.changeStep(this.tg_user_id, steps.TRANSACTIONS)
        trans_page_num=page
        transactions = await httpClient.getTransactions(this.user.phone_number, this.user.access_token, trans_page_num)
        this.ctx.reply(i18n('Transactions'), 
            await keyboards.transactionsMenuKeyboard(i18n, transactions, trans_page_num))
    }
    async handleTransactionsMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
            case 'prev':
                trans_page_num--
                await this.ctx.deleteMessage()
                this.displayTransactionsMenu(trans_page_num)
                break;
            case 'next':
                trans_page_num++
                await this.ctx.deleteMessage()
                this.displayTransactionsMenu(trans_page_num)
                break;
            default:
                await this.ctx.deleteMessage()
                this.displayTransactionDetailMenu(text)
                break
        }
    }

    async displayTransactionDetailMenu(guid) {
        await userStorage.changeStep(this.tg_user_id, steps.TRANSACTION_DETAIL)
        let transactions = await httpClient.getTransactions(this.user.phone_number, this.user.access_token)
        let transaction
        try {
            transactions.result.data.bond_payments.forEach(res => {
                if (res['guid'] == guid) {
                    transaction = res
                }
            })
        }catch (e) {
            this.ctx.reply("Empty or Error")
            this.displayTransactionsMenu()
            return
        }
        let text = utils.getTransactionDetail(i18n, transaction)
        await this.ctx.replyWithHTML(text,
            await keyboards.backKeyboard(i18n))
    }
    async handleTransactionDetailMenu(text) {
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayTransactionsMenu()
                break
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }
}

module.exports = Bot;
