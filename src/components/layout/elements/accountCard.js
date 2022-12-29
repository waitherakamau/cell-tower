import styled from 'styled-components';
import commaNumber from 'comma-number';
import 'twin.macro';

const AccountCard = ({ accountName, accountNumber, currency, balance = {}, showBalance }) => {
	return (
		<div tw="w-full pb-2 mt-3 overflow-hidden border-solid border-l-0 border-b-0 border-r-0 border-t-4 rounded shadow border-primary-100 md:(w-80 h-48)">
			<BackDiv tw = "flex items-center justify-between px-2 pt-4 text-sm font-medium leading-snug tracking-wide">
				<span>Account Name</span>
				<span>Account Number</span>
			</BackDiv>

			<BackDiv tw = "flex items-center justify-between px-2 text-sm font-semibold leading-snug tracking-wider">
				<span>{accountName}</span>
				<span>{accountNumber}</span>
			</BackDiv>

			<BackDiv tw = "flex items-center justify-between pt-4 px-2 text-sm font-semibold text-primary-100 leading-snug tracking-wider">
				<div>
					<p tw = "font-medium text-sm m-0">Account Balance</p>
					<p tw = "m-0">{currency} {balance.AvailableBal ? commaNumber(balance.AvailableBal) : "---,---.--"}</p>
				</div>
				<div tw='border border-solid border-primary-100 text-primary-100 rounded-md w-20 text-center py-1 font-medium cursor-pointer'>
					{
						showBalance && 'Show Bal'
					}
					{
						!showBalance && 'Hide Bal'
					}
				</div>
			</BackDiv>


			<div tw = "flex justify-center w-full mt-5">
				<Details tw = "px-12 py-2 capitalize rounded-md cursor-pointer md:px-16 text-primary-100 border border-primary-100 border-solid">
						Full account details
				</Details>
			</div>
			
		</div>
	)
}

const Details = styled.div`
    color: ${p => p.theme.themeColor};
`;

const BackDiv = styled.div`
    background-color: #F5FAFF;
`;

export default AccountCard;
