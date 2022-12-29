import { BsCircle } from 'react-icons/bs';
import tw from 'twin.macro';
import React 				from 'react';
import styled from 'styled-components';

export default class BeneficiaryType extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            active: 'other-beneficiary'
        }
		this.setActive = this.setActive.bind(this)
    }
	onClick ( val ) {
		
		const { updateState, inputId, formId, onBlurActions, formStatus, txnData = {}, onBlur } = this.props

		updateState ( inputId,formId, { hasError: false, input: val, message : "" } )

		let name =  val.toLowerCase()
		this.setActive ( name )

		//change the form state to get saved beneficiaries etc
		onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input: val.toLowerCase(), inputId, ...txnData })
	}
	setActive ( active ){
		this.setState({
			active
		})
	}
    render() {
        const { optionsList, inputId, value, dataKey, focusColor, style = {} } = this.props
		let { active } = this.state

        return (
            <Conatiner data-key = { dataKey } key = { dataKey } isMedium = {style.medium} hasRight = {style.mdRight} >
                <Wrapper
                    active = {active === 'saved-beneficiary' ? true : false}
                    key 		= "saved-beneficiary" 
					data-key 	=  "saved-beneficiary" 								
					onClick  	= { () => this.onClick ( "saved-beneficiary" )}
                >
                    <div tw = "flex items-center" >
						<BsCircle style ={{ color: active === 'saved-beneficiary' ? '#1a90ff' : 'inherit' }}/>
						<div tw = "ml-5" >Saved Beneficiary</div>
					</div>
                </Wrapper>

                <Otherwrapper
                    active = {active === 'other-beneficiary' ? true : false}
                    key 		= "other-beneficiary" 
					data-key 	=  "other-beneficiary" 								
					onClick  	= { () => this.onClick ( "other-beneficiary" )}
                >
                    <div tw = "flex items-center" >
						<BsCircle style ={{ color: active === 'other-beneficiary' ? '#1a90ff' : 'inherit' }}/>
						<div tw = "ml-5" >Other Beneficiary</div>
					</div>
                </Otherwrapper>
            </Conatiner>
        )
    }
};

const Conatiner = styled.div`
    ${tw`flex flex-row items-center justify-between w-full mt-2 mb-4 text-center`};
    ${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
    color: ${p => p.theme.textColor};
`;

const Wrapper = styled.div`
    ${tw`flex items-center justify-center h-10 px-2 font-bold rounded cursor-pointer w-sm`};
    border : ${props => props.active ? `2px solid ${props.theme.secondaryColor}` : `1px solid ${props.theme.borderColor}`};
	color  : ${props => props.active ? props.theme.secondaryColor : '#b6b6b6'};
`;

const Otherwrapper = styled.div`
    ${tw`flex items-center justify-center h-10 px-2 font-bold rounded cursor-pointer w-sm`};
    border : ${props => props.active ? `2px solid ${props.theme.secondaryColor}` : `1px solid ${props.theme.borderColor}`};
	color  : ${props => props.active ? props.theme.secondaryColor : '#b6b6b6'};
`;