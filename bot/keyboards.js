const { Markup } = require('telegraf')

const keyboards = {
    removeKeyboard: Markup.removeKeyboard(),
    cancelKeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                Markup.button.callback(i18n('btn_cancel'), 'cancel'),
            ])
            resolve(keyboard)
        }) 
    },
    backKeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                Markup.button.callback(i18n('btn_back'), 'back'),
                Markup.button.callback(i18n('menu_back'), 'menu_back')
            ])
            resolve(keyboard)
        }) 
    },

    selectLanguageMenuKeyboard: Markup.inlineKeyboard([
        [
            Markup.button.callback("🇺🇿 O'zbekcha", 'uz'),
            Markup.button.callback('🇷🇺 Русский', 'ru'),
        ]
    ]),
    loginMenuKeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.keyboard([
                [
                    i18n('btn_back'), 
                    Markup.button.contactRequest(i18n('btn_send_contact'))
                ]
            ]).resize(true).oneTime(true)
            resolve(keyboard)
        }) 
    },
    mainMenuKeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('Credits'), 'credits'),
                    Markup.button.callback(i18n('About Iman'), 'about'),
                ],
                [
                    Markup.button.callback(i18n('Transactions'), 'transactions'),
                    Markup.button.callback(i18n('btn_change_language'), 'change_language'),
                ],
            ])
            resolve(keyboard)
        })
    },

    creditsMenuKeyboard: (i18n, credits, page_num) => {
        return new Promise((resolve, reject) => {
            let arr = [];
            credits.result.data.installment_list.forEach(credit => {
                let text = i18n('Contract number') + ' - ' + credit['contract_number']
                arr.push([
                    Markup.button.callback(text, credit['contract_number'])
                ])
            })

            if(credits.result.data.count<=10){
                arr.push([
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }
            else if(page_num==1) {
                arr.push([
                    Markup.button.callback('>>>', 'next'),
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }
            else if(page_num==Math.ceil(credits.result.data.count/10)){
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }else{
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                    Markup.button.callback('>>>', 'next'),
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }

            let keyboard = Markup.inlineKeyboard(arr)
            resolve(keyboard)
        })
    },

    creditDetailMenuKeyboard: (i18n, contract_number) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('pay'), 'pay/'+contract_number),
                    Markup.button.callback(i18n('btn_credit_payment_schedule'), 'credit_payment_schedule/'+contract_number),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back'),
                    Markup.button.callback(i18n('menu_back'), 'menu_back')
                ]
            ])
            resolve(keyboard)
        })
    },

    transactionsMenuKeyboard: (i18n, transactions, page_num) => {
        return new Promise((resolve, reject) => {
            let arr = [];
            transactions.result.data.bond_payments.forEach(transaction => {
                let text = i18n('Contract number') + ' - ' + transaction['bond_id']
                arr.push([
                    Markup.button.callback(text, transaction['guid'])
                ])
            })

            if(transactions.result.data.count<=10){
                arr.push([
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }
            else if(page_num==1) {
                arr.push([
                    Markup.button.callback('>>>', 'next'),
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }
            else if(page_num==Math.ceil(transactions.result.data.count/10)){
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }else{
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                    Markup.button.callback('>>>', 'next'),
                    Markup.button.callback(i18n('btn_back'), 'back')
                ])
            }

            let keyboard = Markup.inlineKeyboard(arr)
            resolve(keyboard)
        })
    },

    aboutMenuKeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('Mission'), 'mission'),
                    Markup.button.callback(i18n('About Islam'), 'about_islam'),
                ],
                [
                    Markup.button.callback(i18n('Musavama'), 'musavama'),
                    Markup.button.callback(i18n('Mudaraba'), 'mudaraba'),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back')
                ]
            ])
            resolve(keyboard)
        })
    },

    payMenuKeyboard: (i18n,contract_number) =>{
        return new Promise((resolve, reject) =>{
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('Card List'), 'card_list/'+contract_number),
                    Markup.button.callback('Paynet', 'paynet/'+contract_number),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back/'+contract_number),
                    Markup.button.callback(i18n('menu_back'), 'menu_back/'+contract_number)
                ]
            ])
            resolve(keyboard)
        })
    },

    graphMenuKeyboard: (i18n, contract_number) =>{
        return new Promise((resolve, reject) =>{
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('btn_back'), 'back/'+contract_number),
                    Markup.button.callback(i18n('menu_back'), 'menu_back/'+contract_number)
                ]
            ])
            resolve(keyboard)
        })
    },
}


module.exports = keyboards;