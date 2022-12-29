import React 	from 'react'
import styled  	from 'styled-components'
import 'twin.macro'

import AuthLayout    from '@components/layout/reg';

const RegistrationSuccess = () => {
	return (
		<AuthLayout>
			<div tw='w-full h-full overflow-hidden lg:(flex justify-between pt-3)'>
				<div tw='w-full h-full px-4 pb-3 text-center lg:(pl-24 w-1/2)'>
					<div tw='bg-secondary-100 p-2 rounded-b-lg w-28 lg:(w-48 h-24)' >
						<img src='/images/logo.png' tw='w-full h-auto' alt='logo' />
					</div>

					<div tw='mt-14 w-full mx-auto lg:mt-28'>
						<img src='/images/email_success.png' tw='mx-auto w-auto h-auto' alt='email' />
					</div>

					<p tw='mt-14 font-semibold text-primary-100 tracking-wide text-2xl'>
						Thank you for registering online banking 
					</p>

					<p tw='mt-8 tracking-wide text-gray-800 text-xl'>
						We’ve sent a confirmation email to your registered email.
					</p>

					<p tw='mt-14 tracking-wide text-gray-800 text-lg'>
						Didn’t receive the email? Check your spam inbox section.
					</p>
				</div>
				
				<Div tw='hidden lg:(inline-block w-1/2 h-full overflow-hidden overflow-y-hidden overscroll-none)'>
					<img src='/images/reg_success.png' tw='w-auto h-auto overflow-hidden overflow-y-hidden object-cover object-center fixed z-2' alt='background-success' />
				</Div>
			</div>
		</AuthLayout>
	)
}

const Div = styled.div`
	margin-left: 89px;
`;

export default RegistrationSuccess