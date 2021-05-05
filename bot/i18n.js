let languages = {
    'Enter phone number': {
        'uz': "Iltimos, telefon raqamingizni quyidagi formatda kiriting +998ХХХХХХХХХ",
        'ru': "Пожалуйста, введите свой номер телефона в формате +998ХХХХХХХХХ",
    },
    'Confirm with sms code': {
        'uz': "Telefon raqamingizga yuborilgan sms kodini yuboring",
        'ru': "Отправьте sms код на свой номер телефона",
    },
    'Main menu': {
        'uz': "Asosiy menu",
        'ru': "Asosiy menu",
    },
    'Credits': {
        'uz': "📃 Mening rasrochkalarim",
        'ru': "📃 Мои рассрочки",
    },
    'Credit detail': {
        'uz': "Rasrochka malumotlari",
        'ru': "Информация о рассрочке",
    },
    'Credit payment schedule': {
        'uz': "To'lov jadvali",
        'ru': "График погашения",
    },
    'Payment': {
        'uz': "💰 To'lov",
        'ru': "💰 Оплата",
    },
    'Transactions': {
        'uz': "🔁 Transaksiyalar",
        'ru': "🔁 Транзакции",
    },
    'Contract number': {
        'uz': "📄 Shartnoma raqami",
        'ru': "📄 Номер договорa",
    },
    'Credit number': {
        'uz': "Rasrochka raqami",
        'ru': "Номер рассрочки",
    },
    'Credit amount': {
        'uz': "Rasrochka summasi",
        'ru': "Сумма рассрочки",
    },
    'Payment status': {
        'uz': "To'lov statusi",
        'ru': "Статус платежа",
    },
    "Credit amount left": {
        'uz': "Qolgan to'lov miqdori",
        'ru': "Осталась сумма кредита",
    },
    "amount": {
        'uz': "summa",
        'ru': "сумма",
    },
    "month": {
        'uz': "oy",
        'ru': "месяц",
    },
    "status": {
        'uz': "status",
        'ru': "статус",
    },
    "Current month amount": {
        'uz': "Hozirgi oy uchun to'lov",
        'ru': "Сумма текущего месяца",
    },
    "sum": {
        'uz': "so'm",
        'ru': "сум",
    },
    "pending": {
        'uz': "⏳ Kutilyapti",
        'ru': "⏳ Ожидании",
    },
    "paid": {
        'uz': "✅ To'langan",
        'ru': "✅ Оплаченный",
    },
    "cancelled": {
        'uz': "❌ Bekor qilingan",
        'ru': "❌ Отменено",
    },

    // buttons
    'btn_cancel': {
        'uz': "❌ Bekor qilish",
        'ru': "❌ Отменить",
    },
    'btn_back': {
        'uz': "⬅️ Orqaga",
        'ru': "⬅️ Назад",
    },
    'btn_send_contact': {
        'uz': "📞 Telefon raqam yuborish",
        'ru': "📞 Отправить контакт",
    },
    'btn_confirm': {
        'uz': "✅ Tasdiqlash",
        'ru': "✅ Подтвердить",
    },
    'btn_change_language': {
        'uz': "🌐 Til",
        'ru': "🌐 Язык",
    },
    'btn_credit_payment_schedule': {
        'uz': '🗓 To\'lov jadvali',
        'ru': '🗓 График погашения',
    }
}

let language = 'ru'

function activateLanguage(lang) {
    language = lang
}

function i18n(text) {
    try {
        result = languages[text][language]
        return languages[text][language]
    } catch(e) {
        return text
    }
}

module.exports = {activateLanguage, i18n}