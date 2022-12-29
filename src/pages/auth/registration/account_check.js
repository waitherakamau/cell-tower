import React, { useState } 		from 'react'
import Router 					from 'next/router';
import { toast } 				from 'react-toastify';
import 'twin.macro'

import AuthLayout      		from '@components/layout/reg';
import FormWizard 	   		from '@components/ui/forms/form-wizard';
import Existing   	   		from "@config/forms/auth/existing";
import TransactionsService 	from '@services/api/transactions.service';

const AccountCheck = () => {

	const [ formIsLoading, setFormIsLoading ] 	= useState(false)
	const [ accountData, setAccountData ] 		= useState({})

	const registrationStepSubmit = async (formId, formState, setState, state) => {
		let hasErrors = false

		formState = formState.map ( entry => {
			if ( !entry.textInput || entry.textInput === ""  ) {
				hasErrors      = true
				entry.hasError = true
				entry.message  = `${entry.inputId.split('-')[0]} cannot be empty`
			}

			if ( entry.hasError ){
				hasErrors      = true
				entry.hasError = true
			}

			return entry
		})

		if (hasErrors ){
			setState( formId, formState )
		}else{
			if( state.step === 1 ){
				let params= {
					type: 'account-validation'
				}

				formState.map ( entry => {
					params[entry.inputId] = entry.textInput
				})

				params.phoneNumber = params.phoneNumber.replace(/[^0-9]/g,'')

				setFormIsLoading(true)
				try {
					toast.info(`Performing an account lookup for account: ${params.accountNumber}...`)

					let response = await new TransactionsService().transact(params)
					
					// response = {
					// 	success: true,
					// 	data: {
					// 		details: {
					// 			"Email": "mmoisect@yahoo.com",
					// 			"FirstName": "MAXWELL",
					// 			"AccountProductCode": "6108",
					// 			"CustomerRegistrationDate": "20171116",
					// 			"Gender": "MALE",
					// 			"SecondName": "NYAYO",
					// 			"AccountType": "Faulu Personal Account",
					// 			"IDType": "NATIONAL.ID",
					// 			"AccountNumber": "1009700419",
					// 			"AccountStatus": "",
					// 			"AccountCurrency": "KES",
					// 			"CustomerNumber": "345427",
					// 			"PhoneNumber": "254733771554",
					// 			"LastName": "ANAKALA",
					// 			"DateofBirth": "19810523",
					// 			"BranchCode": "1006",
					// 			"IDNumber": "22349842"
					// 		}
					// 	}					
					// }
					console.log(response)
					//login successful
					if ( response.success && response.data.details ){
						toast.success(`The account lookup was successful`)
						let accDetails = {
							...response.data.details, 
							email: response.data.details.Email.toLowerCase(),
							idNumber: response.data.details.IDNumber,
							accountName: `${response.data.details.FirstName} ${response.data.details.SecondName} ${response.data.details.LastName}`,
							accountNumber: params.accountNumber
						}
						accDetails.accountName = accDetails.accountName.trim().split(' ').filter(e => e && e).join(' ')

						setAccountData(accDetails)

						//update the form state for next form id
						let formToUpdate = 'form-accountDetails'
						let data = state[formToUpdate]

						data = data.map ( entry => {
							entry.textInput = !accDetails[entry.inputId] && entry.inputId !== 'kraPINUpdated' ? 'N/A' : accDetails[entry.inputId]
							return entry
						})

						setFormIsLoading(false)
						setState(formToUpdate, data)
						setState('step', state.step + 1)
					}
					else {
						toast.error(`The account lookup failed. Cannot fetch details for account: ${params.accountNumber}`)
					}
				}	
				catch (e){
					console.log(e)
					toast.error(`We encountered an error while to fetch details for account: ${params.accountNumber}`)
				}
				setFormIsLoading(false)
			}
			else if ( state.step === 2 && !accountData.email ) {
				toast.error(`There is no email linked to your account, kindly contact customer care to amend your details`)
			}
			else {
				setState('step', state.step + 1)
			}
		}
	}
	const registrationSubmit = async (state) => {
		setFormIsLoading(true)
		
		let payload = {
			type				: 'registration',
			firstname			: accountData.FirstName,
			phoneNumber			: accountData.PhoneNumber,
			email				: accountData.email,
			productCode			: accountData.AccountProductCode,
			registrationDate	: accountData.CustomerRegistrationDate,
			gender				: accountData.Gender,
			secondname			: accountData.SecondName,
			accountType			: accountData.AccountType,
			accountStatus		: accountData.AccountStatus,
			currency			: accountData.AccountCurrency,
			customerNumber		: accountData.CustomerNumber,
			idType				: accountData.IDType,
			accountNumber		: accountData.AccountNumber,
			lastname			: accountData.LastName,
			dateofBirth			: accountData.DateofBirth,
			branchCode			: accountData.BranchCode,
			idNumber			: accountData.IDNumber,
			kraPin  			: state['form-accountDetails'].find(e => e.inputId == 'kraPINUpdated').textInput,
			transactionLimit  	: state['form-limitSetting'].find(e => e.inputId == 'perTransactionLimit').textInput.toString(),
			dailyLimit        	: state['form-limitSetting'].find(e => e.inputId == 'dailyLimit').textInput.toString()
		}
		
		toast.info(`Performing registration request for ${payload.firstname}...`)
		
		let response = await new TransactionsService().transact(payload)
		setFormIsLoading(false)
		console.log(response)

		if ( response.success ){
			toast.success(`The Faulu Online Banking registration succeeded for ${payload.firstname}...`)

			Router.push ('/auth/registration/registration-success')
		}else {
			toast.error(`The Faulu Online Banking registration failed for ${payload.firstname}. ${response.message}`)

			Router.push ('/auth/registration/registration-failed')
		}
	}
	
	return (
		<AuthLayout>
			<div tw='w-full h-full px-4 pb-3 bg-smallBgColor lg:(px-24)'>
				<div tw='bg-secondary-100 p-2 rounded-b-lg w-28 mt-8 lg:(w-48 h-24)' >
					<img src='/images/logo.png' tw='w-full h-auto' alt='logo' />
				</div>

				<p tw='mt-7 text-xl tracking-wide font-medium'>
					<span tw='text-primary-100'>
						Great, Let’s keep going |
					</span>
					<span tw='block font-normal lg:(inline-block ml-1)'>
						Before we register you for online banking , we need to verify your account....
					</span>
				</p>
			</div>

			<div tw='px-4 lg:(w-2/3 mx-auto)'>
				<FormWizard 
					config = { Existing }  
					onStepSubmit = { registrationStepSubmit } 
					//showSteptitle
					showCurrentTitle 
					onWizardSubmit = { registrationSubmit }
					formIsLoading ={formIsLoading}
				/>
			</div>
		</AuthLayout>
	)
}

export default AccountCheck