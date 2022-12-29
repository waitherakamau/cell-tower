import React     from 'react'
import Router     from 'next/router'
import Cookies 		   from 'universal-cookie';
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import 'twin.macro';

import AuthLayout from '@components/layout/auth'
import FormWizard from '@components/ui/forms/form-wizard'
import Reset      from "@config/forms/auth/reset"
import AuthService from '@services/api/auth.service'
import fetch       from '@services/api/fetch.service'
import urls        from '@services/api/api.paths'
import { Actions } from '@services'


let cookies = new Cookies();

class AuthView extends React.Component {
	constructor     ( props ) {
		super ( props )
		this.state = {
			form: Reset,
			username: '',
			passwordHistory: "[]"
		}

		// Method Binding
		this.stepCheck = this.stepCheck.bind ( this )
		this.getOtp    = this.getOtp.bind    ( this )
		this.submit    = this.submit.bind    ( this )
	}
	async stepCheck ( formId, formState, setFormState, state ){ 

		let Q        = this.state.currentQstn || false
		let A        = this.state.answers || false
		let { 
			form, 
			username, 
			passwordHistory 
		} = this.state	
		let { 
			userData : { 
				personalInfo : { 
					name, 
					email,
					birthday
				},
				sessionToken
			},
			updateUserData		 
		} = this.props
		let txData = {
			name, 
			email,
			birthday
		}

		let otp      = formState.find( e => e.inputId === "otp" ) ? formState.find( e => e.inputId === "otp" ).textInput : false
		let response = await new AuthService().resetStepCheck ( 
			formId, 
			formState, 
			setFormState, 
			state, 
			Q, 
			A, 
			otp,
			passwordHistory,
			username,
			txData
		)

		await this.setState({ otp })

		//update the redux state in order to have the users data

		// Account Check
		if ( state.step === 1 && response.success ) {
			
			await updateUserData({ sessionToken: response.token })

			if ( response.data.passwordHistory ) {
				passwordHistory = response.data.passwordHistory
			}

			await this.setState({
				username: response.username,
				passwordHistory
			})

			//check if the users questions have been blocked
			if (response.data.questionsBlocked) {
				
                toast.error('Password reset is blocked because security questions were answered incorrectly. Please contact customer support for futher assistance')

				Router.push('/')
			}

			// check if the users questions are to be Reset
			else if( response.data.answerReset ){
				cookies.set('jwt_token', response.token, { path: '/', maxAge: 60 * 30 });
				await new AuthService().MandatesProfile(response.username, updateUserData)
				Router.push('/auth/questions')
			}

			// Questions are okay
			else{
				let user    = formState.find( e => e.inputId === 'User ID')
				let answers =  {}	

				response.data.questions.map ( q => {
	
					let answer   = response.data.answers[ `Answer`+q.Reference.replace("Q0","")]
					let question = response.data.answers[ `question`+q.Reference.replace("Q0","")]
					
					if ( answer ) {
						answers[ q.Reference ]  = {
							question,
							answer,
							failed  : false	
						}
					}
				})

				/*
				{
					"responseData": {
						"success": true,
						"data": {
							"answers": {
								"question1": "What is your mother's maiden name?",
								"Answer1": "kagure",
								"question2": "What was the name of your primary school?",
								"Answer2": "kilimani",
								"question3": "What is your Father's Sir Name?",
								"Answer3": "mbuguah"
							},
							"questions": [
								{
									"Reference": "Q01",
									"Question": "What is your mother's maiden name?"
								},
								{
									"Reference": "Q02",
									"Question": "What was the name of your primary school?"
								},
								{
									"Reference": "Q03",
									"Question": "What is your Father's Sir Name?"
								},
								{
									"Reference": "Q04",
									"Question": "What was the name of your High School?"
								},
								{
									"Reference": "Q05",
									"Question": "What was your childhood nickname?"
								}
							],
							"answerReset": false,
							"questionsBlocked": false,
							"passwordHistory": "[\"$2b$10$HbpzoL4PLpGq7UhfwgGKX.8lQzV1xNLaorEl00N8odr6vFsBahPju\"]"
						}
					}
				}
				*/
	
	
				form[1].formConfig.sections[0].groupTitle = answers['Q01'].question
	
				await this.setState({
					answers,
					form,
					currentQstn: "Q01",
					username : user.textInput
				})
	
				//update the form to reflect the question
				Reset[1].formConfig.sections[0].groupTitle = answers ['Q01'].question
			}
		}
		if ( state.step === 1 && !response.success ) {
			
			toast.error('We were unable to verify the accounts security status. Please contact customer support for futher assistance')
		}

		// Question Cycling
		if ( state.step === 2 && !response.success ) {

			//mark failed question as failed
			A [ Q ].failed = true

			// get the next questions
			let nextQuestion = false
			let nextQuestiontext = false

			let keys = Object.keys ( A ) 
			for ( let key of keys ) {
				let isFailed = A [ key ].failed
				if ( !isFailed ) {
					nextQuestion = key
					nextQuestiontext = A [ key ].question
					break
				}
			}

			// un answered question exists
			if ( nextQuestion ) {
				form[1].formConfig.sections[0].groupTitle = nextQuestiontext
				this.setState({
					answers: A,
					form,
					currentQstn: nextQuestion
				})
			}
			// if all questions have been failed
			else {
                toast.error('Security questions were answered incorrectly. Please contact customer support for futher assistance')	

				// update the database that the user failed his questions
				let url           = urls['block-questions']
				let res           = await fetch ('post', url, { username } )
				let isSuccessfull = res.success && res.responseData.success
				
				if (isSuccessfull) {
					Router.push('/')
				} 
			}

		}else if(state.step === 2 && response.success){

            cookies.set('jwt_token', sessionToken, { path: '/', maxAge: 60 * 30 });
			await new AuthService().MandatesProfile(username, updateUserData)
		}

		if ( state.step === 3 && response.success ) {
			this.setState({
				password:response.password
			})
		}


	}
	async getOtp    () {

		let { username } = this.state

		let response = await new AuthService().getOtp ({ username })

		if ( response.success ) {

			toast.success(`Your Verification Code has been sent to your phone via sms`)
		}
		else{
			toast.error('OTP Generation failed')
		}
		
	}
	async submit    () {

		let { username, password, otp } = this.state

		let { updateUserData } = this.props

		let response = await new AuthService().reset({ username, password, otp })

		if ( response.success ) {

			//feth the profile
			await new AuthService().MandatesProfile( username, updateUserData)

			toast.success('Password Reset was successful')
			
			Router.push ('/')

		}
		else{
			toast.error(response.message)

			Router.push ('/')
		}
		

	}
	render () {

		let { form } = this.state

		return (
			<AuthLayout 
				formTitle = { "Password Reset" } 
				formWidth = { 55 } 
				image     = "c" 
				message   = "the next level"
			>
				<div tw = "px-8 pt-12">
					<FormWizard 
						config                   = { form } 
						onStepSubmit             = { this.stepCheck} 
						onWizardSubmit           = { this.submit }
						generateVerificationOtp  = { this.getOtp }
						onCancel                 = { () => Router.push ( '/auth/login') } 
					/>
				</div>
			</AuthLayout>
		)
	}
}

const mapStateToProps    = state    => {
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