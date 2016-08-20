/**
 * Created by Yinnon Bratspiess on 18/08/2016.
 */
/**
 * encryption with aes-gcm for plaintext.
 * using parts of :
 * https://github.com/chris-rock/node-crypto-examples
 * and npm-aes-gcm-stream https://www.npmjs.com/package/aes-gcm-stream
 */

//vars for PBKDF2
var PBKDF2_PASS_LENGTH = 256;
var PBKDF2_SALT_LENGTH = 32;
var PBKDF2_ITERATIONS = 5000;
var PBKDF2_DIGEST = 'sha256';
var KEY_LENGTH = 32; // bytes

var crypto = require('crypto');
algorithm = 'aes-256-gcm';
password = createKeyBuffer();
iv = '60iP0h6vJoEa';

/*
    create a cryptographic salt - a random data to hash the pass.
    @param length - the required length for tht salt
 */
function createSalt(length){
    try {
        return crypto.randomBytes(length);
    } catch (ex) {
        console.error('Problem reading random data and generating salt');
        throw ex;
    }
}

exports.getKey = createKeyBuffer;
/*
    function that create a 256 bits key
 */
function createKeyBuffer(){
    try {
        var passphrase = crypto.randomBytes(PBKDF2_PASS_LENGTH);
        var salt = createSalt(PBKDF2_SALT_LENGTH);
        return crypto.pbkdf2Sync(passphrase, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
    } catch (ex) {
        console.error('Problem reading random data and generating a key');
        throw ex;
    }
}

exports.encrypt = encrypt;

/*
    encrypting function. return the ciphertext and a auth tag
    @param text - the plaintext to encrypt
 */
function encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return {
        content: encrypted,
        tag: tag
    };
}

exports.decrypt = decrypt;

/*
    decryption function. return decripted plaintext from cipher.
    @param encrypted - the encrypted object
 */
function decrypt(encrypted) {
    var decipher = crypto.createDecipheriv(algorithm, password, iv)
    decipher.setAuthTag(encrypted.tag);
    var dec = decipher.update(encrypted.content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

