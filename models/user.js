const mongoose = require('mongoose')
const steps = require('../config/bot_steps')

const UserSchema = new mongoose.Schema({
    tg_user_id: {
        type: String,
        required: true,
    },
    fullname: {
        type: String
    },
    phone_number: {
        type: String,
    },
    username: {
        type: String,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: false,
    },
    step: {
        type: String,
        required: true,
        default: steps.SELECT_LANGUAGE,
        enum: [
            steps.SELECT_LANGUAGE,
            steps.LOGIN,
            steps.CONFIRM_LOGIN,

            steps.MAIN,
            steps.ABOUT,
            steps.ABOUT_MISSION,
            steps.ISLAM_FINANCE,
            steps.ABOUT_MUSAVAMA,
            steps.ABOUT_MUDARABA,

            steps.CREDITS,
            steps.CREDIT_DETAIL,
            steps.CREDIT_PAY_MENU,
            steps.CREDIT_GRAPH,

            steps.PAYMENT,
            steps.SELECT_PAYMENT_TYPE,
            steps.CARDS_LIST,
            steps.ENTER_CARD_NUMBER,
            steps.ENTER_CARD_EXPIRE_MONTH,
            steps.ENTER_CARD_EXPIRE_YEAR,
            steps.CONFIRM_CARD,
            steps.SUBSCRIBE_PAY,
            steps.SUBSCRIBE_CONFIRM,

            steps.TRANSACTIONS,
            steps.TRANSACTION_DETAIL,
            steps.MAIN_CARD_CHOICE,
            steps.REMOVE_KEYBOARD
        ],
    },
    language: {
        type: String,
        default: 'uz',
        enum: ['uz', 'ru'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    access_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    }
})



module.exports = mongoose.model("User", UserSchema);
