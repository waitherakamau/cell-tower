import { DatePicker }       from 'antd';
import moment          		from 'moment';
import React 				from 'react';
import styled 				from 'styled-components';
import tw 					from 'twin.macro';

const { RangePicker } = DatePicker;

export default class InputDateRange extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: [ moment(), moment() ],
			dateRange: [ moment().format(), moment().format() ]
        }
		this.onChange = this.onChange.bind ( this )
    }
	async onChange( value ){
		let date1 = value[0]['_d']
		let date2 = value[1]['_d']

		let newDateVal = [date1, date2]

		const {
			inputId, 
			formId,
			maximumDate,
			updateState
		} = this.props
		if(maximumDate && maximumDate === 'today' && moment(date2).isAfter(moment().add(1, 'day').format('YYYY-MM-DD'))){
			updateState ( inputId, formId, { input: newDateVal, hasError: true, message: 'Invalid End Date. Cannot be later than today' })
		}else{
			updateState ( inputId, formId, { input: newDateVal, hasError: false, message: '' })
		}
		
		await this.setState ({
			value
		})
	}
	componentDidMount () {
		let  { value, dateRange } = this.state
		const {
			inputId, 
			formId,
			updateText
		} = this.props

		updateText ( inputId, formId, { textInput: dateRange })
	}
    render() {
        let { value } = this.state
		const {
			label, 
			focusColor = "skyblue", 
			helperText = "", 
			hasError,	
			style      = {},
			variant,
			message
        } = this.props
        
		if(variant && variant === 'outlined'){

			return (
				<Div isMedium = {style.medium} hasRight = {style.mdRight}>
					<TopLabel tw = "text-sm">{label}</TopLabel>
					
					<Container	Container hasError = {hasError} focusColor = {focusColor} inputSize = {style.width}>
					<RangePicker  onChange = { this.onChange } bordered ={false} value ={value} style = {{ width: '100%'}} />
					</Container>
				</Div>
			)
		}
		if(variant && variant === 'toplabel'){

			return (
				<Div isMedium = {style.medium} hasRight = {style.mdRight}>
					<TopLabel tw = "text-sm">{label}</TopLabel>
					
					<TopContainer tw = "mt-3"	Container hasError = {hasError} focusColor = {focusColor}>
					<RangePicker  onChange = { this.onChange } bordered ={false} value ={value} style = {{ width: '100%', background: 'transparent', color: 'inherit'}} />
					</TopContainer>

                    <TextMessage hasError={hasError} >{message}</TextMessage>
				</Div>
			)
		}
    }
};

const TextMessage = styled.p`
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

const TopLabel = styled.label`
    color: ${p => p.theme.textColor};
`;

const Div = styled.div`
    ${tw`w-full`};
    ${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
`;

const TopContainer = styled.div`
    ${tw`w-full h-10 pt-1 bg-transparent border rounded-md`};
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
    & :focus-within {
        border     : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.primaryColor}`};
    };
	color: ${p => p.theme.textColor}
`;

const Container = styled.div`
    ${tw`w-full h-12 pt-3 pl-4 bg-white`};
	border     : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}`};
    & :focus-within {
        border     : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}`};
    };
`;