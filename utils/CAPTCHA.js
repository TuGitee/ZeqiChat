module.exports = (num)=>{
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < num; i++) {
        captcha += str[parseInt(Math.random() * str.length)];
    }
    return captcha;
}