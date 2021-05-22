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
var customer_id;
var card_num
var exp_month
var exp_year
var guid

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
            await keyboards.mainMenuKeyboard(i18n),
            await keyboards.removeKeyboard)
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
            case 'logout':
                await userStorage.update(this.tg_user_id, {is_active: false});
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
            await keyboards.creditsMenuKeyboard(i18n, credits, page_num),
            await keyboards.backtoMenu(i18n))
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
                break
        }
    }

    async displayCreditDetailMenu(id) {
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_DETAIL)
        // let credits = await httpClient.getCredits(this.user.phone_number, this.user.access_token)
        let credit
        try {
            credits.result.data.installment_list.forEach(res => {
                if (res['guid'] == id) {
                    credit = res
                }
            })
        }catch (e) {
            this.displayCreditsMenu()
            return
        }
        guid = id
        customer_id = credit.customer['guid']
        let text = utils.getCreditDetailText(i18n, credit)
        this.ctx.replyWithHTML(text, 
            await keyboards.creditDetailMenuKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }
    async handleCreditDetailMenu(res) {
        switch (res) {
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
                this.displayCreditPaymentMenu(guid, customer_id)
                break
            case 'credit_payment_schedule':
                await this.ctx.deleteMessage()
                this.displayCreditGraph(guid)
                break
        }
    }

    async displayCreditGraph(guid){
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_GRAPH)
        let credit
        try {
            credits.result.data.installment_list.forEach(res => {
                if (res['guid'] == guid) {
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
            await keyboards.graphMenuKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }

    async handleCreditGraph(res){
        switch (res) {
            case 'back':
                this.ctx.deleteMessage()
                await this.displayCreditDetailMenu(guid)
                break;
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayCreditPaymentMenu(guid, customer_id) {
        await userStorage.changeStep(this.tg_user_id, steps.CREDIT_PAY_MENU)
        this.ctx.reply(i18n('pay'),
            await keyboards.payMenuKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }
    async handleCreditPaymentMenu(res) {
        switch (res){
            case 'card_list':
                this.ctx.deleteMessage()
                await this.displayBankCardMenu(guid, customer_id)
                break
            case 'paynet':
                this.ctx.deleteMessage()
                await this.ctx.reply("Инфо о способе оплаты через пайнет:\nF U")
                await this.displayCreditPaymentMenu(guid)
                break
            case 'back':
                this.ctx.deleteMessage()
                await this.displayCreditDetailMenu(guid)
                break
            case 'cancel':
                await this.ctx.deleteMessage()
                let cancel_request = await httpClient.CancelPayment(guid, this.user.access_token)
                if(cancel_request.status==200){
                    console.log("success")
                    await this.ctx.reply("Success")
                }else{
                    console.log("bad")
                    await this.ctx.reply("bad request")
                }
                this.displayCreditPaymentMenu(guid)
                break
        }
    }

    async displayBankCardMenu(guid, customer_id){
        await userStorage.changeStep(this.tg_user_id, steps.CARDS_LIST)
        let card_list = await httpClient.get_card_list(guid, this.user.access_token)
        if(card_list.status!=200){
            console.log("ERROR SENDING CARD LIST REQUEST")
            await this.ctx.deleteMessage()
            await this.ctx.reply('error occured')
            await this.displayCreditPaymentMenu(guid)
        }
        else {
            this.ctx.reply(i18n('Card List'),
                await keyboards.cardListKeyboard(i18n, card_list),
                await keyboards.backtoMenu(i18n))
        }
    }
    async handleBankCardMenu(res){
        switch (res) {
            case 'back': {
                await this.ctx.deleteMessage()
                this.displayCreditPaymentMenu(guid, customer_id)
                break
            }
            case 'add_card':
                await this.ctx.deleteMessage()
                this.add_card_num()
                break;
            default:
                await this.ctx.deleteMessage()
                this.displayRegisterSubscription(guid, customer_id)
                break;
        }
    }

    async displayRegisterSubscription(guid, customer_id){
        await userStorage.changeStep(this.tg_user_id, steps.SUBSCRIBE_PAY)
        this.ctx.reply(i18n('WANNA AUTO PAY'),
            await keyboards.is_subscribed_choose(i18n),
            await keyboards.backtoMenu(i18n))
    }

    async handle_subscribe_choice(text){
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayBankCardMenu(guid, customer_id)
                break
            case 'auto':
                await this.ctx.deleteMessage()
                let sub_req = await httpClient.register_subscribe(customer_id, guid, this.user.access_token, true)
                if(sub_req.status==200){
                    this.ctx.reply('success')
                    this.display_confirm_subs(guid, customer_id)
                }
                else{
                    this.ctx.reply('error send request')
                    this.displayBankCardMenu(guid, customer_id)
                }
                break
            case 'manual':
                await this.ctx.deleteMessage()
                let req = await httpClient.register_subscribe(customer_id, guid, this.user.access_token, false)
                if(req.status==200){
                    this.ctx.reply('success')
                    this.display_confirm_subs(guid, customer_id)
                }
                else{
                    this.ctx.reply('error send request')
                    this.displayBankCardMenu(guid, customer_id)
                }
                break
        }
    }

    async display_confirm_subs(guid, customer_id){
        await userStorage.changeStep(this.tg_user_id, steps.SUBSCRIBE_CONFIRM)
        this.ctx.reply(i18n("Enter sms code"),
            await keyboards.smscofirmkeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }

    async handle_confirm_subs(text){
        switch (text) {
            case 'back':
                await this.ctx.deleteMessage()
                this.displayCreditDetailMenu(guid)
                break
            default:
                let sub_request = await httpClient.send_sub_sms(text, guid, this.user.access_token)
                if(sub_request.status==200){
                    this.ctx.reply("success")
                    this.displayCreditDetailMenu(guid)
                    break
                }
                else{
                    this.ctx.reply("failed")
                    this.displayCreditDetailMenu(guid)
                    break
                }
        }
    }

    async add_card_num(){
        await userStorage.changeStep(this.tg_user_id, steps.ENTER_CARD_NUMBER)
        this.ctx.reply(i18n('Enter card number'),
            await keyboards.cancelKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }
    async handle_add_card_num(text){
        switch (text) {
            case 'cancel':
                card_num = exp_month = exp_year = "";
                await this.ctx.deleteMessage()
                this.displayBankCardMenu(guid, customer_id)
                break
            default:
                if(text.length==16 && Number.isInteger(parseInt(text))) {
                    card_num = text
                    this.display_add_card_year()
                    break
                }
                else {
                    this.ctx.reply(i18n("Error card number!"))
                    this.add_card_num()
                    break
                }
        }

    }
    async display_add_card_year(){
        await userStorage.changeStep(this.tg_user_id, steps.ENTER_CARD_EXPIRE_YEAR)
        this.ctx.reply(i18n('Enter card expire year'),
            await keyboards.cancelKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }

    async add_card_year(text){
        switch (text) {
            case 'cancel':
                card_num = exp_month = exp_year = "";
                await this.ctx.deleteMessage()
                this.displayBankCardMenu(guid, customer_id)
                break
            default:
                exp_year=text
                this.display_add_card_month()
                break
        }
    }

    async display_add_card_month(){
        await userStorage.changeStep(this.tg_user_id, steps.ENTER_CARD_EXPIRE_MONTH)
        this.ctx.reply(i18n('Enter card expire month'),
            await keyboards.cancelKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
    }
    async add_card_month(txt){
        if(parseInt(txt)>0 && parseInt(txt)<=12) {
            exp_month = txt
            let num = card_num
            let month = parseInt(exp_month)
            let year = parseInt(exp_year)
            let add_card_req = await httpClient.add_card_request(customer_id, guid, num, month, year, this.user.access_token)
            if (add_card_req.status == 200) {
                this.ctx.reply("SUCCESS")
            } else {
                this.ctx.reply("FAIL")
            }
            card_num = exp_month = exp_year = "";
            this.displayBankCardMenu(guid, customer_id)
        }
        else{
            this.ctx.reply(i18n("Error month!"))
            this.display_add_card_month()
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
            case 'menu_back':
                await this.ctx.deleteMessage()
                this.displayMainMenu()
                break
        }
    }

    async displayAboutMenu() {
        await userStorage.changeStep(this.tg_user_id, steps.ABOUT)

        this.ctx.reply(i18n("About Iman"),
            await keyboards.aboutMenuKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
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
            // case 'mudaraba':
            //     await this.ctx.deleteMessage()
            //     this.displayMudarabaMenu()
            //     break
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
        this.ctx.replyWithHTML(i18n('Mission content'),
            await keyboards.backKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
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
            await keyboards.backKeyboard(i18n),await keyboards.backtoMenu(i18n))
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
            await keyboards.backKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
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
            await keyboards.backKeyboard(i18n),await keyboards.backtoMenu(i18n))
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
            await keyboards.transactionsMenuKeyboard(i18n, transactions, trans_page_num),
            await keyboards.backtoMenu(i18n))
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
            await keyboards.backKeyboard(i18n),
            await keyboards.backtoMenu(i18n))
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
