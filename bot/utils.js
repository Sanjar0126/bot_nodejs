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
    getCreditGraph(i18n, credit){
        let title_text = i18n('Credit Graph') +'\n'
        let body_text = ''
        credit.repayment_schedule.repayment_schedule[0].repayment.forEach(element =>{
            let amount = parseInt(element['amount'])+parseInt(element['interest'])
            body_text = body_text + '\n<b>' + i18n('repayment date') + ':</b> ' + element['date'] + '\n' +
                '<b>' + i18n('repayment amount') + ':</b> ' + amount + '\n' +
                '<b>' + i18n('repayment status') + ':</b> ' + i18n(element['status']) + '\n'
        })
        return title_text+body_text;
    },
    getCreditDetailText(i18n, credit) {
        let dept_text = ''
        let this_month = new Date()
        let text = i18n('Credit detail') + '\n\n' +
            '<b>' + i18n('Credit number') + ':</b> ' + credit['contract_number'] + '\n' +
            '<b>' + i18n('Credit amount') + ':</b> ' + credit['installment_amount'] + ' ' + i18n('sum') + '\n' +
            '<b>' + i18n('Product price') + ':</b> ' + credit['total_price'] + ' ' + i18n('sum') + '\n' +
            '<b>' + i18n('Payment status') + ':</b> ' + i18n(credit['status']) + '\n' +
            '<b>' + i18n('Credit amount left') + ':</b> ' + credit.repayment_schedule.repayment_schedule[0]['remaining_price'] + ' ' + i18n('sum') + '\n' +
            '<b>' + i18n('Paid price') + ':</b> ' + credit.repayment_schedule.repayment_schedule[0]['paid_price'] + ' ' + i18n('sum') + '\n'
        credit.repayment_schedule.repayment_schedule[0].repayment.forEach(element =>{
            let temp = element['date'].split("-")
            if(parseInt(temp[1]) == parseInt(this_month.getMonth())+1){
                let next_debt = parseInt(this_month.getMonth()) + 1
                if(next_debt==12){
                    next_debt = 0
                }
                if(element['status']=='paid'){
                    dept_text='<b>' + i18n(next_debt+'m') + ':</b> ' + credit.repayment_schedule.repayment_schedule[0]['current_month_debt'] + ' ' + i18n('sum') + '\n\n'
                }
                else{
                    dept_text='<b>' + i18n(this_month.getMonth()+'m') + ':</b> ' + credit.repayment_schedule.repayment_schedule[0]['current_month_debt'] + ' ' + i18n('sum') + '\n\n'
                }
            }
        })


        let prod_txt=''
        credit.products.forEach(product =>{
            prod_txt = prod_txt + '<b>' + i18n('ProductTovar') +  '-1 :</b>\n' +
                '<b>'+ i18n('Tovar Name') +':</b> ' + product['name'] + '\n' +
                '<b>'+ i18n('Tovar Price') +':</b> ' + product['price'] + '\n' +
                '<b>'+ i18n('Tovar Count') +':</b> ' + product['count'] + '\n' +
                '<b>'+ i18n('model') +':</b> ' + product['model'] + '\n' +
                '<b>'+ i18n('serial_number') +':</b> ' + product['serial_number'] + '\n'
        })
            return text+dept_text+prod_txt
    },
    getTransactionDetail(i18n, trans) {
        let text = i18n('Transaction detail') + '\n\n' +
            '<b>' + i18n('Contract number') + ':</b> ' + trans['bond_id'] + '\n' +
            '<b>'+ i18n('Transaction date') +':</b> ' + trans['created_at'] + '\n' +
            '<b>'+ i18n('Transaction amount') +':</b> ' + trans['amount'] + '\n' +
            '<b>'+ i18n('trans_status') +':</b> ' + i18n(trans['status']) + '\n' +
            '<b>'+ i18n('repayment_schedule_date') +':</b> ' + trans['repayment_schedule_date'] + '\n' +
            '<b>'+ i18n('Payment type') +':</b> ' + i18n(trans['payment_type']) + '\n' +
            '<b>'+ i18n('update_at') +':</b> ' + trans['update_at'] + '\n'
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