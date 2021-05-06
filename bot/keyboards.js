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

    creditsMenuKeyboard: (i18n, credits) => {
        return new Promise((resolve, reject) => {
            let arr = [];
            credits.forEach(credit => {
                let text = i18n('Contract number') + ' - ' + credit['credit_number']
                arr.push([
                    Markup.button.callback(text, 'credit_id' + credit['credit_number'])
                ])
            })

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
                    Markup.button.callback(i18n('btn_back'), 'back'),
                    Markup.button.callback(i18n('btn_credit_payment_schedule'), 'credit_payment_schedule'),
                ],
            ])
            resolve(keyboard)
        })
    },

    transactionsMenuKeyboard: (i18n, transactions) => {
        return new Promise((resolve, reject) => {
            let arr = [];
            transactions.forEach(transaction => {
                let text = i18n('Contract number') + ' - ' + transaction['credit_number']
                arr.push([
                    Markup.button.callback(text, 'credit_id' + transaction['credit_number'])
                ])
            })

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
                    Markup.button.callback(i18n('Mudaraba'), 'mudaraba'),
                ],
                [
                    Markup.button.callback(i18n('btn_back'), 'back')
                ]
            ])
            resolve(keyboard)
        })
    },
}


module.exports = keyboards;