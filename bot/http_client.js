const axios = require('axios');
const logger = require("../config/logger.js");
const config = require("../config/index");
const SMS_CODE = config.SERVER_URL + '/v1/sms-code'
const LOGIN_URL = config.SERVER_URL + '/v1/login'
const GET_INSTALLMENTS = config.SERVER_URL + '/v1/customer/installments'
const GET_TRANSACTIONS = config.SERVER_URL + '/v1/customer/transactions'
const POST_CANCEL_PAYMENT = config.SERVER_URL + '/v1/customer/cancel-payment/'
const GET_CARD_LIST = config.SERVER_URL + "/v1/customer/get-cards/"

const httpClient = {

    async check_phone(text){
        let phone = text.replace('+', '')
        let status
        
            try{
                let res = await axios.post(SMS_CODE, {
                    phone_number: phone
                })
                console.log(res.status);
                status = res.status
                return res
            }catch(e){
                status = 500
                return {
                    res: status
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
    async send_sub_sms(cod, id, token){
        return await axios.post(config.SERVER_URL+'/v1/customer-subscription-otp',{
            code: cod,
            guid: id
        },
            {
                headers:{
                    Authorization: token
                },
            })
    },
    async register_subscribe(customer_id, guid, token, status){
        try{
            return await axios.post(config.SERVER_URL + '/v1/customers/' + customer_id + '/installments/' + guid + '/registry-subscription',
                {
                    is_subscribed: status
                },
                {
                    headers: {
                        Authorization: token
                    },
                    params: {
                        id: customer_id,
                        guid: guid
                    }
                })
        }catch (e) {
            console.log(e)
            return {
                status: 501
            }
        }
    },
    async add_card_request(customer_id, guid, card_num, exp_mon, exp_year, token, status){
        try{
            return await axios.post(config.SERVER_URL + '/v1/customers/' + customer_id + '/installments/' + guid + '/card', {
                card_expiry_month: exp_mon,
                card_expiry_year: exp_year,
                card_number: card_num,
                is_active: status
            }, {
                headers: {
                    Authorization: token
                },
                params: {
                    id: customer_id,
                    guid: guid
                }
            })
        }catch (e) {
            console.log(e)
            return {
                status: 500
            }
        }
    },
    async get_card_list(guid, access_token){
        try
        {
            return await axios.get(GET_CARD_LIST + guid, {
                headers: {
                    Authorization: access_token
                }
            })
        }catch (e){
            return {
                respose: 500
            }
        }

    },
    async CancelPayment(guid, access_token){
        try {
            return await axios.post(POST_CANCEL_PAYMENT, {
                bond_uuid: guid,
            }, {
                headers: {
                    Authorization: access_token
                }
            });
        }catch (e) {
            return {
                response: "ERROR SENDING REQUEST"
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