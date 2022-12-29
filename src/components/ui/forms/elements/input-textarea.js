import React from 'react';
import tw       from 'twin.macro'
import styled   from 'styled-components'
import fastValidation from "@services/helpers/fast-validation";

const TextArea = ({
    variant,  
	label, 
	focusColor    = "skyblue", 
	helperText    = "", 
	disabled      = false,
	disablePaste  = false, 
	inputId, 
	validation    = [],
	formId,
	hasError,
	message,	
	updateText,
	updateState,
	value,
	style,
	onBlur        = false,
	onBlurActions = false,
	formStatus    = {},
	txnData       = {},
    autofocus,
    rows = 4
}) => {
    const handleChangeText = (event) => {
        let input = event.target.value;

        updateText ( inputId, formId, { textInput: input });
    }
    const validateOnBlur = (event) => {
        let input = event.target.value

        for ( let v of validation ){
			
			const { isValid, message = v.error } = fastValidation ( 
				input, 
				v.min || false,
				v.max || false,
				v.error, 
				v.type 
			)

			if ( !isValid ) {
				updateState ( inputId, formId, { hasError: true, input, message: v.error })

				//perform our on blur actions				
				if ( onBlur && onBlurActions && onBlurActions [ onBlur ] ) {
					onBlurActions [ onBlur ]({ ...formStatus, input, inputId,...txnData })
				} 
				
				break
			}
			else {

				//update the form state for this particular input
				updateState ( inputId, formId, { hasError: false, input, message: helperText })

				//perform our on blur actions
				onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input, inputId,...txnData })
			}
		}
    }
    if ( helperText ) {
        message = helperText
    }

    if(variant && variant === 'outlined'){
        return (
            <React.Fragment>
                <Container>
                    <TextField hasError = {hasError} focusColor={focusColor} >
                        <StyledTextArea
                            rows     = { rows }
                            onChange = {handleChangeText}
                            style    = { style }
							onBlur    = {validateOnBlur}
                            value    = { value }
                        />
                        <Placeholder>{label}</Placeholder>
                    </TextField>
    
                    <TextMessage hasError={hasError} >{message}</TextMessage>
    
                </Container>
            </React.Fragment>
        )
    }
    if(variant && variant === 'toplabel'){
        return (
            <React.Fragment>
                <TopContainer isMedium = {style.medium} hasRight = {style.mdRight} >
                    <label tw = "w-full leading-snug" hasError = {hasError} focusColor={focusColor} >
                        <span tw = "block">{label}</span>

                        <TopTextArea
                            rows     = { rows }
                            onChange = {handleChangeText}
                            style    = { style }
                            small    = { style.small }
							onBlur    = {validateOnBlur}
                            hasError = { hasError }
                            value    = { value }
                            disabled  = {disabled}
                        />
                    </label>
    
                    <TextMessage hasError={hasError} >{message}</TextMessage>
    
                </TopContainer>
            </React.Fragment>
        )
    }

    
};

const TopContainer = styled.div`
    ${tw`w-full h-auto mb-4 text-sm`};
    ${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
    color: ${p => p.theme.textColor};
`;

const TopTextArea = styled.textarea`
    ${tw`w-full h-40 pl-2 mt-3 text-sm border rounded-md focus:outline-none active:outline-none`};
    ${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`}
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
    ${p => p.small ? tw`h-20` : tw`h-40`};
    background: transparent;
`;

const Container = styled.div`
    ${tw`relative flex flex-col w-full mb-5 text-xs`};
    min-height: 200px;
`;

const TextField = styled.label`
    ${tw`relative inline-block w-full leading-none`};
`;

const Placeholder = styled.p`
    ${tw`absolute left-0 ml-5 capitalize -translate-y-1/2 top-1/2 z-2`};
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
	font-weight: ${props => props.hasError ? 'bold'            : 'inherit' };
`;

const StyledTextArea = styled.textarea`
    ${tw`absolute w-full h-40 px-4 py-2 font-serif rounded outline-none focus:outline-none`};
    border       : ${ props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}` };
    & :focus-within {
        border: 2px solid ${props=> props.hasError ? `2px solid ${props.theme.dangerColor}` : props.theme.focusColor};
    };
    &:focus ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs bg-white -top-2`};
    }
    &:disabled ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs bg-white -top-4`};
    };
    &:valid ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs bg-white -top-2`};
    };
`;

const TextMessage = styled.p`
    ${tw`pt-1`};
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

export default TextArea;