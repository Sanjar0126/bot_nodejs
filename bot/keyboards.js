const { Markup } = require('telegraf')
const _ = require('underscore')

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
    backtoMenu: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.keyboard([
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
                    Markup.button.callback(i18n('btn_back'), 'back'),
                ]
            ]).resize(true).oneTime(true)
            resolve(keyboard)
        }) 
    },
    smscofirmkeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.keyboard([
                Markup.button.contactRequest(i18n('btn_send_contact'))
            ])
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
                [
                    Markup.button.callback(i18n('logout'), 'logout')
                ]
            ])
            resolve(keyboard)
        })
    },
    is_subscribed_choose: (i18n) =>{
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('Auto pay'), 'auto'),
                    Markup.button.callback(i18n('No auto pay'), 'manual'),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back')
                ]
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
                    Markup.button.callback(text, credit['guid'])
                ])
            })

            if(credits.result.data.count<=10){
                
            }
            else if(page_num==1) {
                arr.push([
                    Markup.button.callback('>>>', 'next'),
                ])
            }
            else if(page_num==Math.ceil(credits.result.data.count/10)){
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                ])
            }else{
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                    Markup.button.callback('>>>', 'next'),
                ])
            }
            arr.push([
                Markup.button.callback(i18n('btn_back'), 'back')
            ])

            let keyboard = Markup.inlineKeyboard(arr)
            resolve(keyboard)
        })
    },

    creditDetailMenuKeyboard: (i18n) => {
        return new Promise((resolve, reject) => {
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('pay'), 'pay'),
                    Markup.button.callback(i18n('btn_credit_payment_schedule'), 'credit_payment_schedule'),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back'),
                    Markup.button.callback(i18n('menu_back'), 'menu_back')
                ]
            ])
            resolve(keyboard)
        })
    },

    cardListKeyboard: (i18n, card_list) => {
        return new Promise((resolve, reject) => {
            let arr = []
            _.uniq(card_list.data.bond_cards, false).forEach(card => {
                if(card['card_number'] != '') {
                    let txt = i18n('Card Code') + ' - ' + card['card_number']
                    arr.push([
                        Markup.button.callback(txt, card['card_number'])
                    ])
                }
            })
            arr.push([
                Markup.button.callback(i18n('btn_back'), 'back'),
                Markup.button.callback(i18n('add_card'), 'add_card')
            ])
            let keyboard = Markup.inlineKeyboard(arr)
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
                
            }
            else if(page_num==1) {
                arr.push([
                    Markup.button.callback('>>>', 'next'),
                ])
            }
            else if(page_num==Math.ceil(transactions.result.data.count/10)){
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                ])
            }else{
                arr.push([
                    Markup.button.callback('<<<', 'prev'),
                    Markup.button.callback('>>>', 'next'),
                ])
            }
            arr.push([
                Markup.button.callback(i18n('btn_back'), 'back')
            ])

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
                    // Markup.button.callback(i18n('Mudaraba'), 'mudaraba'),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back')
                ]
            ])
            resolve(keyboard)
        })
    },

    payMenuKeyboard: (i18n) =>{
        return new Promise((resolve, reject) =>{
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('Card List'), 'card_list'),
                    Markup.button.callback('Paynet', 'paynet'),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back'),
                    Markup.button.callback(i18n('Cancel payment'), 'cancel')
                ]
            ])
            resolve(keyboard)
        })
    },

    graphMenuKeyboard: (i18n) =>{
        return new Promise((resolve, reject) =>{
            let keyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(i18n('btn_back'), 'back'),
                    Markup.button.callback(i18n('menu_back'), 'menu_back')
                ]
            ])
            resolve(keyboard)
        })
    },
}


module.exports = keyboards;