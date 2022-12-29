import React, { useRef, useState } from 'react';
import Router 		   from 'next/router';
import ReCAPTCHA 	   from "react-google-recaptcha";
import { toast } 	   from 'react-toastify';
import Cookies 		   from 'universal-cookie';
import { connect }     from 'react-redux';
import styled 		   from 'styled-components';
import tw 			   from 'twin.macro';

import { Actions }     from '@services';
import AuthService     from '@services/api/auth.service';
import AuthLayout      from '@components/layout/auth';
import Form            from '@components/ui/forms/dynamic-form';
import Login           from '@config/forms/auth/login';
import Otp             from '@config/forms/auth/otp';

const cookies = new Cookies();

const LoginPage = (props) => {
	const { userData : { username, personalInfo: { firstName, phoneNumber }, sessionId }, updateUserData } = props;

	const [ view, setView ] = useState('login');
	const [ isFirstSoftTokenLogin, setIsFirstSoftTokenLogin ] = useState(true);
	const recaptchaRef = useRef();
	const otpRecaptchaRef = useRef();


	const getOtp = async () => {
		toast.info('Please wait while we generate the verification code for SMS');

		let response = await new AuthService().getOtp({ 
			direction 	: 'SMS',
			username	, 
			customerName: firstName, 
			phoneNumber	: phoneNumber,
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
	const submit = async ( formId, formState, setFormState, setLoading ) => {
		let hasErrors = false

		//Validate that there are no empty values
		formState = formState.map ( entry => {
			if ( !entry.textInput ) {
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

		// set form errors
		if ( hasErrors ){
			setFormState ( formId, formState )
		}else{
			setLoading(true)
			//const reToken = await recaptchaRef.current.executeAsync();
			//const reToken = recaptchaRef.current.getValue(); // used for normal reCaptcha

			let params = {
				recaptchaToken: 'recaptcha-token'
			}

			formState.map ( entry => {
				params[entry.inputId] = entry.textInput
			})
			
			let response = {}
			response = await new AuthService().login(params)
			setLoading(false)

			if (response.success) {

				cookies.set('jwt_token', response.token, { path: '/', maxAge: 60 * 60, secure: true });
	
				console.log(response.data)
				let custData = {
					...response.data
				}
				delete custData.details
				delete custData.transDescription
				delete custData.transSuccess
				delete custData.transactionCode
				//update otpLoggedIn 
				await updateUserData({ 
					otpLoggedIn		: true, 
					...custData 	,
					sessionToken	: response.token
				})
	
				//reset questions check
				if(response.data?.accountInfo?.resetQuestions){
					Router.push('/auth/questions')
				}else{
					setView('otp')
				}
			}else {

				cookies.remove('jwt_token');
	
				formState = formState.map ( entry => {
					if ( entry.inputId === "password" ) { 
						entry.message  = response.message 
						entry.hasError = true
					}
					return entry
				})
				
				setFormState (formId, formState)

				toast.error(`Login failed. ${response.message}`)
			}
			
		}
		
		//recaptchaRef.current.reset();
	}

	const otpVerification = async ( formId, formState, setFormState, setLoading ) => {
		let hasErrors = false

		//Validate that there are no empty values
		formState = formState.map ( entry => {
			if ( !entry.textInput ) {
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

		// set form errors
		if ( hasErrors ){
			setFormState ( formId, formState )
		}else{

			setLoading(true)
			//const reToken = await otpRecaptchaRef.current.executeAsync();
			//const reToken = otpRecaptchaRef.current.getValue(); // used for normal reCaptcha
			let params = {
				recaptchaToken	: 'recaptcha-token',
				direction		: 'SMS',
				username		, 
				meta			: {
					sessionId
				}
			}

			formState.forEach ( entry => {
				params[entry.inputId] = entry.textInput
			})

			let response = await new AuthService().verifyOtp(params)
			setLoading(false)

			if (response.success) {
				updateUserData({ otpLoggedIn: false, loggedIn: true })
				
				Router.push('/main/dashboard')
			}else{
				toast.error('Verification failed')
			}
		}
		
		// otpRecaptchaRef.current.reset();
	}

	return (
		<AuthLayout>
			<div tw='w-full h-full bg-transparent px-4 lg:(w-520 ml-24 px-0)'>
				<Container hasborder={view === 'otp'} tw='bg-primary-200 rounded-t-lg mt-6 px-6 text-gray-100'>
					{
						view === 'login' && (
							<>
								<p tw='m-0 tracking-wide pt-6'>
									<span tw='font-normal text-2xl leading-6'>
										Welcome to
									</span>
									<span tw='block font-bold text-3xl mt-4'>
										Faulu Bank
									</span>
									<span tw='block font-bold text-3xl'>
										Online Banking
									</span>
								</p>

								<div tw='mt-2'>
									<Form 
										config = { Login } 
										callback = { submit } 
										buttonmakefull
										mainSecondary
										primarylg
									/>

									<div tw = "pt-1">
										<ReCAPTCHA
											ref={recaptchaRef}
											size="invisible" //normal or invisible
											sitekey={process.env.SITE_KEY}
											//onChange={onChange}
										/>
									</div>

									<div tw='w-full flex items-center justify-between text-sm tracking-wide mt-6 pb-4'>
										<a target = '_blank' href='https://www.faulukenya.com/privacy-policy/' rel="noopener noreferrer" >Security Tips</a>
										<span tw='cursor-pointer'>Forgot your <b>Password?</b></span>
									</div>
								</div>
							</>
						)
					}

					{
						view === 'otp' && (
							<>
								<p tw='m-0 tracking-wide pt-6 block font-bold text-3xl mt-4'>
									Verify Your Idenity
								</p>
								<p tw='m-0 tracking-wide pt-4 block text-2xl capitalize'>
									Select Where we should send your Verification Code (OTP)
								</p>

								<div tw='mt-2 pb-6'>
									<Form 
										config = { Otp } 
										callback = { otpVerification } 
										generateOtp   = { getOtp } 
										txnData       = { { isFirstSoftTokenLogin } }
										buttonmakefull
										primarylg
										mainSecondary
									/>

									<div tw = "pt-1">
										<ReCAPTCHA
											ref={otpRecaptchaRef}
											size="invisible" //normal or invisible
											sitekey={process.env.SITE_KEY}
											//onChange={onChange}
										/>
									</div>
								</div>
							</>
						)
					}
				</Container>

				{
					view === 'login' && (
						<FooterDiv tw='text-lg tracking-wide font-semibold pt-3 px-6 rounded-b-lg pb-1 lg:(flex items-start justify-between text-base)'>
							<p tw='m-0 mb-3 mr-3 lg:mb-0'>
								Not registered to internet Banking?
								
								<button tw='block px-4 py-2 bg-primary-100 text-gray-100 font-semibold text-sm uppercase rounded-lg mt-1 lg:mt-2' onClick={()=> Router.push('/auth/registration')}>register now</button>
							</p>


							<p tw='m-0'>
								Not a member of Faulu Microfinance Bank?

								<button tw='block px-4 py-2 bg-primary-100 text-gray-100 font-semibold text-sm uppercase rounded-lg mt-1 lg:mt-2' onClick={()=> Router.push('/auth/open-account')}>open account</button>
							</p>
						</FooterDiv>
					)
				}
			</div>
		</AuthLayout>
	)
};

const Container = styled.div`
	${p => p.hasborder && tw`rounded-b-lg`}
`;

const FooterDiv = styled.div`
	background-color: rgba(215, 206, 199, 0.5);
`;

const mapStateToProps = state => {
	return {
		userData    : state.userData
	}
}
const mapDispatchToProps = dispatch => {
	return {
		updateUserData : params => dispatch ( Actions.updateUserData(params) )
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);