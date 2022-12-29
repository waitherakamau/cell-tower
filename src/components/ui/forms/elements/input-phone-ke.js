import PhoneInput       from 'react-phone-input-2';
import fastValidation   from "@services/helpers/fast-validation";
import styled           from 'styled-components';
import React 				from 'react';
import tw               from 'twin.macro';
import 'react-phone-input-2/lib/style.css';

export default class InputPhone extends React.Component {
    constructor(props) {
        super(props)
        
        this.onChange        = this.onChange.bind ( this )
        this.validateOnBlur  = this.validateOnBlur.bind ( this )
	}
	async onChange( value ){
		const {
			inputId, 
			formId,
            updateText
		} = this.props

        updateText ( inputId, formId, { textInput: value })
        
    }
	validateOnBlur ( e ){
        const {
			inputId, 
			formId,
            helperText,
            updateState,
            onBlur,
            onBlurActions,
            formStatus,
            txnData
		} = this.props

        let input = `${e.target.value.replace(/[^0-9]/g,'')}`
        const { isValid, message = "" } = fastValidation (`+${input}`, false, false, "Invalid Phone Number", "isDiasporaPhoneNumber")

        if ( !isValid ) {
            updateState (inputId, formId, { hasError: true, input, message: "Invalid Phone Number" })
        }
        else {
            updateState (inputId, formId, { hasError: false, input, message: helperText })	
            //perform our on blur actions
			onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input, inputId, ...txnData })			
        }
	}
	componentDidMount () {
		const {
            inputId,
            value, 
			formId,
			updateText
		} = this.props

		updateText (inputId, formId, { textInput: value })
	}
    render() {
        let { value, inputId } = this.props
		const {
			label, 
			focusColor = "skyblue", 
			helperText = "", 
			hasError,	
			style      = {},
			onFocus,
            message,
            variant
		} = this.props
		
        if(variant && variant === 'outlined'){
            return (
                <Container hasError = {hasError} focusColor = {focusColor} isMedium = {style.medium} hasRight = {style.mdRight} >
                    <PhoneInput 
                        country            = {'ke'} 
                        onChange           = { this.onChange } 
                        value              = { value }
                        id                 = {inputId}
                        onBlur             = { this.validateOnBlur   } 
                        inputProps         = {{
                            enableSearch   : true
                        }}
                        preferredCountries = {['ke','tz','ug', 'uk','us']}
                        enableSearch       = { true }
                    />
                    <Label htmlFor = {inputId} tw = "absolute top-0 px-2 -mt-3 rounded left-3">{label}</Label>

                    <TextMessage hasError={hasError} >{message}</TextMessage>
                </Container>
            )
        }

        if(variant && variant === 'toplabel'){
            return (
                <TopLabel hasError = {hasError} isMedium = {style.medium} hasRight = {style.mdRight}>{label}
                    <PhoneInput 
                        country            = {'ke'} 
                        onChange           = { this.onChange } 
                        value              = { value }
                        id                 = {inputId}
                        onBlur             = { this.validateOnBlur   } 
                        inputProps         = {{
                            enableSearch   : false
                        }}
                        preferredCountries = {['ke']}
                        onlyCountries      = {['ke']}
                        enableSearch       = { false }
                        disableDropdown    = {true}
                    />

                    <TextMessage tw = "pt-0" hasError={hasError} >{message}</TextMessage>
                </TopLabel>
            )
        }
        
    }
};

const TopLabel = styled.label`
    ${tw`w-full h-auto mb-4 text-sm`};
    ${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
    color: ${p => p.theme.textColor};

    /* add check  for outlined */
    .react-tel-input {
        ${tw`w-full mt-3 text-xs border rounded-md h-9`};
        border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
        box-shadow:none;
        font-size: 12px;
        background: transparent;
    }   
    .react-tel-input .flag-dropdown {
        border: none;
        background:transparent;
    }                    
    .react-tel-input .form-control {
        height: 100%;
        width: 100%;
        border: none;
        background: transparent;
        ${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`};
    }
    .react-tel-input .country-list {
        padding: 0px 15px;
    }
    .react-tel-input .country-list .search-box {
        text-transform: capitalize;
        border: none;
        font-size: 12px;
        border-bottom: 1px solid #cacaca;
    }
    .react-tel-input .country-list .search-emoji {
        display: none;
    };
`;

const TextMessage = styled.p`
    ${tw`pt-7`};
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

const Label = styled.label`
    background: ${p => p.theme.themeColor};
`;

const Container = styled.div`
    ${tw`relative w-full pt-3 pl-4 mb-5 rounded-md h-11`};
    border     : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}`};
    & :focus-within {
        border: 2px solid ${props=> props.hasError ? `${props.theme.dangerColor}` : props.theme.focusColor};
    };
    width: ${props => props.inputSize || "100%"};
    background: transparent;
    ${p => p.isMedium ? tw`md:w-md` : ''};
    ${p => p.hasRight ? tw`md:ml-md` : ''};

    .react-tel-input {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        box-shadow:none;
        font-size: 12px;
        background: transparent;
    }                    
    .react-tel-input .flag-dropdown {
        border: none;
        background:transparent;
    }                    
    .react-tel-input .form-control {
        height: 100%;
        width: 100%;
        border: none;
        box-shadow:none;
        background: transparent;
    }
    .react-tel-input .country-list {
        padding: 0px 15px;
    }
    .react-tel-input .country-list .search-box {
        text-transform: capitalize;
        border: none;
        font-size: 12px;
        border-bottom: 1px solid #cacaca;
    }
    .react-tel-input .country-list .search-emoji {
        display: none;
    };
`;