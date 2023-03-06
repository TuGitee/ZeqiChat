const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "QQ",
    auth: {
        user: '1137725646',
        pass: 'mvqwukkjbzbabagh'
    },
})
const receiver = (to,captcha) => {
    return {
        from: `"即刻聊天"<1137725646@qq.com>`,
        subject: '您正在注册「即刻聊天」',
        to,
        html: `
        <h3>您(${to})正在注册「即刻聊天」</h3>
        <p>验证码为: <b>${captcha}</b></p>
        <p>验证码有效时间五分钟,请在5分钟内完成注册</p>
        <p>请勿泄露给他人</p>
        <p>如非本人操作,请忽略此邮件</p>
        <p>此邮件为系统自动发送,请勿回复</p>
        <p>感谢您的使用</p>
        <p>即刻聊天项目组</p>
        <p>${getTime()}</p>
        `,
    }
}

function getTime(){
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}
module.exports = {transporter,receiver}