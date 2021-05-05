const request = require('request');
const logger = require("../config/logger.js");

const httpClient = {
    login(data){
        res = {
            'status': 200
        }
        return res
        // return new Promise((resolve, reject) => {
        //     request({
        //         url: "",
        //         method: "POST",
        //         headers : {
        //             "Authorization" : "",
        //         },
        //         body: data,
        //         json: true,
        //     }, function (error, response, body) {
        //         if (error) {
        //             reject(error)
        //         }
        //         resolve(body);
        //     });
        // }) 
    },
    confirmLogin(phone, code){
        res = {
            'status': 200
        }
        return res
        // return new Promise((resolve, reject) => {
        //     request({
        //         url: "",
        //         method: "POST",
        //         headers : {
        //             "Authorization" : "",
        //         },
        //         body: data,
        //         json: true,
        //     }, function (error, response, body) {
        //         if (error) {
        //             reject(error)
        //         }
        //         resolve(body);
        //     });
        // }) 
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