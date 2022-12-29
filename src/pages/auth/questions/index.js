import Router              from 'next/router'
import React from 'react'
// Components
import AuthLayout          from '@components/layout/auth'
import FormWizard          from '@components/ui/forms/form-wizard'
import Questions           from "@config/forms/auth/set-questions"

// Services
import AuthService         from '@services/api/auth.service'
import fetch               from '@services/api/fetch.service'
import urls                from '@services/api/api.paths'
import TransactionsService from '@services/api/transactions.service'
let onBlurActions = new TransactionsService().lookups

// Redux
import { connect  } from 'react-redux'
import { Actions  } from '@services'
import passwordPolicyCheck from '@services/helpers/password-policy'
import { toast } from 'react-toastify'
import 'twin.macro';

class AuthView extends React.Component {
	constructor             ( props ) {
		super ( props )
		this.state = {
			Form: Questions,
			SelectedQuestions : {
				question1:"",
				question2:"",
				question3:""
			},
			QuestionOptions :[]
		}

		// Method Binding	
		this.stepSubmit      = this.stepSubmit.bind(this)
		this.getOtp          = this.getOtp.bind(this)
		this.submit          = this.submit.bind(this)
		this.updateQuestions = this.updateQuestions.bind(this)
	}
	async componentDidMount (){

		let { Form } = this.state

		// get questions from backend and update in form
		let url           = urls['fetch-questions']
		let res           = await fetch('post',url, {} )
		let isSuccessfull = res.success && res.responseData.success

		if (isSuccessfull){

			let questions      = res.responseData.data
			let questionsForm  = Form.find(e => e. stepTitle === 'Security Question')
			let questionInputs = questionsForm.formConfig.sections

			questionInputs     = questionInputs.map (entry => {
				entry.elements[0].optionsList = questions.map ((question, index) => {
					return {
						id   : index + 1,
						name : question.Question
					}
				})
				return entry
			})

			Form[0].formConfig.sections = questionInputs

			await this.setState({
				Form,
				QuestionOptions : questions.map ( ( question, index ) => {
					return {
						id   : index + 1,
						name : question.Question
					}
				})
			})

			
		}


		// txnData
		let { 
			userData : { 
				personalInfo : { 
					name, 
					phone, 
					email,
					birthday
				},
				isFirstSoftTokenLogin,
				securityInfo : { otp }
			}			 
		} = this.props

		if(email === 'user@company.com'){
			Router.push('/')
		}

		let response = await fetch ( 
			'post', 
			urls['fetch-answers'],
			{ username: email }
		)

		// parse response
		let success      = response.success
		let data         = response.responseData
		let gotQstns     = success &&  data.success

		//perform actions based on status
		let passwordHistory = "[]"

		if (gotQstns && data.data.passwordHistory) {
			passwordHistory = data.data.passwordHistory
		}
		
		let  txnData =  { 
			name, 
			phone, 
			email, 
			isFirstSoftTokenLogin, 
			passwordHistory,
			otp 
		}

		await this.setState({ txnData })

	}
	async stepSubmit        ( formId, formState, setState, state ){
		
		let hasErrors = false
		let params    = {}

		let { 
			userData : { 
				personalInfo : { 
					name, 
					email,
					birthday
				}
			}			 
		} = this.props

		formState = await Promise.all( 
			formState.map(async entry => {

				// Verification Check
				if ( state.step !== 3 ) {

					// password Check
					if(entry.inputId === 'Confirm Password' && entry.textInput.trim() !== "" && entry.textInput !== params['New Password'] ){
						hasErrors      = true
						entry.hasError = true
						entry.message  = `Passwords do not match`
					}

					if(entry.inputId === 'Confirm Password' && entry.textInput.trim() !== "" && entry.textInput === params['New Password'] ){
						// hasErrors      = true
						// entry.hasError = true
						// entry.message  = `Passwords do not match`

						// password policy
						let payload = {
							username: this.state.txnData.email,
							password: entry.textInput ,
							passwordHashes:this.state.txnData.passwordHistory
						}

						
						let response = await fetch ( 
							'post', 
							urls['password-can-be-used'],
							payload
						)

						if ( response.responseData.success ) {
							hasErrors      = false
							entry.hasError = false
							entry.message  = ''
						}
						else {
							hasErrors      = true
							entry.hasError = true
							entry.message  = response.responseData.message
						}


						let isValid = await passwordPolicyCheck (entry.textInput, { name, email, birthday })

						if ( isValid.success) {
							hasErrors      = false
							entry.hasError = false
							entry.message  = ''
						}
						else {
							hasErrors = true
							entry.hasError = true
							entry.message = isValid.errors[0]
						}

					}

					// Empty input
					if ( !entry.textInput || entry.textInput.trim() === ""  ) {
						hasErrors      = true
						entry.hasError = true
						entry.message  = `${entry.inputId.split('-')[0]} cannot be empty`
					}

					// add params
					if ( entry.textInput || entry.textInput.trim() !== "" ) {
						params [ `${entry.inputId}`] = entry.textInput
					}


					if ( entry.hasError ){
						hasErrors      = true
						entry.hasError = true
					}

					if ( entry.inputId === 'getOtpBtn' || entry.inputId === "undefined" ){
						hasErrors      = false
						entry.hasError = false
					}
				}			

				return entry
			})
		)

		//validate
		if (hasErrors){
			setState (formId, formState)
		}
		else {
			setState('step', state.step + 1)
		}

	}
	async getOtp           (){
		let { userData : { personalInfo : { email } } } = this.props
		let response = await new AuthService().getOtp({ username: email })

		if (response.success) {

			toast.success(`Your Verification Code has been sent to your phone via sms`)
		}
		else{
			toast.error('OTP Generation failed')
		}
	}
	async submit (state){
		
		let { updateUserData, userData : { personalInfo : { email } } } = this.props

		let response = await new AuthService().questionReset(state, email)

		if (response.success) {

			//feth the profile
			new AuthService().MandatesProfile (email, updateUserData, true)

			// redirect
			Router.push('/profile')
		}
		else{
			toast.error('Question Reset failed')
            Router.push('/')
		}
		

	}
	updateQuestions        ( input ){

		let { 
			Form, 
			SelectedQuestions = {}, 
			QuestionOptions 
		} = this.state
		let allOptions     = QuestionOptions
		let inputId        = input.inputId
		let selectedAnswer = input.input

		// set the question		
		SelectedQuestions[inputId] = selectedAnswer

		//show options list for the questions that arent selected
		let takenQuestions = Object.values ( SelectedQuestions )
		
		let availableOptions = allOptions.filter ( option => {
			if( !takenQuestions.includes(option.name) ) {
				return option
			}
			
		})

		Form[0].formConfig.sections[0].elements[0].optionsList = availableOptions
		Form[0].formConfig.sections[1].elements[0].optionsList = availableOptions
		Form[0].formConfig.sections[2].elements[0].optionsList = availableOptions
			

		this.setState({
			Form,
			SelectedQuestions
		})


	}
	render () {

		let { Form, txnData } = this.state
		let { userData      } = this.props

		return (
			<AuthLayout>


                <span tw = 'px-4 pt-4 text-base'>Hi {userData.personalInfo.name.split(' ')[0]}, your security questions have been reset. Please set <b>new Questions and Answers</b> below</span>

                <div tw = "px-6 pt-5">
                    <FormWizard 
                        config                   = { Form            } 
                        onStepSubmit             = { this.stepSubmit } 
                        generateVerificationOtp  = { this.getOtp     }
                        onWizardSubmit           = { this.submit     }
                        onCancel                 = { () => Router.push('/auth/login') } 
                        txnData                  = { txnData }
                        onBlurActions            = {{
                            ...onBlurActions,
                            'updateQuestions' : this.updateQuestions
                        }}
                    />	
                </div>
				
			</AuthLayout>
		)
	}
}

const mapStateToProps = state => {
	return {
		userData    : state.userData
	}
}
const mapDispatchToProps = dispatch => {
	return {
		updateUserData : params => dispatch ( Actions.updateUserData ( params ) )
	}
}

export default connect ( mapStateToProps, mapDispatchToProps )(  AuthView )