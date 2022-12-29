import React, { useEffect, useState } 	from 'react'
import { toast } 						from 'react-toastify';
import Router, { withRouter } 			from 'next/router';
import { connect } 						from 'react-redux';
import queryString 						from "query-string"
import Cookies 		   					from 'universal-cookie';
import 'twin.macro'

import { Actions } 			from '@services';
import AuthLayout    		from '@components/layout/reg';
import FormWizard 	   		from '@components/ui/forms/form-wizard';
import ActivationForm   	from "@config/forms/auth/activation";
import TransactionsService 	from '@services/api/transactions.service';
import AuthService 			from '@services/api/auth.service';
import PasswordPolicyCheck 	from '@services/helpers/password-policy';


const onBlurActions = new TransactionsService().lookups;
const cookies 		= new Cookies();

const AccountActivation = ({ router, updateUserData, userData: { sessionId } }) => {
	const [ { customerName, customerEmail, PasswordPolicy, PhoneNumber }, setCustomerData ] 	= useState({ customerName: '' });
	const [ showLoading, setShowLoading ] 					   	= useState(true)
	const [ accForm, setAccForm ] 					           	= useState(ActivationForm)
	const [ selectedQuestions, setSelectedQuestions ] 			= useState({})
	const [ questionOptions, setQuestionOptions ] 				= useState([])


	useEffect(() => {
		verifyAccountToken()
	
	  	return () => {}
	}, [])
	

	const verifyAccountToken = async () => {

		try {
			
			router.query = queryString.parse(router.asPath.split(/\?/)[1]);


			// let currentUrl = window.location.href.split('?')[0]; 
			// window.history.replaceState({}, '', currentUrl );
			

			let params = {
				type: 'verify-activation-token',
				token: router.query?.token
			}

			let response = await new TransactionsService().transact(params);

			if ( response.success && response?.data?.details ) {
                let verifyData = response.data.details

				// cookies.set('jwt_token', verifyData.token, { path: '/', maxAge: 60 * 60, secure: true });
				await updateUserData({ sessionId: 'temporarySessionToken' })

				setCustomerData({ 
					customerEmail: verifyData.Username, 
					customerName : verifyData.CustomerName, 
					...verifyData 
				})

				// get questions and update in form
				let questions      = verifyData.SecurityQuestions
				let questionsForm  = accForm.find(e => e.stepName === 'Security Question')
				let questionInputs = questionsForm.formConfig.sections

				questionInputs     = questionInputs.map(entry => {
					entry.elements[0].optionsList = questions.map ((question, index) => {
						return {
							id   : index + 1,
							name : question.Question
						}
					})
					return entry
				})

				accForm[0].formConfig.sections = questionInputs

				let qOptions = questions.map ((question, index) => {
					return {
						id   : index + 1,
						name : question.Question
					}
				})

				setAccForm(accForm)
				setQuestionOptions(qOptions)
			}else{
				toast.error('Activation profile fetch failed');
			}

			setShowLoading(false)
		}
		catch ( e ){
			console.log(e)
			setShowLoading(false)
			toast.error('We encountered an error. Please try again later');
		}
	}
	const stepSubmit = async (formId, formState, setState, state) => {
		let hasErrors = false
		let stepData = {}

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
			stepData[entry.inputId] = entry.textInput

			return entry
		})
		console.log(hasErrors, formState, stepData)

		if (hasErrors ){
			setState( formId, formState )
		}else{
			if( state.step === 2 ){
				let passIsWeak = false
				//password policy check
				if(stepData.confirmPassword !== stepData.password ){
					formState = formState.map ( entry => {
						if(entry.inputId === 'confirmPassword'){
							entry = {
								...entry,
								hasError: true,
								message: 'Passwords do not match'
							}
						}
						return entry
					})
					passIsWeak = true
				}else{
					//run password policy on confirm password
					let isValidPassword = PasswordPolicyCheck({ 
						input		: stepData.confirmPassword,
						name		: customerName, 
						email		: customerEmail, 
						userid		: customerEmail,  
						passPolicy	: PasswordPolicy
					})

					console.log('>>>>>>>>>>>>><<<<<<<<<<<<<<PASSWORDPOLICY', isValidPassword)
					if(!isValidPassword.success){
						formState = formState.map ( entry => {
							if(entry.inputId === 'confirmPassword'){
								entry = {
									...entry,
									hasError: true,
									message: `Password is weak. ${isValidPassword.message}`
								}
							}
							return entry
						})
						passIsWeak = true
					}
				}
				if(passIsWeak){
					setState(formId, formState)
				}else{
					setState('step', state.step + 1)
				}
			}else{
				setState('step', state.step + 1)
			}
			// if ( state.step === 3 &&  entry.inputId === 'otp' && entry.hasError ) {
			// 	hasErrors      = true
			// 	entry.hasError = true
			// 	entry.message  = `The OTP entered is incorrect`
			// }
		}
	}
	const submit = async (state) => {
		console.log(state)

		let answers = {}
		let password = state['form-passwordSetup'].find(e => e.inputId === "confirmPassword").textInput
		state['form-securityQuestions'].forEach( e => answers[e.inputId] = e.textInput)

		let payload = {
			type			: 'account-activation',
			username		: customerEmail,
			phoneNumber		: PhoneNumber,
			password		,
			securityAnswers	: answers,
			meta			: {
				sessionId
			}
		}

		let response = await new TransactionsService().transact(payload);

		if(response.success){
			toast.success(`Account Activation was successful`)
			Router.push('/auth/login');
		}else{
			toast.error(`Account Activation failed. ${response.message}`)
		}
	}
	const getOtp = async () => {
		toast.info('Please wait while we generate the verification code for SMS');

		let response = await new AuthService().getOtp({ 
			direction 	: 'SMS',
			username	: customerEmail, 
			customerName, 
			phoneNumber	: PhoneNumber,
			meta		: {
				sessionId
			}
		})

		if (response.success) {
			toast.success('Your Verification Code has been sent to your phone via sms');
		}else{
			toast.error('OTP Generation failed');
		}
	}
	const updateQuestions = ({ inputId, input }) => {
		let allOptions     = questionOptions

		// set the question		
		selectedQuestions[inputId] = input

		//show options list for the questions that arent selected
		let takenQuestions = Object.values ( selectedQuestions )
		
		let availableOptions = allOptions.filter ( option => {
			if( !takenQuestions.includes(option.name) ) {
				return option
			}
		})

		accForm[0].formConfig.sections[0].elements[0].optionsList = availableOptions
		accForm[0].formConfig.sections[1].elements[0].optionsList = availableOptions
		accForm[0].formConfig.sections[2].elements[0].optionsList = availableOptions
			
		setAccForm(accForm)
		setSelectedQuestions(selectedQuestions)
	}

	return (
		<AuthLayout>
			<div tw='w-full h-full px-4 pb-3 bg-smallBgColor lg:(px-24)'>
				<div tw='bg-secondary-100 p-2 rounded-b-lg w-28 mt-8 lg:(w-48 h-24)' >
					<img src='/images/logo.png' tw='w-full h-auto' alt='logo' />
				</div>

				<p tw='mt-7 text-xl tracking-wide font-medium'>
					<span tw='text-primary-100'>
						Hello {customerName || 'customer'} |
					</span>
					<span tw='block font-normal lg:(inline-block ml-1)'>
						We’re so glad you’re ready to join. Let’s start by Creating your Profile
					</span>
				</p>
			</div>

			{
				customerName && (
					<div tw='px-4 lg:(w-2/3 mx-auto)'>
						<FormWizard 
							config 			= { accForm }  
							onStepSubmit 	= { stepSubmit }
							generateVerificationOtp  = { getOtp }
							onWizardSubmit 	= { submit }
							txnData 		= {{ 
								email		: customerEmail, 
								sessionId	 
							}}
							onBlurActions   = {{
								validateOtp			: onBlurActions.validateOtp,
								'updateQuestions' 	: updateQuestions
							}}
						/>
					</div>
				)
			}
			{
				!customerName && (
					<>
						<div tw='p-4'>
							<span tw='text-base font-normal'>Verifying your Activation Code...</span>

							{ !showLoading && <p>Invalid activation key</p>	}
							{ showLoading && <p tw='mt-4'>Loading... </p>	}
						</div>
					</>
				)
			}
		</AuthLayout>
	)
}

const mapStateToProps = state => {
	return {
		userData    : state.userData
	}
}
const mapDispatchToProps = dispatch => {
	return {
		updateUserData : params => dispatch(Actions.updateUserData(params ))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)( withRouter(AccountActivation) )