const logger = require("../config/logger.js");
const config = require("../config/index.js")
const axios = require("axios");

const utils = {
    validatePhoneNumber(phone_number) {
        var phoneValidationRegExp = new RegExp(/\+998[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/);
        if (phone_number.match(phoneValidationRegExp)) {
            return true
        }

        return false
    },
    getCreditDetailText(i18n, credit) {
        let text = i18n('Credit detail') + '\n\n' +
            '<b>' + i18n('Credit number') + ':</b> ' + credit['credit_number'] + '\n' + 
            '<b>' + i18n('Credit amount') + ':</b> ' + credit['amount'] + ' ' + i18n('sum') + '\n' +
            '<b>' + i18n('Payment status') + ':</b> ' + i18n(credit['payment_status']) + '\n' +
            '<b>' + i18n('Credit amount left') + ':</b> ' + credit['left'] + ' ' + i18n('sum') + '\n'
            '<b>' + i18n('Current month amount') + ':</b> ' + credit['current_month_amount'] + ' ' + i18n('sum') + '\n'
            return text
    },
    getTransactionDetail(i18n, trans) {
        let text = i18n('Transaction detail') + '\n\n' +
            '<b>' + i18n('Contract number') + ':</b> ' + trans['contract_number'] + '\n' +
            '<b>'+ i18n('Transaction amount') +':</b> ' + trans['amount'] + '\n' +
            '<b>'+ i18n('Transaction month') +':</b> ' + trans['month'] + '\n' +
            '<b>'+ i18n('Transaction date') +':</b> ' + trans['date'] + '\n' +
            '<b>'+ i18n('Payment type') +':</b> ' + i18n(trans['payment_type']) + '\n'
            return text
    },
    getCreditPaymentScheduleText(i18n, creditPaymentSchedule) {
        let text = i18n('Credit payment schedule') +
            ' (' + i18n('month') + ', ' + i18n('amount') + ', ' + i18n('status') + ')\n'

        creditPaymentSchedule.forEach(data => {
            text += '\n' + data['month'] + '     ' + data['amount'] + ' ' + i18n('sum') + '     ' + i18n(data['payment_status']) 
        });
        return text
    }
    
}

module.exports = utils;