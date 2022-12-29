import React from 'react'
import styled from 'styled-components'
import 'twin.macro'

const Footer = (props) => {

	return (
		<Div tw='w-full py-2 pl-5 fixed bottom-0 text-sm font-normal leading-normal tracking-wider cursor-default'>
			{/* <span>Copyright&copy;{ new Date().getFullYear() } Talk to us Direct line 020 280333 | 2803000,071 6918 999 | 0734 856 353</span> */}
			
			<span tw = "block">
				<a target = '_blank' href='https://www.faulukenya.com/privacy-policy/' rel="noreferrer" >Security</a>
				<a tw='ml-2' target = '_blank' href='https://www.faulukenya.com/privacy-policy/' rel="noreferrer" >| Privacy Policy</a> 
				<a tw='ml-2' target = '_blank' href='https://www.faulukenya.com/v3/assets/blt16fcb8b9fff11918/blt82c2c66ffaaaf7f4/6218eb2d2e007813083bb9de/General_Terms_and_Conditions_for_Faulu_Microfinance_Bank.pdf' rel="noreferrer" >| Terms & Conditions</a> 
			</span>
		</Div>
	)
}

const Div = styled.div`
	background-color: rgba(255, 255, 255, 0.8);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export default (Footer)