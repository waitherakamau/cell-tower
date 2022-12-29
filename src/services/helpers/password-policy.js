const passwordPolicy = ({ input, name, email, userid, passPolicy }) => {
    let success = true;
    let message = 'password is weak';

    if(passPolicy.length > 0 && input){
        for(let passCheck of passPolicy){
            if( passCheck.Parameter === 'checkUsername' && passCheck.Param_Value === '1' ){
                let names = name.split(' ').filter(e => e && e)
                for( let n of names){
                    if(input.toLowerCase().includes(n.toLowerCase())){
                        success = false
                        message = passCheck.Description
                        break
                    }
                }
                //email check
                if( email && input.includes(email) || input.includes(email.split('@')[0]) ){
                    success = false
                    message = passCheck.Description
                    break;
                }
                //username check
                if( input.includes(userid) ){
                    success = false
                    message = passCheck.Description
                    break;
                }
            }
            if( passCheck.Parameter === 'lowerCase' && !(Number(input.replace(/[^a-z]/g, '').length) >= Number(passCheck.Param_Value)) ){
                success = false
                message = `${passCheck.Description} ${passCheck.Param_Value}`
                break;
            }
            if( passCheck.Parameter === 'upperCase' && !(Number(input.replace(/[^A-Z]/g, '').length) >= Number(passCheck.Param_Value)) ){
                success = false
                message = `${passCheck.Description} ${passCheck.Param_Value}`
                break;
            }
            if( passCheck.Parameter === 'numbers' && !(input.replace(/[^0-9]/g, '').length >= Number(passCheck.Param_Value)) ){
                success = false
                message = `${passCheck.Description} ${passCheck.Param_Value}`
                break;
            }
            if( passCheck.Parameter === 'specialCharacters' && !(input.replace(/[a-zA-Z0-9]/g, '').length >= Number(passCheck.Param_Value)) ){
                success = false
                message = `${passCheck.Description} ${passCheck.Param_Value}`
                break;
            }
            if( passCheck.Parameter === 'maxLength' && !(Number(input.length) <= Number(passCheck.Param_Value)) ){
                success = false
                message = `${passCheck.Description} ${passCheck.Param_Value}`
                break;
            }
            if( passCheck.Parameter === 'minLength' && !(Number(input.length) >= Number(passCheck.Param_Value)) ){
                success = false
                message = `${passCheck.Description} ${passCheck.Param_Value}`
                break;
            }
        }
    }

    return {
        success,
        message
    }
}

export default passwordPolicy;