const { exceptions } = require("../../config/logger");
const User = require("../../models/user");

const UserStorage = {
    get: async (tg_user_id) => {
        try {
            let query = {};
            if (tg_user_id){
                query.tg_user_id = tg_user_id;
            }
    
            let user = await User.findOne(query)
    
            return user
        } catch(e) {
            throw e
        }
    },
    getOrCreate: async (tg_user_id, username) => {
        try {
            let query = {};
            if (tg_user_id){
                query.tg_user_id = tg_user_id;
            }
            
            let user = await User.findOne(query)
            if (user == null) {
                user = new User();
                user.tg_user_id = tg_user_id
                user.username = username
                await user.save();
            }
            
            if (user.username != username) {
                user.username = username
                user.save()
            }
            return user
        } catch(e) {
            throw e
        }
    },
    changeStep: async (tg_user_id, step) => {
        try {
            await User.updateOne({tg_user_id: tg_user_id}, {step: step});
        } catch(e) {
            throw e
        }
    },
    update: async (tg_user_id, query) => {
        try {
            await User.updateOne({tg_user_id: tg_user_id}, query);
        } catch(e) {
            throw e
        }
    },
};

module.exports = UserStorage;
