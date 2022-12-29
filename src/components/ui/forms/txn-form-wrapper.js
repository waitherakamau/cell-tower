import React, { useEffect, useState } from 'react'
import { toast } 						from 'react-toastify';
import { connect } 						from 'react-redux';
import { BsArrowLeft } 					from "react-icons/bs";
import styled 							from 'styled-components';
import CommaNumber 						from 'comma-number'
import 'twin.macro'

import DynamicForm     		from '@components/ui/forms/dynamic-form';
import Otp             		from '@config/forms/auth/txn-otp';
import TransactionsService 	from '@services/api/transactions.service';
import AuthService 			from '@services/api/auth.service';
import NotificationMapper 	from '@services/api/transactions.notifications.mapper';


const onBlurActions = new TransactionsService().lookups;

const TxnFormWrapper = (props) => {
	const { 
		userData: { username, personalInfo: { email, firstName, phoneNumber }, accountInfo: { linkedAccounts = [
			{
				productCode		: '6108',
				accountNumber	: '1009700420',
				customerId		: '345427',
				dailyTxnLimit	: 5000000,
				currency		: 'KES',
				accountCategory	: '',
				isViewOnly		: false,
				canTransact		: true,
				perTxnLimit		: 1000000,
				productName		: "",
				accountName		: "",
				status			: 1,
				accountType		: ""
			},
			{
				productCode		: '6108',
				accountNumber	: '1009200420',
				customerId		: '345427',
				dailyTxnLimit	: 5000000,
				currency		: 'KES',
				accountCategory	: '',
				isViewOnly		: false,
				canTransact		: true,
				perTxnLimit		: 1000000,
				productName		: "",
				accountName		: "",
				status			: 1,
				accountType		: ""
			}
		] }, sessionId },
		config,
		goback,
		activemenu,
		showDebitAccounts = {},
		initialState = {},
		onBlurActions: formBlurActions = {},
		individualAccOnly,
		type      = 'form',
		rtgsThreshold
	} = props
	let  formTxnData =  { 
		firstName	, 
		phone		: phoneNumber,
		email		,
		sessionId
	}

	const [ view, setView ] = useState('form');
	const [ formConfig, setFormConfig ] = useState(config);
	const [ lookupData, setLookupData ] = useState({});
	const [ txnData, setTxnData ] = useState({});
	const [ chargesData, setChargesData ] = useState({});
	const [ formData, setFormData ] = useState({});

	useEffect(() => {
		setInitialDebitAccounts()
	}, [])
	
	const setInitialDebitAccounts = () => {
		//Inject debit Accounts into form
		//search for debitAccount and is type select and inject customer acounts
		//flag to inject accounts to credit
		if (showDebitAccounts) {
			let ownAccountOptions = [];

			if(!individualAccOnly){
				// get all accounts - can transact
				let canTransactAcc = linkedAccounts.filter(account => showDebitAccounts.showViewOnly && account || !account.isViewOnly && account.canTransact)
				
				ownAccountOptions = canTransactAcc.map ((e,index) => {
					return {
						"id"  : index + 1,
						"name": e.accountNumber.toString()
					}
				})

			}else if (individualAccOnly){
				// get own accounts - can transact
				let canTransactAcc = linkedAccounts.filter(account => account.accountType === 'Individual' && !account.isViewOnly && account.canTransact)

				ownAccountOptions = canTransactAcc.map((e,index) => {
					return {
						"id"  : index + 1,
						"name": e.accountNumber.toString()
					}
				})
			}

			//dynamic search for debitAccount element
			let sectionIndex = 0, elementIndex = 0
			let debitAccExists = false

			formConfig.sections.map((section, index1) => {
				section.elements.map((element, index2) => {
					if (element.id === 'debitAccount' && element.type === "select") {
						sectionIndex = index1
						elementIndex = index2
						debitAccExists = true
					}
				})
			})

			if(debitAccExists){
				formConfig.sections[sectionIndex].elements[elementIndex].optionsList = ownAccountOptions
				if (showDebitAccounts.onBlur) {
					formConfig.sections[sectionIndex].elements[elementIndex].onBlur = showDebitAccounts.onBlur
				}
			}
		}
		setFormConfig(formConfig)
	}

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
	const charges = async (formId, formState, setFormState, setLoadingState) => {
		let getCharges  = { success: false }

		let debitAccount          = "" 
		let amountIsWithinLimit   = false
		let amount                = false 
		let hasAmount             = false
		let uploadDocs  		  = false
		let formStageData 		  = {}

		formState.forEach ( e => {
			if ( e.inputId === 'amount' ) {
				amount = e.textInput
				hasAmount = true
			}
			if ( e.inputId === 'debitAccount' ) {
				debitAccount = e.textInput
			}
			formStageData[e.inputId] = e.textInput
		})
		
		let perTransactionLimit   = linkedAccounts.find(e => e.accountNumber === debitAccount)?.perTxnLimit
		let dailyTransactionLimit = linkedAccounts.find(e => e.accountNumber === debitAccount)?.dailyTxnLimit

		if(amount && rtgsThreshold &&  Number(parseInt (amount, 10)) > Number(parseInt(rtgsThreshold, 10))){
			uploadDocs = true
		}

		// Mandates
		if ( amount && Number(parseInt (amount, 10)) <= Number(parseInt(perTransactionLimit, 10)) && Number(parseInt(amount, 10)) <= Number(parseInt(dailyTransactionLimit, 10))){
			amountIsWithinLimit = true
		}
		if (!hasAmount || hasAmount && amountIsWithinLimit) {
			
			//get charges
			getCharges = await new TransactionsService().getCharges(
				formId, 
				formState, 
				setFormState, 
				setLoadingState,  
				{
					...lookupData,
					uploadDocs,
					firstName, 
					phone 		: phoneNumber,
					email,
					debitAccount,
					type        : formId,
					customerId  : linkedAccounts.find(e => e.accountNumber === debitAccount)?.customerId,
					currency    : linkedAccounts.find(e => e.accountNumber === debitAccount)?.currency,
					debitAccountName: linkedAccounts.find(e => e.accountNumber === debitAccount)?.accountName,
					meta: {
						sessionId
					}
				} 
			)	
		}

		if (getCharges.success) {
			setFormData(formStageData)
			setChargesData(getCharges)
			setTxnData(getCharges.data)
			setView('charges')
		}else {
			if (hasAmount && perTransactionLimit && !amountIsWithinLimit){
				formState = formState.map ( e => {
					if ( e.inputId === 'amount' ) {
						e.hasError = true
						e.message = `The amount entered is greater than the per transaction limit of ${CommaNumber(perTransactionLimit)}`
					}
					return e
				})

				setFormState (formId, formState)
			}
			if (hasAmount && !perTransactionLimit){
				formState = formState.map ( e => {
					if ( e.inputId === 'debitAccount' ) {
						e.hasError = true
						e.message = `Please select the account pay from`
					}
					return e
				})

				setFormState (formId, formState)
			}
			if (hasAmount && !amount){
				formState = formState.map ( e => {
					if ( e.inputId === 'amount' ) {
						e.hasError = true
						e.message = `Please enter amount to transact`
					}
					return e
				})

				setFormState (formId, formState)
			}
		}

	}
	const submit = async (formId, formState, setFormState, setLoadingState) => {

		let otp = formState.find(item => item.inputId === 'otp').textInput
		let response = await new AuthService().submitOtp( formId, formState, setFormState, otp )

		if ( response.success ) {				
			
			let stageTxn     = false
			let accountData  = linkedAccounts.find( e => e.accountNumber === txnData.debitAccount ) || {}

			//get the metadata of the transactions
			let meta = {
				firstName            ,
				phoneNumber	 		 ,
				debitAccountCurrency : accountData.currency,
				perTransactionLimit  : accountData.perTxnLimit,
				dailyTransactionLimit: accountData.dailyTxnLimit,
				sessionId
			}

			// stage corporate transactions by default
			if(accountData?.accountType?.toLowerCase() === 'corporate') {
				stageTxn = true
			}

			//add more details ( also include Customer name and transaction limits - then in api service apply them in post hooks )
			let payload = { 
				...txnData, 
				leg 			: 'transact', 
				stageTxn		, 
				initiatedBy		: email,
				firstName		,
				meta
			}

			setLoadingState( true)
			let performTransaction = await new TransactionsService().transact( payload )
			setLoadingState( false)		
			

			if(performTransaction.success){
				let esbMessage = NotificationMapper({ ...payload, ...performTransaction }) || `Your ${txnData.type.replace(/-/g,' ')} request was processed successfuly`

				setTxnData({ 
					...payload, 
					esbMessage 
				})
				setView('confirmation')
			}else{
				
				setTxnData({ 
					...payload, 
					esbMessage: performTransaction.message 
				})
				setView('txn-failure')
			}

		}else{
			toast.error(`The Verification Code Entered is incorrect`)
		}
	}

	return (
		<div>
			{
				view === 'form' && (
					<BackDiv tw='flex items-center font-bold text-primary-100 mt-4 cursor-pointer lg:hidden' onClick={goback} >
						<BsArrowLeft tw='text-2xl' />
						<p tw='text-base tracking-wide ml-2 cursor-pointer'>Back</p>
					</BackDiv>
				)
			}
			<div tw='w-full py-4 pl-4 font-bold tracking-wide text-xl bg-smallBgColor rounded-t-lg mt-4'>
					{activemenu.title}
			</div>

			<div tw='px-4 pt-6 tracking-wide bg-white pb-5 lg:px-12' >
				{
					view === 'form' && (
							<>
								<p tw='text-primary-100 text-xl'>{activemenu.subtitle}</p>

								<div tw='mt-4'>
									<DynamicForm 
										config        = { formConfig } 
										callback      = { charges }
										txnData       = { formTxnData }
										onBlurActions = {{ ...formBlurActions, ...onBlurActions }}
										initialState  = {{ ...initialState, ...formData }}
									/>
								</div>
							</>
					)
				}
				{
					view === 'charges' && (
						<div tw='w-full flex items-center lg:px-16'>
							<div tw='hidden lg:block'>
								<ConfirmImg src='/images/confirm.png' alt='confirm' />
							</div>
							<div tw='w-full flex-1 lg:(pl-14 ml-14 h-full border-l border-gray-200)'>
								<span tw='text-primary-100 text-xl'>Confirm transaction details</span>
								<div tw='w-32 h-1 rounded-lg bg-secondary-100 mt-2 lg:w-36' />

								<p tw = "text-sm font-normal pt-4" dangerouslySetInnerHTML = {{ __html: chargesData?.messageData?.notificationMessage }}/>

								<div tw='mt-4'>
									<DynamicForm 
										config        			 = { Otp } 
										generateOtp  			 = { getOtp }
										callback      			 = { submit }
										backButton				 = { ()=> setView('form') }
										backButtonText			 = 'NO, MAKE CHANGES'
										backBOutlined
										primarysm
										backsm
										txnData 				 = {{ 
											email, 
											sessionId	 
										}}
										onBlurActions 			 = {{ validateOtp: onBlurActions.validateOtp }}
									/>
								</div>
							</div>
						</div>
					)
				}
				{
					view === 'confirmation' && (
						<div tw='w-full flex items-center lg:px-16'>
							<div tw='hidden lg:block'>
								<ConfirmImg src='/images/success.png' alt='success' />
							</div>
							<div tw='w-full flex-1 lg:(pl-14 ml-14 h-full border-l border-gray-200)'>
								<span tw='text-primary-100 text-xl'>Success!</span>
								<div tw='w-24 h-1 rounded-lg bg-secondary-100 mt-2 lg:w-36' />

								<p tw='text-base font-semibold pt-2 lg:text-xl'>
									Your transaction has been { txnData.stageTxn ? 'staged' : 'processed' } Successfully
								</p>
								<p tw='text-base mt-4'>
									Meanwhile... share the message below to help us get the word out.
								</p>

								<p tw='text-xs tracking-wider mt-2 px-3 py-4 leading-relaxed rounded-xl border border-secondary-100 lg:(text-sm)'>
									I topped up my airtime instantly at onlinebaking.faulu.co.ke/buyairtime. You should try it too.
								</p>

								<p tw='mt-6 text-xl font-semibold'>
									Share it on:
								</p>
								<div tw='mt-6 pb-4 flex items-center justify-between'>
									<img src='/images/facebook.png' tw='w-10 h-10' alt='facebook' />
									<img src='/images/twitter.png' tw='w-10 h-10' alt='twitter' />
									<img src='/images/whatsapp.png' tw='w-10 h-10' alt='whatsapp' />
									<img src='/images/linkedin.png' tw='w-10 h-10' alt='linkedin' />
								</div>
							</div>
						</div>
					)
				}
				{
					view === 'txn-failure' && (
						<div tw='w-full flex items-center lg:px-16'>
							<div tw='hidden lg:block'>
								<ConfirmImg src='/images/failed.png' alt='success' />
							</div>
							<div tw='w-full flex-1 lg:(pl-14 ml-14 h-full border-l border-gray-200)'>
								<span tw='text-red-500 text-xl'>Transaction Failed!</span>
								<div tw='w-24 h-1 rounded-lg bg-red-500 mt-2 lg:w-36' />

								<p tw='text-base font-semibold pt-2 lg:text-xl'>
									Your transaction failed. {txnData.esbMessage}
								</p>

								<button tw='rounded-lg text-gray-100 bg-primary-100 font-bold tracking-wide px-8 py-2 text-base mt-4' onClick={()=> setView('form')} >
									BACK
								</button>
							</div>
						</div>
					)
				}
			</div>
		</div>
	)
};

const BackDiv = styled.div`
	cursor: pointer;
`;

const ConfirmImg = styled.img`
	width: 125px;
	height: 124px;
`;

const mapStateToProps = state => {
	return {
		userData    : state.userData
	}
}
export default connect(mapStateToProps)( TxnFormWrapper )