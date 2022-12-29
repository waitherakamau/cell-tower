"use strict"

import Router 			  from 'next/router';

import httpFetch  		  from '@services/api/fetch.service';
import AuthService 		  from '@services/api/auth.service'
import TransactionMapper  from '@services/api/transactions.mapper';
import NotificationMapper from '@services/api/transactions.notifications.mapper';
import urls  			  from '@services/api/api.paths';

class TransactionService {
	constructor(){
		this.lookups = {
			coreAccountLookup      : ( data ) => this.lookup ( 'internal-account-lookup',		data ),
			validateOtp				: (data) => this.lookup('validate-otp', data),
			buyAirtimeOther        	: (data) => this.lookup('buy-airtime-other', data),
			// presentments
			kplcPresentment        : ( data ) => this.lookup ( 'kplc-post-paid-bill-presentment', data ),
			kplcPrePaidPresentment : ( data ) => this.lookup ( 'kplc-pre-paid-bill-presentment', data ),
			nairobiWaterPresentment: ( data ) => this.lookup ( 'nairobi-water-bill-presentment', data ),
			dstvPresentment        : ( data ) => this.lookup ( 'dstv-bill-presentment',      	  data ),
			gotvPresentment        : ( data ) => this.lookup ( 'gotv-bill-presentment',      	  data ),
			itaxPresentment        : ( data ) => this.lookup ( 'itax-bill-presentment',      	  data ),
			landratesPresentment   : ( data ) => this.lookup ( 'landrates-bill-presentment', 	  data ),//data: account,amount: field4
			nhifIPresentment       : ( data ) => this.lookup ( 'nhif-i-bill-presentment',    	  data ),
			nhifCPresentment       : ( data ) => this.lookup ( 'nhif-c-bill-presentment',    	  data ),
		}
	}

	async lookup (txnType, formData) {
		let { 
			input, 
			formId, 
			formState, 
			setFormState,
			email,
			phone,
			customerName,
			payload = {},
			lookupData,
			sessionId = ''
		} = formData;
		let externalFetch = {}
		let account;

		switch (txnType) {
			case 'internal-account-lookup': 
				formState.map( e=>{
					if ( e.inputId === "account"){
						account = e.textInput.toString().trim().replace(/[^0-9]/g,'')
					}
				})
				payload = {
					type: txnType,
					phone,
					account,
					meta: {
						sessionId
					}
				}

				setFormState ( formId, [
					...formState.map ( entry => {
						if ( entry.inputId === "account" ) {
							entry = {
								...entry,
								hasError: false,
								message: `Fetching details for customer account`
							}
						}
						
						return entry
					})
				])

				externalFetch = await this.transact(payload)

				if(externalFetch.success && externalFetch.data ){

					let customerData = externalFetch.data.details
					
					// lookupData['receiverCustNo'] = `${customerData.customerNumber}`
					// lookupData['lookupSuccess'] = `${customerData.transSuccess}`

					setFormState ( formId, [
						...formState.map ( entry => {
							if ( entry.inputId === "account" ) {
								entry = {
									...entry,
									hasError: false,
									message: ``
								}
							}
							if ( entry.inputId === "receiverName" ) {
								entry = {
									...entry,
									hasError: false,
									textInput: `${customerData.FirstName}`
								}
							}
							if ( entry.inputId === "receiverNumber" ) {
								entry = {
									...entry,
									hasError: false,
									textInput: `${customerData.PhoneNumber}`
								}
							}
							
							return entry
						})
					])
				}else{
					// lookupData['receiverCustNo'] = ''
					// lookupData['lookupSuccess'] = ''
					// lookupData['errorLookup'] = externalFetch.message

					setFormState ( formId, [
						...formState.map ( entry => {
							if ( entry.inputId === "account" ) {
								entry = {
									...entry,
									hasError: true,
									message: `${externalFetch.message}`
								}
							}
							
							return entry
						})
					])
				}

			
			break;
			case "buy-airtime-other" 			  : {

				if(input === 'OWN'){

					setFormState ( formId, [
						...formState.map ( entry => {
							if ( entry.inputId === "creditAccount" ) {
								entry = {
									...entry,
									hasError: false,
									textInput: phone,
									message: ``
								}
							}

							if ( entry.inputId === "receiverName" ) {
								entry = {
									...entry,
									hasError: false,
									textInput: customerName,
									message: ``
								}
							}
							
							return entry
						})
					])
				}else{
					
					setFormState ( formId, [
						...formState.map ( entry => {
							if ( entry.inputId === "creditAccount" ) {
								entry = {
									...entry,
									hasError: false,
									textInput: '',
									message: ``
								}
							}

							if ( entry.inputId === "receiverName" ) {
								entry = {
									...entry,
									hasError: false,
									textInput: '',
									message: ``
								}
							}
							
							return entry
						})
					])
				}
			}break
			case 'validate-otp': {
				//get the otp
				let otp = ''
				formState = formState.map ( e => {
					if ( e.inputId === 'otp' ) {
						otp = e.textInput
						e.hasError = true
						e.message  = `Verifying otp...`
					}
					return e
				})

				setFormState( formId, formState )

				//verify the otp
				let response = await new AuthService().verifyOtp({ 
					direction	: 'SMS',
					username	: email, 
					otp			, 
					meta		: {
						sessionId
					}
				})

				if(response.success){
					formState = formState.map ( entry => {
						if ( entry.inputId === 'otp' ) {
							entry.hasError  = false
							entry.message   = `OTP is correct`
						}
						return entry
					})
				}else{
					formState = formState.map ( entry => {
						if ( entry.inputId === 'otp' ) {
							entry.hasError  = true
							entry.message   = response.message
						}
						return entry
					})
				}
				setFormState( formId, formState )
			}break;
			case "kplc-post-paid-bill-presentment":
			case "kplc-pre-paid-bill-presentment":
			case "nairobi-water-bill-presentment" :
			case 'dstv-bill-presentment'          :
			case 'gotv-bill-presentment'          :
			case 'itax-bill-presentment'          :
			case 'landrates-bill-presentment'     :
			case 'nhif-i-bill-presentment'        :
			case 'nhif-c-bill-presentment'        :

				payload = {
					type   : txnType,
					phone,
					account: input.replace(/[^0-9]/g,''),
					meta: {
						sessionId
					}
				}

				if ( txnType === 'nhif-i-bill-presentment' ){

					formState.map ( entry => {
						if ( entry.inputId === "paymentType" ) {
							payload.paymentType = entry.textInput === 'Penalty' ? '0' : "1"
						}
						if ( entry.inputId === "amount" ) {
							payload.amount = entry.textInput
						}
						if ( entry.inputId === "account" ) {
							payload.account = entry.textInput.replace(/[^0-9]/g,'')
						}
					})

					payload.type = 'nhif-bill-presentment'
					payload.nhifMemberType = false.toString()

				}
				if ( txnType === 'nhif-c-bill-presentment' ){
					formState.map ( entry => {
						if ( entry.inputId === "paymentType" ) {
							payload.paymentType = entry.textInput === 'Penalty' ? '0' : "1"
						}
						if ( entry.inputId === "amount" ) {
							payload.amount = entry.textInput
						}
						if ( entry.inputId === "account" ) {
							payload.account = entry.textInput.replace(/[^0-9]/g,'')
						}
					})

					payload.type = 'nhif-bill-presentment'
					payload.nhifMemberType = true.toString()
					
				}

				setFormState ( formId, [
					...formState.map ( entry => {
						if ( entry.inputId === "account" ) {
							entry = {
								...entry,
								hasError: false,
								message: `Fetching bill for account ${input} ...`
							}
						}
						if ( entry.inputId === "eslip" ) {
							entry = {
								...entry,
								hasError: false,
								message: `Fetching Details for E-Slip ${input} ...`
							}
						}
						
						return entry
					})
				])	

				externalFetch = await this.transact( payload )

				if ( externalFetch.success ) {
					
					switch ( txnType ){

						case 'kplc-post-paid-bill-presentment':
						case 'kplc-pre-paid-bill-presentment':
						case 'nairobi-water-bill-presentment' :
						case 'gotv-bill-presentment'          :
						case 'dstv-bill-presentment'          :
						case 'landrates-bill-presentment'     :
						case 'nhif-i-bill-presentment'        :
						case 'nhif-c-bill-presentment'        :

							// lookupData['presentmentReference'] = `${externalFetch.data.presentmentRef}`
							
							setFormState ( formId, [
								...formState.map ( entry => {
									if ( entry.inputId === "account" ) {
										entry = {
											...entry,
											hasError: false,
											message: ``
										}
									}
									if ( entry.inputId === "amount" && parseInt(externalFetch.data.presentmentAmt, 10) > 1) {
										entry = {
											...entry,
											hasError: false,
											textInput: parseInt(externalFetch.data.presentmentAmt, 10).toString()
										}
									}
									if ( entry.inputId === "amount" && parseInt(externalFetch.data.presentmentAmt, 10) < 1) {
										entry = {
											...entry,
											hasError: true,
											message: `You do not have an outstanding bill. Bill amount: ${externalFetch.data.presentmentAmt}`,
											textInput: ''
										}
									}
									if ( entry.inputId === "accountName" ) {
										entry = {
											...entry,
											hasError: false,
											textInput: externalFetch.data.presentmentAccName
										}
									}
									
									return entry
								})
							])	


							break
						}
				}
				else {
					setFormState ( formId, [
						...formState.map ( entry => {
							if ( entry.inputId === "account" ) {
								entry = {
									...entry,
									hasError: true,
									message: `Cannot fetch the Bill for Account: ${payload.account}. ${externalFetch.message}`
								}
							}
							if ( entry.inputId === "eslip" ) {
								entry = {
									...entry,
									hasError: true,
									message: `Cannot fetch details for E-Slip ${input} ...`
								}
							}
							
							return entry
						})
					])					
				}
				break;
			default:
				break;
		}
	}

	async getCharges ( formId, formState, setState, setLoadingState, txnData, doNotFetchCharges ){

		let message      = ` `
		let messageData  = {}
		let success      = false
		let data         = false
		let validateForm = await this.validateForm(formId, formState, setState, txnData)

		txnData = { ...txnData, ...validateForm.data, leg: 'charges' }
		
		console.log({formState, txnData, validateForm})

		if (validateForm.success) {
			let getCharges = {}
			
			if(!doNotFetchCharges){
				setLoadingState(true)
				getCharges = await this.transact(txnData)
				setLoadingState(false)
			}
			
			// esb success
			if (getCharges.success && getCharges.data){
				success = true

				let notificationMessage = this.getConfirmationMessage ( { ...txnData, ...getCharges.data } ) 
				let messageSnippet = notificationMessage ? notificationMessage : `Hey ${txnData.firstName}<br/> You are about to perform a ${txnData.type.replace(/-/g,' ')} request. <br/><br/>
				<div style="font-size: 0.75rem;">
					<b>Charge:</b> KES ${getCharges.data.chargeAmount} &nbsp;&nbsp;|&nbsp;&nbsp; <b>Tax: </b>KES ${getCharges.data.exciseDutyAmount}
				</div>`

				messageData['txnType'] = `Confirm ${txnData.type.replace(/-/g,' ').trim()} Transaction`
				messageData['notificationMessage'] = `${messageSnippet}.`
				messageData['chargeAmount'] = getCharges.data.chargeAmount
				messageData['exciseDutyAmount'] = getCharges.data.exciseDutyAmount

				data   = { ...txnData, ...getCharges.data }
			}else {

				let messageSnippet = `Hey ${txnData.firstName}<br/> You are about to perform a ${txnData.type.replace(/-/g,' ')} request. <br/><br/>
				<div style="font-size: 0.75rem;">
					<b>Charge:</b> KES 0.00 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Tax: </b>KES 0.00
				</div>`

				messageData['txnType'] = `Confirm ${txnData.type.replace(/-/g,' ').trim()} Transaction`
				messageData['notificationMessage'] = `${messageSnippet}`
				messageData['chargeAmount'] = "0.00"
				messageData['exciseDutyAmount'] = "0.00"
				
				success = true
				data   = { ...txnData }
			}
		}else {

			data = txnData
		}

		return { success, message, data, messageData }
	}
	
	async transact  ( payload ) { 

		let formattedPayload  = await this.formatPayload ( payload )
		
		// add metaData to the payload
		if(payload.meta){
			formattedPayload  = { 
				...formattedPayload, 
				meta: { ...payload.meta }
			}
		}

		let response = {}
		let success, data, transacted, failed, requestError;

		response = await httpFetch('post', urls['transactions'], formattedPayload)

		data         = response.responseData;
		success      = response.success;
		transacted   = success && data && data.success;
		failed       = success && data && !data.success;
		requestError = !success;

	
		//perform actions based on status
		if (transacted){

			return {
				success: data.success,
				data   : data.data,
				message: data.message
			}
		}
		if ( failed ){

			return { 
				success: false,
				data   : data.data,
				message : data && data.message ? data.message : 'auth-error'
			}
		}
		if ( requestError ){

			return { 
				success: false, 
				message : data && data.message ? data.message : 'request-error'
			}
		}
	}

    async validateForm     (formId, formState, setState, txnData){

		let hasErrors = false
		let params    = {}
		let status    = { success : false, data: {} }
		let eneoAccType = formState.find ( entry => entry.inputId === 'paymentOption') || false

		//Validate that there are no empty values
		formState = formState.map ( entry => {

			// default validation
			let canBeEmpty = [ "beneficiaryType", "supportingDocs" ]
			if (!entry.textInput && !canBeEmpty.includes(entry.inputId) && !entry.optional) {
				hasErrors      = true
				entry.hasError = true
				entry.message  = `${entry.inputId.replace(/-/g, ' ')} cannot be empty`
			}
            if(!entry.textInput && canBeEmpty.includes(entry.inputId) || entry.optional){
				entry.hasError = false
				entry.message  = ``	
            }

			if ( eneoAccType && eneoAccType.textInput === 'POSTPAID' && entry.inputId === 'eneoAccountType' && !entry.textInput) {
				//if post paid validate account type
				entry.hasError = true
				entry.message  = `${entry.inputId.replace(/-/g, ' ')} cannot be empty`
			}
			if ( entry.inputId === 'supportingDocs' && txnData && txnData.uploadDocs && entry.textInput && entry.textInput.length < 1) {
				hasErrors      = true
				entry.hasError = true
				entry.message  = `please attach a document`			
			}
			if ( entry.inputId === 'supportingDocs' && txnData && txnData.uploadDocs && !entry.textInput ) {
				hasErrors      = true
				entry.hasError = true
				entry.message  = `please attach a document`	
			}

			if (entry.hasError){
				hasErrors      = true
				entry.hasError = true
			}
			params [ entry.inputId ] = entry.textInput
			return entry
		})
		
		status.data = params

		// set form errors
		if (hasErrors){
			await setState(formId, formState)
		}
		else {
			status.success = true
			status.data    = params
		}

		return status
	}
	sendAuditTrail(username, module, account, activity){
		let auditParams = {
			username 	,
			page 		: Router.pathname,
			module 		,
			activity	,
			customerId	: '',
			account 	
		}
		
		httpFetch('post', urls['audit-trail'], auditParams);
	}
	async formatPayload ( data ){
		let mapped = await TransactionMapper ( data )
		return mapped
	}
	getConfirmationMessage ( data ) {
		let mapped = NotificationMapper ( data )
		return mapped	
	}
}

let service = new TransactionService

let validateForm 	= service.validateForm
let transact 		= service.transact
let getCharges 		= service.getCharges
let lookups         = service.lookups

export { validateForm, transact, getCharges, lookups }

export default TransactionService