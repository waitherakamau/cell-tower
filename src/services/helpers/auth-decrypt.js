import CryptoJS  from 'crypto-js';

const aes_key    = process.env.AES_KEY
const aes_iv     = process.env.AES_IV

const decrypt = (payload) => {

    let decrypted =   CryptoJS.AES.decrypt(
        payload.toString(), 
        CryptoJS.enc.Hex.parse(aes_key), 
            { 
                iv: CryptoJS.enc.Hex.parse(aes_iv), 
                mode: CryptoJS.mode.CBC, 
                formatter: CryptoJS.enc.Utf8, 
                padding: CryptoJS.pad.Pkcs7 
            }
    ).toString(CryptoJS.enc.Utf8);

    try {
        decrypted = JSON.parse(decrypted);
    } catch (error) {
        
    }

    return decrypted;
};

export default decrypt;