import { BsCircle } from 'react-icons/bs';
import React 				from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

export default class BeneficiaryType extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            active: ''
        }
    }
	onClick ( val ) {
		
		const { updateState, inputId, formId, onBlurActions, formStatus, txnData = {}, onBlur } = this.props

		updateState ( inputId,formId, { hasError: false, input: val, message : "" } )

		//let name =  val.toLowerCase()

		onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input: val.toLowerCase(), inputId, ...txnData })
	}
    render() {
        const { optionsList, inputId, value, dataKey, focusColor, style = {} } = this.props
        let width = 29
		if ( style.width && !isNaN(parseInt(style.width, 10))){			
			width = (parseInt(style.width, 10)-2)/2
		}

        return (
            <div tw = "flex flex-row items-center w-full mb-4" data-key = { dataKey } key = { dataKey } >
                <Wrapper
                    active = {value === 'sender' ? true : false}
                    key 		= "sender" 
					data-key 	=  "sender" 								
					onClick  	= { () => this.onClick ( "sender" )}
                    inputSize = {width}
                    marginright = {style.marginBetween}
                >
                    <div tw = "flex items-center" >
						<BsCircle style ={{ color: value === 'sender' ? '#1a90ff' : 'inherit' }}/>
						<div tw = "ml-5" >Sender</div>
					</div>
                </Wrapper>

                <Wrapper
                    active = {value === 'beneficiary' ? true : false}
                    key 		= "beneficiary" 
					data-key 	=  "beneficiary" 								
					onClick  	= { () => this.onClick ( "beneficiary" )}
                    inputSize = {width}
                    marginright = {style.marginBetween}
                >
                    <div tw = "flex items-center" >
						<BsCircle style ={{ color: value === 'beneficiary' ? '#1a90ff' : 'inherit' }}/>
						<div tw = "ml-5" >Beneficiary</div>
					</div>
                </Wrapper>

                <Wrapper
                    active = {value === 'shared' ? true : false}
                    key 		= "shared" 
					data-key 	=  "shared" 								
					onClick  	= { () => this.onClick ( "shared" )}
                    inputSize = {width}
                >
                    <div tw = "flex items-center" >
						<BsCircle style ={{ color: value === 'shared' ? '#1a90ff' : 'inherit' }}/>
						<div tw = "ml-5" >Shared</div>
					</div>
                </Wrapper>
            </div>
        )
    }
};

const Wrapper = styled.div`
    ${tw`relative flex flex-col items-center justify-center h-10 font-bold rounded cursor-pointer`};
    border : ${props => props.active ? `2px solid ${props.theme.primaryColor}` : `1px solid #e5e5e5`};
	color  : ${props => props.active ? props.theme.primaryColor : '#b6b6b6'};
    width: ${props => props.inputSize ? `${props.inputSize}%` : "30%"};
    margin-right: ${props => props.marginright || "16px"};
`;

const Otherwrapper = styled.div`
    ${tw`relative flex flex-col items-center justify-center h-12 font-bold cursor-pointer`};
    border : ${props => props.active ? `2px solid ${props.theme.secondaryColor}` : `1px solid #e5e5e5`};
	color  : ${props => props.active ? props.theme.secondaryColor : '#b6b6b6'};
    width: ${props => props.inputSize ? `${props.inputSize}%` : "30%"};
`;