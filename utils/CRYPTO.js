const crypto = require('crypto');
/**
 * hash方法
 *
 * @param {String} e.g.: 'md5', 'sha1'
 * @param {String|Buffer} s
 * @param {String} [format] 'hex'，'base64'. default is 'hex'.
 * @return {String} 编码值
 * @private
 */
const hash = (method, s, format) => {
	const sum = crypto.createHash(method);
	const isBuffer = Buffer.isBuffer(s);
	if(!isBuffer && typeof s === 'object') {
		s = JSON.stringify(sortObject(s));
	}
	sum.update(s, isBuffer ? 'binary' : 'utf8');
	return sum.digest(format || 'hex');
};

/**
 - md5 编码
 -  3. @param {String|Buffer} s
 - @param {String} [format] 'hex'，'base64'. default is 'hex'.
 - @return {String} md5 hash string
 - @public
 */
const md5 = (s, format) => {
	return hash('md5', s, format);
};

module.exports = {
	md5
};