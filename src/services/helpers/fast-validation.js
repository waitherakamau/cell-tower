
import { isValidPhoneNumber, findPhoneNumbersInText } from 'libphonenumber-js'



const fastValidation = ( input, min, max, errorMessage, validatorName ) => {

	const Validator = require("fastest-validator"); 
	const v         = new Validator();

	let schema = {}
	let checkSchema = false
	let oldLength
	let newLength
	let response = {
		isValid: false
	}
	
	switch ( validatorName ) {
		case "isFdAmount":
			
			if ( parseInt(input, 10) >= parseInt(min, 10) ) {
				response = {
					isValid :true
				}				
			} 
			else {
				response = {
					isValid :false
				}
			}
			break;
		case "isPaybillAmount":
			if ( input <= 150000 && input >= 10 ) {
				response = {
					isValid :true
				}				
			} 
			else {
				response = {
					isValid :false
				}
			}
			break;


		case "isDiasporaAmount":
			if ( input <= 1000000 && input >= 200 ) {
				response = {
					isValid :true
				}				
			} 
			else {
				response = {
					isValid :false
				}
			}
			break;

		case "isValidCardNumber":
			
			oldLength= input.length
			newLength = input.replace(/[^0-9]/g,'').length
			
			if ( oldLength === newLength  && oldLength === 16 ) {
				response = {
					isValid :true
				}
			}
			else{
				response = {
					isValid:false
				}
			}

			break;
		case "isValidCardExpiry":

			let parts = input.split ( "/" )

			if ( parts.length === 2 ) {
				let d     = new Date()
				let year  = d.getFullYear().toString().slice(2)
				let month = d.getMonth() + 1

				// current year validation
				

				if ( 
					input.length       === 5   && 
					parts[0].length    === 2   && 
					parts[1].length    === 2   &&
					parseInt(parts[0], 10) < 13 &&  // months
					parseInt(parts[0], 10) > 0  &&  // months 
					parseInt(parts[1], 10) < 100 && // year
					parseInt(parts[1], 10) > -1     // year 
				){
					// same year, month has to be greater
					if ( parseInt(parts[1], 10) === parseInt(year, 10) && parseInt(parts[0], 10)  < parseInt(month, 10) ){
						response = {
							isValid:false
						}
					}
					else if ( parseInt(parts[1], 10) > parseInt(year, 10) ){
						response = {
							isValid:true
						}
					}
					else {
						response = {
							isValid:false
						}
					}
					
				}
			}
			else {
				response = {
					isValid:false
				}				
			}

			break;
		case "isValidCvv":
			oldLength= input.length
			newLength = input.replace(/[^0-9]/g,'').length
			
			if ( oldLength === newLength  && oldLength === 3 ) {
				response = {
					isValid :true
				}
			}
			else{
				response = {
					isValid:false
				}
			}
			break;

		case "isInternationalPhoneNumber":
			
			oldLength= input.length
			newLength = input.replace(/[^0-9]/g,'').length
			
			if ( 
				oldLength === newLength && oldLength === 12  && input.startsWith("2")  
			) {
				response = {
					isValid :true
				}
			}
			else {
				response = {
					isValid :false
				}
			}
			break
		case "isDiasporaPhoneNumber":{
			let check = findPhoneNumbersInText (input)
 
			response = { 
				isValid : check.length !== 0,
				check
			}
		}break
		case "isPassword":
			response = {
				isValid : true
			}
			break
		case "isStudentId":
			response = {
				isValid : true
			}
			break
		case "isLockSavingsAccount":

			if ( !input.startsWith ( 'SV')){
				response = {
					isValid : false
				}
			}
			else{
				response = {
					isValid : true
				}
			}
			break;
		case "isKenyanPlotNumber":
			response = {
				isValid : true
			}
			break
		case "isStatement" :

			input = input.replace ( /[.]/g,' ' )//replace dots with spaces ( eclectics issues )
			input = input.toString().trim()
		
			try {
				let dataLength = input.length
				let regex = /[^A-Za-z\s]+$/i
				let newData = input.replace(regex, "")
				let newDataLength = newData.length
				if (dataLength > 0 && dataLength === newDataLength) {
					response = {
						isValid : true
					}
				}
				else {
					response = {
						isValid : false
					}
				}
				if (max && dataLength > Number(max)) {
					response = {
						isValid : false,
						message : `Exceeds length ${max}`
					}
				}
			}
			catch ( e ) {
				response = {
					isValid : false
				}
			}
			break;
		
		case "isBillAmount":
			schema = {
				input: {
					type    : 'number',
					positive: true,
					min     : 5,
					convert: true
				}
			}

			checkSchema = v.validate ( { input }, schema )
			
			response = {
				isValid : typeof checkSchema === 'boolean' ? checkSchema : false
			}
			break
		case "isAmount":
			schema = {
				input: {
					type    : 'number',
					positive: true,
					min     : parseInt(min, 10) ? parseInt(min, 10) : 1,
					convert: true
				}
			}

			checkSchema = v.validate ( { input }, schema )
			
			response = {
				isValid : typeof checkSchema === 'boolean' ? checkSchema : false
			}
			break
		case "isLockSavingsAmount":
			schema = {
				input: {
					type    : 'number',
					positive: true,
					min     : 5000,
					convert: true
				}
			}

			checkSchema = v.validate ( { input }, schema )
			
			response = {
				isValid : typeof checkSchema === 'boolean' ? checkSchema : false
			}
			break

		case "isFtAmount":
			schema = {
				input: {
					type    : 'number',
					positive: true,
					min     : 10,
					convert: true
				}
			}

			checkSchema = v.validate ( { input }, schema )
			
			response = {
				isValid : typeof checkSchema === 'boolean' ? checkSchema : false
			}
			break
		case "isPesalinkAmount":
			schema = {
				input: {
					type    : 'number',
					positive: true,
					min     : 10,
					max     : 999999,
					convert: true
				}
			}

			checkSchema = v.validate ( { input }, schema )
			
			response = {
				isValid : typeof checkSchema === 'boolean' ? checkSchema : false
			}
			break
		case "isText":
			let oldInp = input.replace(/[^A-Za-z ]/g, '')
			if(input === oldInp && input.length > 1){
				response = {
					isValid :true
				}
			}else{
				response = {
					isValid :false
				}
			}
			// if (/^[A-Za-z]+$/i.test(input)) {
			// 	response = {
			// 		isValid :true
			// 	}
			// }
			// else {
			// 	response = {
			// 		isValid :false
			// 	}
			// }
			break;
		case "isAirtimeAmount":
			schema = {
				input: {
					type    : 'number',
					positive: true,
					min     : 10,
					convert: true
				}
			}

			checkSchema = v.validate ( { input }, schema )
			
			response = {
				isValid : typeof checkSchema === 'boolean' ? checkSchema : false
			}
			break
		case "isKraPin":
			if ( input.length > 0 ) {
				let startsWithLetter = input[0].match(/[a-zA-Z]/i) && input[0].length === 1 || false
				let endsWithLetter   = input[input.length-1].match(/[a-zA-Z]/i) && input[input.length-1].length === 1 || false
				let contains9Digits  = input.replace( /[^0-9]/g,'').length === 9
				let contains2Letters = input.replace( /[^a-z]/gi,'').length === 2

				if ( startsWithLetter && endsWithLetter && contains9Digits && contains2Letters && input.length === 11 ){
					response = {
						isValid :true
					}
				}
				else{
					response = {
						isValid :false
					}
				}
	
				
			}
			else {
				response = {
					isValid :false
				}
			}

			

			break
		case "isIdNumber":

			oldLength= input.length
			newLength = input.replace(/[^0-9]/g,'').length
			
			if ( oldLength === newLength && oldLength >= 6  ) {
				response = {
					isValid :true
				}
			}
			else {
				response = {
					isValid :false
				}
			}
			break;
		case "isPhoneNumber":{

			let check = isValidPhoneNumber (input, 'KE')
 
			response = { 
				isValid : check,
				check
			}
		}break;
		case "isCbAccountNumber":
			
			oldLength= input.length
			newLength = input.replace(/[^0-9]/g,'').length
			
			if ( oldLength === newLength && oldLength > 8 && oldLength < 20 ) {
				response = {
					isValid :true
				}
			}
			else {
				response = {
					isValid :false
				}
			}

			break;
		case "isWithinNumericRange":
			if (userData.input.length >= min && userData.input.length <= max ) {
				response = {
					isValid :true
				}
			}
			else {
				response = {
					isValid :false,
					message : errorMessage
				}
			}
			break;
		case "isNumber":

			oldLength = input.length
			newLength = input.replace(/[^0-9]/g,'').length
			
			if ( oldLength === newLength && oldLength > 0 ) {
				response = {
					isValid :true
				}
			}
			else {
				response = {
					isValid :false
				}
			}

			
			break;
		case "is6Digits":
				
				if ( input.length === 6  ) {
					response = {
						isValid :true
					}
				}
				else {
					response = {
						isValid :false
					}
				}
	
				
				break;
		case "isEmail":
			const re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			let isEmail = re.test(input)
			
				response = {
					isValid: isEmail,
					message : ""
				}
			break;
		case "isAny":
			response = {
				isValid: true
			}
			break;

		case "isNotEmpty":
			if (input.trim() !== "" && min && input.trim().length >= min) {
				response = {
					isValid :true
				}
			}
			else if (input.trim() !== "" && !min) {
				response = {
					isValid :true
				}
			}
			else {
				response = {
					isValid :false,
					message : ""
				}
			}			
			break;
		case "isExcelFile":				
				// if ( input === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ){
				// 	response = {
				// 		isValid :true
				// 	}
				// }
				// else {
				// 	response = {
				// 		isValid:false
				// 	}
				// }
				response = {
					isValid :true
				}
			break;
		default:
			response = {
				isValid :true
			}
			break; 
	}

	return response
}

export default fastValidation