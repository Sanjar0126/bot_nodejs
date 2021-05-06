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

            steps.CREDITS,
            steps.CREDIT_DETAIL,

            steps.PAYMENT,
            steps.SELECT_PAYMENT_TYPE,
            steps.CARDS_LIST,
            steps.ENTER_CARD_NUMBER,
            steps.ENTER_CARD_NUMBER,
            steps.CONFIRM_CARD,

            steps.TRANSACTIONS,
            steps.TRANSACTION_DETAIL,
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
})



module.exports = mongoose.model("User", UserSchema);
