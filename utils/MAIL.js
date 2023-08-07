const template = require('../utils/TEMPLATE');
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "QQ",
    auth: {
        user: '1137725646',
        pass: 'piixnjtjhrfmbabh'
    },
})
const receiver = (method = "登录", to, captcha) => {
    return {
        from: `"择栖tech"<1137725646@qq.com>`,
        subject: `您正在${method}「择栖聊天室」`,
        to,
        html: template(method, to, captcha)
    }
}

module.exports = { transporter, receiver }