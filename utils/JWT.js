const jwt = require('jsonwebtoken')
const secret = "chatnowsecret"
const JWT = {
    generate(payload, expiresIn) {
        return jwt.sign(payload, secret, { expiresIn })
    },
    verify(token) {
        try {
            return jwt.verify(token, secret)
        }catch {
            return false
        }
    }
}
module.exports = JWT