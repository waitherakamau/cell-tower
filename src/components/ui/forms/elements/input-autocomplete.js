import React from 'react';
import Autosuggest  from 'react-autosuggest';
import styled       from 'styled-components';
import tw           from 'twin.macro';


const getSuggestions     = ( value, dataSet ) => {
	const inputValue = value.trim().toLowerCase()
	const inputLength = inputValue.length;

	return inputLength === 0 ? [] : dataSet.filter( data =>
		// data.name.toLowerCase().slice(0, inputLength) === inputValue
		data.name.toLowerCase().startsWith ( inputValue )
	)
}
const getSuggestionValue = suggestion => suggestion.name
const renderSuggestion   = suggestion => (
	<div>
		{suggestion.name}
	</div>
)


export default class Autocomplete extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userValue  : '',
			suggestions: []
        }
		this.onBlur                      = this.onBlur.bind( this )
		this.onChange                    = this.onChange.bind ( this )		
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind ( this )
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind ( this )
    }
	onBlur (e){
		const {
			inputId, 
			formId,	
			updateState,
			value,
			options,
			onBlur,
			onBlurActions,
			formStatus,
			txnData
		} = this.props

		let { userValue }  = this.state
		let dataExists     = options.find ( e => e.name === value )
		let isValid        = dataExists ? true : false

		if ( !isValid ) {
			updateState ( inputId, formId, { hasError: true, input: userValue, message: `Invalid ${inputId}` })
		}
		else {
			updateState ( inputId, formId, { hasError: false, input: userValue, message: '' })	

			onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input: value, inputId, ...txnData })			
		}
	}
	onChange (event, { newValue }) {

		const {
			inputId, 
			formId,
			updateText
		} = this.props

		updateText ( inputId, formId, { textInput: newValue })
		this.setState({
			userValue: newValue
		})
	}	
	onSuggestionsFetchRequested ({ value }) {

		const {
			inputId, 
			formId,	
			updateState,
		} = this.props

		let suggestions = getSuggestions ( value, this.props.options )
		let hasError = suggestions.length === 0 ? true : false
		

		updateState ( inputId, formId, { hasError, input:value, message: '' })

		this.setState({
			suggestions: getSuggestions ( value, this.props.options )
		})
	}
	onSuggestionsClearRequested () {
		this.setState({
			suggestions: []
		})
	}
    render() {
        const { suggestions } = this.state

		const {
			label, 
			focusColor = "skyblue", 
			helperText = "", 
			hasError,
			value,	
			message,
			placeholder,	
			style      = {},
			onFocus
		} = this.props
		
		const inputProps = {
			placeholder,
			value      ,
			onChange   : this.onChange,
			onBlur     : this.onBlur
		}
        return (
			<TopDiv
			ismedium = {style.medium}
			hasright = {style.mdRight}
			>
				
                <label>{label}</label>
            <Container 
                hasError = {hasError} 
                focusColor = {focusColor} 
                inputSize = {style.width} 
				ismedium = {style.medium}
				hasright = {style.mdRight}
                style     = { style } 
                tab-index = '100' 
                onClick   = { () => onFocus && onFocus() }>
                
				
                <Autosuggest
					suggestions                 = { suggestions }
					onSuggestionsFetchRequested = { this.onSuggestionsFetchRequested }
					onSuggestionsClearRequested = { this.onSuggestionsClearRequested }
					getSuggestionValue          = { getSuggestionValue }
					renderSuggestion            = { renderSuggestion }
					inputProps                  = { inputProps }
					focusInputOnSuggestionClick = {true}
				/>

				<TextMessage hasError={hasError} >{message}</TextMessage>

                <style jsx global>{`
                    
					// Autosuggest
					.react-autosuggest__container {
						position: relative;
						z-index:3;
					}
					.react-autosuggest__container , .react-autosuggest__container input {
						width:97%;
						height:100%;
						background-color: transparent;
					}
					.react-autosuggest__container input{
						border    : none;
						outline   : none;
						box-shadow: none;
						appearance: none;
						padding: 0 0 0 10px
					}				  
					.react-autosuggest__input--focused {
						outline: none;
					}				  
					.react-autosuggest__input--open {
						border-bottom-left-radius: 0;
						border-bottom-right-radius: 0;
					}				  
					.react-autosuggest__suggestions-container {
						display: none;
					}				  
					.react-autosuggest__suggestions-container--open {
						display         : block;
						position        : absolute;
						top             : 50px;
						width           : 100%;
						min-height      : 50px;
						max-height      :150px;
						overflow        : hidden;
						overflow-y      : scroll;
						background-color: #fff;
						font-weight     : 300;
						z-index         : 2;
						box-shadow: 0 0 10px 1px rgba(0,0,0,.05);
					}				  
					{/* .react-autosuggest__suggestions-list {
						margin: 0;
						padding: 0;
						list-style-type: none;
					}				  
					.react-autosuggest__suggestion {
						cursor: pointer;
						padding: 10px 20px;
					}				  
					.react-autosuggest__suggestion--highlighted {
						background-color: orange;
						color:white
					} */}
                `}</style>
            </Container>
			</TopDiv>
        )
    }
};

const TextMessage = styled.p`
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

const TopDiv = styled.div`
	${tw`w-full h-auto mb-4 text-sm`};
    color: ${p => p.theme.textColor};
	${p => p.ismedium ? tw`md:w-sm` : ''};
	${p => p.hasright ? tw`md:ml-sm` : ''};
	background-color: transparent;
	& .react-autosuggest__suggestions-list {
		margin: 0;
		padding: 0;
		list-style-type: none;
		color: ${p => p.theme.textColor};
	}				  
	& .react-autosuggest__suggestion {
		cursor: pointer;
		padding: 10px 20px;
		color: ${p => p.theme.textColor};
		${tw`text-sm font-medium`};
	}				  
	& .react-autosuggest__suggestion--highlighted {
		background-color: ${p => p.theme.secondaryColor};
		color:white;
	}
`;

const Container = styled.div`
    ${tw`relative w-full h-10 mt-3 text-xs border rounded-md focus:outline-none`};
	${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`};
    color: ${p => p.theme.textColor};
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
	background-color: transparent;
`;

const TextPlaceholder = styled.p`
    ${tw`absolute mr-1 text-xs capitalize bg-white left-4 -top-20 z-4`};
    color      : ${props => props.hasError ? 'rgba(255,0,0,.5)': 'inherit' };
	font-weight: ${props => props.hasError ? 'bold'            : 'inherit' };
`;