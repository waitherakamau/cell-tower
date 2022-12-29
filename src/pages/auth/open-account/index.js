import React, { useState } 	from 'react'
import styled 				from 'styled-components';
import Router 		   		from 'next/router';
import { toast } 			from 'react-toastify';
import 'twin.macro'

import AuthLayout    from '@components/layout/reg';
import CheckBox 	 from '@components/ui/forms/elements/input-checkbox';

const Registration = () => {
	const [ checkBoxSelected, setCheckBoxSelected ] = useState(false)
	const [ view, setView ]                         = useState('terms')

	return (
		<AuthLayout>
			<div tw='w-full h-full px-4 bg-smallBgColor lg:(px-24 bg-transparent)'>
				<div tw='bg-secondary-100 p-2 rounded-b-lg w-28 mt-8 lg:(w-48 h-24)' >
					<img src='/images/logo.png' tw='w-full h-auto' alt='logo' />
				</div>

				{
                    view === 'terms' && (
                        <>
                            <p tw='mt-6 text-lg tracking-wide font-medium'>
                                <span tw='text-primary-100'>
                                    Register |
                                </span>
                                <span tw='ml-2 font-normal'>
                                    With a ID and SMS PIN
                                </span>
                            </p>

                            <div tw='p-4 rounded-lg bg-white tracking-wide mt-6 lg:shadow'>
                                <span tw='font-semibold text-lg'>All you need is the following :</span>
                                
                                <div tw='lg:(flex items-center justify-between)'>
                                    <div tw='flex mt-5'>
                                        <img src='/images/open_acc.png' tw='w-14 h-14' alt='open-acc' />
                                        <p tw='m-0 ml-3 text-sm lg:(ml-7)'>
                                            1. Complete an account opening form <br/>
                                            2. Provide an original and copy of National ID or Valid Passport <br/>
                                            3. A copy of your KRA PIN Certificate <br/>
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
                                <Button tw='w-24 h-12 text-center uppercase text-gray-100 rounded-lg lg:(w-48 h-14)' onClick={()=> checkBoxSelected ? setView('account-type') : toast.error('Please accept the terms & conditions to continue')}>accept</Button>
                            </div>
                        </>
                    )
                }

                {
                    view === 'account-type' && (
                        <>
                            <p tw='mt-3 text-lg text-primary-100 tracking-wide font-semibold lg:text-xl'>
                                What type of Account would you like to open?
                            </p>

                            <div tw='pb-4 pt-2 flex flex-wrap justify-around shadow rounded-lg bg-white tracking-wide mt-4'>

                                <Div tw='rounded pb-2 mt-4'>
                                    <img src='/images/account_salary.png' tw='w-full h-auto' alt='salary-account' />

                                    <div tw='px-2 mt-4'>
                                        <p tw='font-bold tracking-wide text-base'>
                                            Faulu Salary Account
                                        </p>

                                        <p tw='tracking-wide text-base mt-2'>
                                            A salary account is a personal bank account for employed customers, providing convenience to accessing their salary, wages and allowance.
                                        </p>

                                        <p tw='mt-7 font-semibold tracking-wide text-sm'>
                                            Minimum Balance (KES)
                                        </p>

                                        <p tw='mt-2 font-semibold tracking-wide text-xl'>
                                            1,000
                                        </p>

                                        <button tw='w-40 mt-8 h-11 text-center tracking-wide font-bold text-gray-100 bg-primary-100 uppercase text-sm rounded-lg'>
                                            open now
                                        </button>
                                    </div>
                                </Div>
                                <Div tw='rounded pb-2 mt-4'>
                                    <img src='/images/account_hazina.png' tw='w-full h-auto' alt='hazina-account' />

                                    <div tw='px-2 mt-4'>
                                        <p tw='font-bold tracking-wide text-base'>
                                            Hazina Junior Account
                                        </p>

                                        <p tw='tracking-wide text-base mt-2'>
                                            This is an account that encourages a savings culture for our children. It is ideal for children below the age of 18 years. 
                                        </p>

                                        <p tw='mt-7 font-semibold tracking-wide text-sm'>
                                            Minimum Balance (KES)
                                        </p>

                                        <p tw='mt-2 font-semibold tracking-wide text-xl'>
                                            1,000
                                        </p>

                                        <button tw='w-40 mt-8 h-11 text-center tracking-wide font-bold text-gray-100 bg-primary-100 uppercase text-sm rounded-lg'>
                                            open now
                                        </button>
                                    </div>
                                </Div>
                                <Div tw='rounded pb-2 mt-4'>
                                    <img src='/images/account_lengo.png' tw='w-full h-auto' alt='lengo-account' />

                                    <div tw='px-2 mt-4'>
                                        <p tw='font-bold tracking-wide text-base'>
                                            Faulu Lengo Account
                                        </p>

                                        <p tw='tracking-wide text-base mt-2'>
                                            The Lengo account is an account tailored to help you put aside funds at your own pace - kidogo kidogo. 
                                        </p>

                                        <p tw='mt-7 font-semibold tracking-wide text-sm'>
                                            Minimum Balance (KES)
                                        </p>

                                        <p tw='mt-2 font-semibold tracking-wide text-xl'>
                                            1,000
                                        </p>

                                        <button tw='w-40 mt-8 h-11 text-center tracking-wide font-bold text-gray-100 bg-primary-100 uppercase text-sm rounded-lg'>
                                            open now
                                        </button>
                                    </div>
                                </Div>
                            </div>
                        </>
                    )
                }
			</div>
			
		</AuthLayout>
	)
};

const Button = styled.button`
	background-image: linear-gradient(270deg, #F37021 0%, #F9B111 100%);
`;

const Div = styled.div`
    width: 380px;
    border: 1px solid #E4E4E4
`;

export default Registration