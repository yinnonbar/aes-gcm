/**
 * Created by Yinnon Bratspiess on 20/08/2016.
 */
/**
 * test moudle for the encryption and decryption
 * change num of tests and the length for the randomized strings
 */

var NUM_OF_TESTS = 5;
var RANDOM_STRING_LENGTH = 5;
var gcm = require('./gcm');
var encrypted;
var decrypted;
for(var i = 0; i < NUM_OF_TESTS; i ++){
    var text = makeRand();
    encrypted = gcm.encrypt(text);
    var decrypted = gcm.decrypt(encrypted);
    console.log('test #' + (i+1));
    console.log('   key is ' + JSON.stringify(gcm.getKey()));
    console.log('   original text is ' + text);
    console.log('   decrypted text is ' + decrypted);
    console.log('   encrypted text is ' +  encrypted.content);
    if(text === decrypted){
        console.log('   test ' + (i+1) + ' is fine');
    }else {
        console.log('   problem at test ' + (i+1));
    }
}

function makeRand()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < RANDOM_STRING_LENGTH; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
