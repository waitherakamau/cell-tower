import { DatePicker }       from 'antd';
import React 				from 'react';
import styled 				from 'styled-components';
import tw 					from 'twin.macro';
import moment               from "moment";

// min today max 100 years
let maxDate = moment();
maxDate.add(100, 'years');

const MAX = maxDate;
const MIN = moment();

export default class InputDate extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: MIN
        }
		this.onChange = this.onChange.bind ( this )
    }
	async onChange( value ){
		const {
			inputId, 
			formId,
			updateText,
			updateState,
			minDate,
			maximumDate,
			onBlur ,
			onBlurActions,
			formStatus    = {},
			txnData       = {},
		} = this.props	
		let maxDate = moment();
		maxDate.subtract(18, 'years');

		if(minDate && minDate === 'today' && moment(value).isBefore(moment().format('YYYY-MM-DD'))){
			updateState ( inputId, formId, { input: moment(value).format('YYYY-MM-DD'), hasError: true, message: 'Invalid Date' })
		}else if(minDate && minDate === 'above18' && moment(value).isAfter(moment(maxDate).format('YYYY-MM-DD'))){
			updateState ( inputId, formId, { input: moment(value).format('YYYY-MM-DD'), hasError: true, message: 'Invalid Date. Should be above 18 years' })
		}else if(maximumDate && maximumDate === 'today' && moment(value).isAfter(moment().add(1, 'day').format('YYYY-MM-DD'))){
			updateState ( inputId, formId, { input: moment(value).format('YYYY-MM-DD'), hasError: true, message: 'Invalid Date' })
		}else {
			updateState ( inputId, formId, { input: moment(value).format('YYYY-MM-DD'), hasError: false, message: '' })

			//On Blur Actions
			onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input: moment(value).format('YYYY-MM-DD'), inputId, ...txnData })
		}
		
		this.setState ({
			value
		})
	}
	componentDidMount() {
		const {
			inputId, 
			formId,
			updateText,
			value,
			minDate
		} = this.props
		let maxDate = moment();
		maxDate.subtract(18, 'years');

		!value && updateText ( inputId, formId, { textInput: moment().format('YYYY-MM-DD') })
		!value && minDate && minDate === 'above18' && updateText ( inputId, formId, { textInput: moment(maxDate).format('YYYY-MM-DD') })
	}
    render() {
		const {
			label, 
			focusColor = "skyblue", 
			helperText = "", 
			hasError,	
			style      = {},
			onFocus,
			inputId,
			message,
			value,
			variant
        } = this.props
		
		let date = value
		if(typeof value === 'string'){
			date = moment(value)
		}
        
		if(variant && variant === 'outlined'){
			return (
				<Container hasError = {hasError} focusColor = {focusColor} isMedium = {style.medium} hasRight = {style.mdRight}>
					<DatePicker
						onChange = { this.onChange }
						value    = {value ? moment(value) : moment()}
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
							value    = {value ? moment(value) : moment()}
							// fill     = { true }
							tw = "absolute top-0 left-0 w-full h-full m-0 bg-transparent border-0 rounded-md focus:outline-none text-white"
							maxDate={MAX} 
							id = {inputId}
							minDate={MIN} 
						/>
					</LabelContainer>

                    <TextMessage hasError={hasError} >{message}</TextMessage>
				</Main>
				
			)
		}
        
    }
};

const TextMessage = styled.p`
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

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