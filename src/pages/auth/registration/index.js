import React, { useState } 	from 'react'
import styled 				from 'styled-components';
import Router 		   		from 'next/router';
import { toast } 			from 'react-toastify';
import 'twin.macro'

import AuthLayout    from '@components/layout/reg';
import CheckBox 	 from '@components/ui/forms/elements/input-checkbox';

const Registration = () => {
	const [checkBoxSelected, setCheckBoxSelected] = useState(false)

	return (
		<AuthLayout>
			<div tw='w-full h-full px-4 bg-smallBgColor lg:(px-24 bg-transparent)'>
				<div tw='bg-secondary-100 p-2 rounded-b-lg w-28 mt-8 lg:(w-48 h-24)' >
					<img src='/images/logo.png' tw='w-full h-auto' alt='logo' />
				</div>

				<p tw='mt-6 text-lg tracking-wide font-medium'>
					<span tw='text-primary-100'>
						Activate Account |
					</span>
					<span tw='ml-2 font-normal'>
						to register online Banking
					</span>
				</p>

				<div tw='p-4 rounded-lg bg-white tracking-wide mt-6 lg:shadow'>
					<span tw='font-semibold text-lg'>All you need is the following :</span>
					
					<div tw='lg:(flex items-center justify-between)'>
						<div tw='flex mt-5'>
							<img src='/images/mobile_sms.png' tw='w-14 h-14' alt='mobile-sms' />
							<p tw='m-0 ml-3 text-sm lg:(w-80 ml-7)'>
								A mobile number that is already registered with the bank. You will need this to receive a temporary password.
							</p>
						</div>

						<p tw='font-medium text-base tracking-wider mt-6 text-center lg:font-semibold'>AND</p>

						<div tw='flex mt-5'>
							<p tw='w-14'><img tw='w-11 h-14' src='/images/bank.png' alt='bank-requirements' /></p>
							<p tw='m-0 ml-3 text-sm lg:(w-80 ml-7)'>
								National Identity, email address and  an active Faulu Bank Account.
							</p>
						</div>
					</div>
					
					<p tw='font-semibold text-lg mt-6 border-t-2 border-gray-200 pt-2'>Missing some information?</p>
					<p tw='text-sm mt-1 lg:mt-3'>
						If you do not have all of the required information, please visit one of our branches.
					</p>
					
					<p tw='font-semibold text-lg mt-7 border-t-2 border-gray-200 pt-2'>Terms & Conditions</p>
					<p tw='flex items-end text-sm mt-0 lg:(items-center)'>
						<CheckBox 
							checked          = { checkBoxSelected } 
							label            = ''
							setCheckBoxState = { ()=> setCheckBoxSelected(!checkBoxSelected) }
						/>
						<span tw='mt-2 lg:mt-5'>I have read and understood the Terms & Conditions and agree to abide by them.</span>
					</p>
				</div>

				<div tw='flex items-center justify-between mt-8 pb-2 text-sm tracking-wide'>
					<button tw='w-24 h-12 text-center uppercase border-4 border-primary-100 text-primary-100 rounded-lg lg:(border-3 w-48 h-14)' onClick={()=> Router.push('/auth/login')}>cancel</button>
					<Button tw='w-24 h-12 text-center uppercase text-gray-100 rounded-lg lg:(w-48 h-14)' onClick={()=> checkBoxSelected ? Router.push('/auth/registration/account_check') : toast.error('Please accept the terms & conditions to continue')}>accept</Button>
				</div>
			</div>
			
		</AuthLayout>
	)
};

const Button = styled.button`
	background-image: linear-gradient(270deg, #F37021 0%, #F9B111 100%);
`;

export default Registration