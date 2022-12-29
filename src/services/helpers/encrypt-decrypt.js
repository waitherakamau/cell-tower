import CryptoJS  from 'crypto-js';

const aes_key    = process.env.AES_KEY
const aes_iv     = process.env.AES_IV

const encrypt = (payload) => {

    let encrypted =   CryptoJS.AES.encrypt(
        JSON.stringify(payload), 
        CryptoJS.enc.Hex.parse(aes_key), 
        { 
            iv: CryptoJS.enc.Hex.parse(aes_iv), 
            mode: CryptoJS.mode.CBC, 
            formatter: CryptoJS.enc.Utf8, 
            padding: CryptoJS.pad.Pkcs7 
        }
    ).toString();

    return encrypted;
};

export default encrypt;