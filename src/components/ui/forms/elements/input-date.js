import { DatePicker }       from 'antd';
import React 				from 'react';
import styled 				from 'styled-components';
import tw 					from 'twin.macro';
import moment               from "moment";

// 18 years and above
let maxDate = moment();
maxDate.subtract(18, 'years');

const MAX = maxDate;
const MIN = moment([1900, 1, 1]);

export default class InputDate extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: maxDate
        }
		this.onChange = this.onChange.bind ( this )
    }
	async onChange( value ){
		const {
			inputId, 
			formId,
			updateText
		} = this.props

		updateText ( inputId, formId, { textInput: value })
		
		await this.setState ({
			value
		})
	}
	componentDidMount() {
		let  { value } = this.state
		const {
			inputId, 
			formId,
			updateText
		} = this.props

		updateText ( inputId, formId, { textInput: value })
	}
    render() {
        let { value } = this.state
		const {
			label, 
			focusColor = "skyblue", 
			helperText = "", 
			hasError,	
			style      = {},
			onFocus,
			inputId,
			variant
        } = this.props
        
		if(variant && variant === 'outlined'){
			return (
				<Container hasError = {hasError} focusColor = {focusColor} isMedium = {style.medium} hasRight = {style.mdRight}>
					<DatePicker
						onChange = { this.onChange }
						value    = {value}
						// fill     = { true }
						tw = "absolute top-0 left-0 w-full m-0 bg-transparent focus:outline-none"
						maxDate={MAX} 
						id = {inputId}
						minDate={MIN} 
					/>
					<Label for = {inputId} tw = " rounded absolute top-0 left-5 -mt-3 px-2">{label}</Label>
				</Container>
			)
		}

		if(variant && variant === 'toplabel'){
			return (
				<Main tw = "flex flex-col" isMedium = {style.medium} hasRight = {style.mdRight}>
					<TopLabel for = {inputId}>{label}</TopLabel>
					<LabelContainer hasError = {hasError} focusColor = {focusColor} >
						
						<DatePicker
							onChange = { this.onChange }
							value    = {value}
							// fill     = { true }
							tw = "absolute top-0 left-0 w-full h-full m-0 bg-transparent border-0 rounded-md focus:outline-none"
							maxDate={MAX} 
							id = {inputId}
							minDate={MIN} 
						/>
					
					</LabelContainer>
				</Main>
				
			)
		}
        
    }
};

const TopLabel = styled.label`
    ${tw`text-sm`};
    color: ${p => p.theme.textColor};
`;

const Main = styled.div`
	${tw`w-full`};
	${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
`;

const Label = styled.label`
background: ${p => p.theme.themeColor};
`;

const LabelContainer = styled.div`
	${tw`relative w-full mt-3 text-xs border rounded-md h-9`};
	${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`}
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
    color: ${p => p.theme.textColor};
`;

const Container = styled.div`
    ${tw`relative w-full pt-3 text-xs rounded-md h-9`};
	border       : ${ props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}` };
    & :focus-within {
        border: 2px solid ${props=> props.hasError ? `2px solid ${props.theme.dangerColor}` : props.theme.focusColor};
    };
    ${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
    color: ${p => p.theme.textColor};
`;