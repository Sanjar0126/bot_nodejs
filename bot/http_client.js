const axios = require('axios');
const logger = require("../config/logger.js");

const httpClient = {

    check_phone(text){
        let phone = text.replace('+', '')
        let verify_code
        let status
        axios.post('https://customer-user.api.iman.uz/v1/sms-code', {
            phone_number: phone
        }).then(function (response) {
            console.log(response);
            verify_code = response.data.code
            status = response.status
        }).catch(function (error) {
            console.log(error);
        });
        res = {
            'status': status,
            'code': verify_code
        }
        return res

    },

    confirmLogin(text, code){
        let phone = text.replace('+', '')
        let status
        let body = {
            "code": code,
            "phone_number": phone
        }
        axios.post('https://customer-user.api.iman.uz/v1/login', {
            body
        }).then(function (response) {
            console.log(response);
            status = response.status
        }).catch(function (error) {
            console.log(error);
        });
        return {
            'status': status
        }

    },
    getCredits() {
        let credits = [
            {
                'credit_number': '12432423',
                'amount': 600000,
                'payment_status': 'pending',
                'left':300000,
                'current_month_amount': 100000
            },
            {
                'credit_number': '12432478',
                'amount': 1800000,
                'payment_status': 'pending',
                'left': 900000,
                'current_month_amount': 300000
            },
            {
                'credit_number': '982432423',
                'amount': 1200000,
                'payment_status': 'pending',
                'left':800000,
                'current_month_amount': 200000
            }
        ]

        return credits
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
    getTransactions() {
        let transactions = [
            {
                'contract_number': '12432423',
                'amount': 100000,
                'date': '2021-03-01',
                'payment_type': 'payme',
            },
            {
                'contract_number': '12432423',
                'amount': 100000,
                'date': '2021-02-01',
                'payment_type': 'payme',
            },
            {
                'contract_number': '12432423',
                'date': 100000,
                'month': '2021-01-01',
                'payment_type': 'payme',
            }
        ]

        return transactions
    },
    getTransactionDetail() {
        let transaction = {
            'contract_number': '12432423',
            'amount': 100000,
            'date': '2021-03-01',
            'payment_type': 'payme',
        }

        return transaction
    },
}

module.exports = httpClient;