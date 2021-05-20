const axios = require('axios');
const logger = require("../config/logger.js");
const SMS_CODE = 'https://customer-user.api.iman.uz/v1/sms-code'
const LOGIN_URL = 'https://customer-user.api.iman.uz/v1/login'
const GET_INSTALLMENTS = 'https://customer-user.api.iman.uz/v1/customer/installments'
const GET_TRANSACTIONS = 'https://customer-user.api.iman.uz/v1/customer/transactions'

const httpClient = {

    async check_phone(text){
        let phone = text.replace('+', '')
        let status
        try {
            let res = await axios.post(SMS_CODE, {
                phone_number: phone
            })
            console.log(res.status);
            status = res.status
            return {
                status_code: status,
            }
        }catch (e) {
            return{
                status: 404
            }
        }
    },

    async confirmLogin(text, code){
        let phone = text.replace('+', '')

        try {
            let res = await axios.post(LOGIN_URL, {
                "code": parseInt(code, 10), "phone_number": phone.toString()
            })
            return {
                response: res
            }
        }catch (e) {
            return{
                status: 500
            }
        }

    },
    async getCredits(phone, access_toke, page_num) {
        let phone_send = phone.replace('+', '')
        try {
            let credits = await axios.get(GET_INSTALLMENTS, {
                headers: {
                    Authorization: access_toke,
                },
                params: {
                    phone_number: phone_send,
                    page: page_num,
                    limit: 10
                }
            })
            return {
                result: credits
            }
        }catch (e) {
            return{
                result: 500
            }
        }
    },
    getCreditDetail() {
        let credit = {
            'credit_number': '12432423',
            'amount': 600000,
            'payment_status': 'pending',
            'left':300000,
            'current_month_amount': 100000
        }
        
        return credit
    },
    getGraph(){
        return{
            excel: "https://docs.google.com/spreadsheets/d/1PlLbVLHcZO1hTHD_l8wu1WcW5E3SnKlG6vBaJvRsWoc/edit#gid=0"
        }
    },
    getCreditPaymentSchedule() {
        let credit = [
            {
                'month': '2021-01-03',
                'amount': 600000,
                'payment_status': 'paid',
            },
            {
                'month': '2021-02-03',
                'amount': 600000,
                'payment_status': 'paid',
            },
            {
                'month': '2021-03-03',
                'amount': 600000,
                'payment_status': 'pending',
            },
        ]
        
        return credit
    },
    async getTransactions(phone, token, trans_page_num) {
        let phone_send = phone.replace('+', '')
        try {
            let transactions = await axios.get(GET_TRANSACTIONS, {
                headers: {
                    Authorization: token,
                },
                params: {
                    phone_number: phone_send,
                    page: trans_page_num,
                    limit: 10
                }
            })
            return {
                result: transactions
            }
        }catch (e) {
            return{
                result: 500
            }
        }
        return transactions
    },
    getTransactionDetail() {
        return {
            'contract_number': '12432423',
            'amount': 100000,
            'month': 1,
            'date': '2021-03-01',
            'payment_type': 'payme',
        }
    },
}

module.exports = httpClient;