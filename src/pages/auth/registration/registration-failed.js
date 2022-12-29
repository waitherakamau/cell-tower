import React 	from 'react'
import styled  	from 'styled-components'
import { AiOutlineClose } from 'react-icons/ai'
import 'twin.macro'

import AuthLayout    from '@components/layout/reg';

const RegistrationFailed = () => {
	return (
		<AuthLayout>
			<div tw='w-full h-full overflow-hidden lg:(flex justify-between pt-3)'>
				<div tw = "flex flex-col items-center justify-center">
					
					<div tw = 'flex flex-row items-center justify-center m-6 border-2 rounded-full w-36 h-36 border-danger text-danger'>
                        <p>
							<AiOutlineClose tw='text-6xl' />
						</p>
					</div>

					<h1 tw='text-3xl'><b>Oops!</b></h1>
					
                    <p tw = "px-10 mt-3 text-base leading-snug text-center">
						Your Faulu Registration request failed. For further information,
						kindly contact Faulu Bank Customer Service on: <b>254 711074000</b>
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

export default RegistrationFailed