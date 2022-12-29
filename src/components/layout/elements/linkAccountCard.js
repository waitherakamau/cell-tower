import styled from 'styled-components';
import 'twin.macro';

const AccountCard = ({ accountName, accountNumber, currency, balance = {}, showBalance }) => {
	return (
		<div tw="w-full flex flex-col justify-between h-auto pb-9 px-4 mt-3 overflow-hidden border-solid border-l-0 border-b-0 border-r-0 border-t-4 rounded shadow border-primary-100 text-primary-100 md:(w-80 h-48) text-center">
			<div tw='border border-solid border-primary-100 mt-6 text-center rounded py-2 text-sm cursor-pointer' >
                <span>Link account</span>
            </div>
            <span>Or</span>
			<div tw='border border-solid border-primary-100 text-center rounded py-2 text-sm cursor-pointer' >
                <span>Open account</span>
            </div>
		</div>
	)
}

export default AccountCard;
