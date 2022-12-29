"use strict"


import uniqid        from 'uniqid';

import urls             from '@services/api/api.paths';
import httpFetch        from './fetch.service';

class AuthService {
	async login (params){

		let requestId = uniqid.process().toUpperCase()
		let response = await httpFetch('post', urls.login, { ...params, requestId })
		
		// set login status
		let success      = response.success
		let data         = response.responseData
		let hasloggedIn  = success &&  data.success
		let failedlogin  = success && !data.success
		let requestError = !success

		//perform actions based on status
		if ( hasloggedIn && requestId === data.requestId ){
			return { success: true, ...data }
		}
		if ( hasloggedIn && requestId !== data.requestId ){
			return { message: "Login Failed. Wrong username or password provided!" }
		}
		if ( failedlogin ){
			return { 
				success       : false, 
				error         : 'auth-error', 
				message       : data.message
			}
		}
		if ( requestError ){
			return { 
				success: false, 
				error: 'request-error', 
				message : `The Login Request timed out. Please try again later.`
			}
		}

	}

	async getOtp (params) {
		
		let response = await httpFetch('post', urls['get-otp'], { direction: 'SMS', ...params })
		
		// set login status
		let success      = response.success
		let data         = response.responseData
		let requestError = !success

		//perform actions based on status
		if ( data.success ){
			return { success: true }
		}
		if ( !data.success ){
			return { 
				success       : false, 
				error         : 'auth-error', 
				message       : data.message
			}
		}
		if ( requestError ){
			return { 
				success: false, 
				error: 'request-error', 
				message : `The resend OTP request timed out. Please try again later.`
			}
		}
	}

	async verifyOtp (params) {
		
		let requestId = uniqid.process().toUpperCase()
		let response = await httpFetch('post', urls['verify-otp'], { ...params, requestId })
		
		// set login status
		let success      = response.success
		let data         = response.responseData
		let hasloggedIn  = success &&  data.success
		let failedlogin  = success && !data.success
		let requestError = !success

		//perform actions based on status
		if ( hasloggedIn && requestId === data.requestId ){
			return { success: true }
		}
		if ( hasloggedIn && requestId !== data.requestId ){
			return { message: "OTP verification failed. Wrong OTP provided!" }
		}
		if ( failedlogin ){
			return { 
				success       : false, 
				error         : 'auth-error', 
				message       : data.message
			}
		}
		if ( requestError ){
			return { 
				success: false, 
				error: 'request-error', 
				message : `The OTP verification request timed out. Please try again later.`
			}
		}
	}
	
	async submitOtp ( formId, formState, setState ){

		let hasErrors = false
		let result    = { success: false }
		

		formState = formState.map ( async entry => {
			if ( entry.inputId === 'otp' && entry.hasError ){
				hasErrors = true
				entry.hasError = true
				entry.message = "Please enter a valid Verification Code"
			}
			if ( entry.inputId === 'otp' && entry.textInput === "" ){
				hasErrors = true
				entry.hasError = true
				entry.message = "Please enter a valid Verification Code"
			}
			if ( entry.inputId === 'otp' && entry.textInput.length !== 6 ){
				hasErrors = true
				entry.hasError = true
				entry.message = "Please enter a valid Verification Code"
			}
			if ( entry.inputId === 'otp' && !entry.hasError && entry.textInput !== "" ){
				hasErrors = false
				entry.hasError = false
				entry.message = ""
				result    = { success: true }
			}

			return entry
		})

		//validate
		if (hasErrors ){
			setState ( formId, formState )
		}

		return result

	}

	async activation (params) {
		
		let requestId = uniqid.process().toUpperCase()
		let response = await httpFetch('post', urls.activation, { ...params, requestId })
		
		// set login status
		let success      = response.success
		let data         = response.responseData
		let hasloggedIn  = success &&  data.success
		let failedlogin  = success && !data.success
		let requestError = !success

		//perform actions based on status
		if ( hasloggedIn && requestId === data.requestId ){
			return { success: true }
		}
		if ( hasloggedIn && requestId !== data.requestId ){
			return { message: "Account Activation failed. Try again later!" }
		}
		if ( failedlogin ){
			return { 
				success       : false, 
				error         : 'auth-error', 
				message       : data.message
			}
		}
		if ( requestError ){
			return { 
				success: false, 
				error: 'request-error', 
				message : `The account activation request timed out. Please try again later.`
			}
		}
	}

	async reset (params) {
		
		//let requestId = uniqid.process().toUpperCase()
		let response = await httpFetch('post', urls['reset-password'], { ...params })
		
		// set login status
		let success      = response.success
		let data         = response.responseData
		let requestError = !success

		//perform actions based on status
		if ( data.success ){
			return { success: true }
		}
		if ( !data.success ){
			return { 
				success       : false, 
				error         : 'auth-error', 
				message       : data.message
			}
		}
		if ( requestError ){
			return { 
				success: false, 
				error: 'request-error', 
				message : `The forgot password request timed out. Please try again later.`
			}
		}
	}
}

export default AuthService