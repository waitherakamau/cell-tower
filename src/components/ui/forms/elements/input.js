import React, { useRef, useState, useEffect } from 'react';
import fastValidation from "@services/helpers/fast-validation";
import { BsSquare, BsCheckCircle } from 'react-icons/bs';
import styled from 'styled-components';
import tw from 'twin.macro';

const Input = ({
    variant, 
    simpleInput, 
	type = 'text', 
	label, 
	focusColor    = "skyblue", 
	helperText    = "", 
	validation    = [],
	disabled      = false,
	disablePaste  = false, 
	inputId, 
	formId,
	hasError,
	message,	
	updateState,
	updateText,
	value,
	style = {},
	onBlur        = false,
	onBlurActions = false,
	formStatus    = {},
	txnData       = {},
	autofocus,
    showMeter,
    digitsOnly   = false
})=> {
    const inputRef = useRef(null)
    //const numberRef = useRef(null)

    //password meter state
	const [hasUpperCase, setUppercase]    	= useState(false)
	const [hasLowerCase, setLowercase]    	= useState(false)
	const [hasNumber, setNumber]          	= useState(false)
	const [isLongEnough, setisLongEnough] 	= useState(false)
    const [hasSpecial, setSpecialCharacter] = useState(false)
    
    useEffect (()=>{
		if ( disablePaste ) {
			inputRef.current.onpaste = e => {
				e.preventDefault();
				return false;
			}
		}

	},[])

    const focusInput = () => {
        inputRef.current.focus();
    }
    const validateOnEnter = (event) => {
        let input = event.target.value

        if(event.keyCode === 13){
            for ( let v of validation ){

				const { isValid, message = `Invalid ${label}` } = fastValidation ( 
					input, 
					v.min || false,
					v.max || false,
					v.error, 
					v.type ,
                    v.expression
				)

				if ( !isValid ) {
					updateState ( inputId, formId, { hasError: true, input, message: `Invalid ${label}` })
					break
				}
			}
        }
    }
    const handleChangeText = (event) => {
        let input = event.target.value

        if(digitsOnly){
            input = input.replace(/[^0-9]/g, '')
        }
        
        updateText(inputId, formId, { textInput: input })
        
        if(type === 'password' && showMeter){
            let checkUppercase = input.replace(/[^A-Z]/g,'').length > 0 
			let checkLowercase = input.replace(/[^a-z]/g,'').length > 0 
			let checkNumber    = input.replace(/[^0-9]/g,'').length > 0 
			let checkLength    = input.length > 7
			let checkSpecial   = input.replace(/[a-zA-Z0-9]/g,'').length > 0 

			checkUppercase && setUppercase(true)
			checkLowercase && setLowercase(true)
			checkNumber    && setNumber(true)
			checkLength    && setisLongEnough(true)
			checkSpecial   && setSpecialCharacter(true)

			!checkUppercase && setUppercase(false)
			!checkLowercase && setLowercase(false)
			!checkNumber    && setNumber(false)
			!checkLength    && setisLongEnough(false)
			!checkSpecial   && setSpecialCharacter(false)
        }
    }
    const validateOnBlur = (event) => {
        let input = event.target.value

        for ( let v of validation ){
			
			const { isValid, message = v.error } = fastValidation ( 
				input, 
				v.min || false,
				v.max || false,
				v.error, 
				v.type ,
                v.expression
			)

			if ( !isValid ) {
				updateState ( inputId, formId, { hasError: true, input, message: v.error })

				//perform our on blur actions				
				// if ( onBlur && onBlurActions && onBlurActions [ onBlur ] ) {
				// 	onBlurActions [ onBlur ]({ ...formStatus, input, inputId,...txnData })
				// } 
				
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

    //outlined input
    if(variant && variant === 'outlined'){
        //Text, password, email
        if(["text", "password", "email"].includes(type)){
            if(helperText){
                message = helperText
            }

            return (
                    <Container ismedium = {style.medium} hasright = {style.mdRight}>
                        <TextField hasError={hasError} focusColor={focusColor}>
                            <TextInput
                                id        = {inputId}
                                ref       = {inputRef}
								autoFocus = {autofocus ? true: false }
								type      = {type}
								disabled  = {disabled}
								onBlur    = {validateOnBlur}
								onKeyUp   = {validateOnEnter}
								onChange  = {handleChangeText}
								value     = {value}
								required
                            />

                            <TextPlaceholder htmlFor = {inputId} onClick = {focusInput} hasError = {hasError} >{label}</TextPlaceholder>
                        </TextField>

                        <TextMessage hasError={hasError} >{message}</TextMessage>

                        {
                            type === 'password' && showMeter && (
                                <PasswordMeter>
                                    <p>
                                        <span tw = "ml-2 font-bold" >Password Strength</span>
                                    </p>
                                    <PasswordRule rulePassed = {hasUpperCase} >
                                        <BsCheckCircle icon = { hasUpperCase ? 'check' : 'square-o' } style = {{ fontSize:10}}/>
                                        <span tw = "ml-2" >Contains an Uppercase Letter</span>
                                    </PasswordRule>
                                    <PasswordRule rulePassed = {hasLowerCase} >
                                        <BsCheckCircle icon = { hasLowerCase ? 'check' : 'square-o' } style = {{ fontSize:10}}/>
                                        <span tw = "ml-2" >Contains a lowercase Letter</span>
                                    </PasswordRule>
                                    <PasswordRule rulePassed = {hasNumber} >
                                        <BsSquare icon = { hasNumber ? 'check' : 'square-o' } style = {{ fontSize:10}}/>
                                        <span tw = "ml-1" >Contains a Number</span>
                                    </PasswordRule>
                                    <PasswordRule rulePassed = {isLongEnough} >
                                        <BsSquare icon = { isLongEnough ? 'check' : 'square-o' } style = {{ fontSize:10}}/>
                                        <span tw = "ml-2" >Is at least 8 Characters in length</span>
                                    </PasswordRule>
                                    <PasswordRule rulePassed = {hasSpecial} >
                                        <BsSquare icon = { hasSpecial ? 'check' : 'square-o' } style = {{ fontSize:10}}/>
                                        <span tw = "ml-1" >Include a Special Character</span>
                                    </PasswordRule>
                                </PasswordMeter>
                            )
                        }
                    </Container>
            )
        }
    }

    //top labelled input
    if(variant && variant === 'toplabel'){
        //Text, password, email
        if(["text", "password", "email"].includes(type)){
            if(helperText){
                message = helperText
            }

            return (
                <TopLabel hasError = {hasError} ismedium = {style.medium} hasright = {style.mdRight} >
                    {label}
                    <LabelInput
                    id        = {inputId}
                    ref       = {inputRef}
                    autoFocus = {autofocus ? true: false }
                    type      = {type}
                    disabled  = {disabled}
                    onBlur    = {validateOnBlur}
                    onKeyUp   = {validateOnEnter}
                    onChange  = {handleChangeText}
                    value     = {value}
                    required
                    hasError = {hasError}
                    />

                    <TextMessage hasError={hasError} >{message}</TextMessage>
                </TopLabel>
            )
        }
    }

    //inline labelled input
    if(variant && variant === 'inlinelabel'){
        
        if(helperText){
            message = helperText
        }

        return (
            <>
                <InlineDiv hasError = {hasError} ismedium = {style.medium} hasright = {style.mdRight} bgcolor = {style.bgColor || '#FFFFFF' } txtcolor = {style.txtColor || '#282828' } >
                    <label tw='pl-2 pr-1 font-semibold' htmlFor={inputId} >{label}</label>
                    <InlineInput
                        id        = {inputId}
                        ref       = {inputRef}
                        autoFocus = {autofocus ? true : false }
                        type      = {type}
                        disabled  = {disabled}
                        onBlur    = {validateOnBlur}
                        onKeyUp   = {validateOnEnter}
                        onChange  = {handleChangeText}
                        value     = {value}
                        required
                        hasError = {hasError}
                    />
                </InlineDiv>

                <TextMessage hasError={hasError} >{message}</TextMessage>
            </>
        )
    }

    //border bottom label as placeholder
    if(variant && variant === 'underlined'){
        //Text, password, email
        if(["text", "password", "email"].includes(type)){
            if(helperText){
                message = helperText
            }

            return (
                <>
                    <UnderlinedInput
                    id        = {inputId}
                    ref       = {inputRef}
                    autoFocus = {autofocus ? true: false }
                    type      = {type}
                    disabled  = {disabled}
                    onBlur    = {validateOnBlur}
                    onKeyUp   = {validateOnEnter}
                    onChange  = {handleChangeText}
                    value     = {value}
                    required
                    hasError = {hasError}
                    placeholder = {label}
                    ismedium = {style.medium} 
                    hasright = {style.mdRight}
                    />

                    <TextMessage hasError={hasError} >{message}</TextMessage>
                </>
            )
        }
    }
    if(simpleInput){
        //Text, password, email
        if(["text", "password", "email"].includes(type)){
            if(helperText){
                message = helperText
            }

            return (
                <TopLabel hasError = {hasError} ismedium = {style.medium} hasright = {style.mdRight} >{label}
                    <LabelInput
                    id        = {inputId}
                    ref       = {inputRef}
                    autoFocus = {autofocus ? true: false }
                    type      = {type}
                    disabled  = {disabled}
                    onBlur    = {validateOnBlur}
                    onKeyUp   = {validateOnEnter}
                    onChange  = {handleChangeText}
                    value     = {value}
                    required
                    hasError = {hasError}
                    />

                    <TextMessage hasError={hasError} >{message}</TextMessage>
                </TopLabel>
            )
        }
    }
};

const UnderlinedInput = styled.input`
    ${tw`w-full pl-2 mt-3 text-xs border-b-2 h-9 focus:outline-none active:outline-none focus:border-primary-100`};
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
    background: transparent;
`;

const InlineDiv = styled.div`
    ${tw`w-full h-12 flex items-center justify-start mt-5 text-sm border rounded-lg lg:(h-12 text-base)`};
    ${p => p.ismedium ? tw`md:w-sm` : ''};
    ${p => p.hasright ? tw`md:ml-sm` : ''};
    ${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`}
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
    background-color: ${p => p.bgcolor};
    color: ${p => p.txtcolor};
`;

const InlineInput = styled.input`
    ${tw`flex-1 h-full pl-2 rounded-md focus:outline-none active:outline-none`};
    background: transparent;
`;

const TopLabel = styled.label`
    ${tw`w-full h-auto mb-4 text-sm`};
    ${p => p.ismedium ? tw`md:w-sm` : ''};
    ${p => p.hasright ? tw`md:ml-sm` : ''};
    color: ${p => p.theme.textColor};
`;

const LabelInput = styled.input`
    ${tw`w-full pl-2 mt-3 text-xs border rounded-md h-9 focus:outline-none active:outline-none`};
    ${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`}
    border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
    background: transparent;
    cursor: ${props => props.disabled ? 'not-allowed' : ''} ;
`;

const Container = styled.div`
    ${tw`relative flex flex-col w-full h-auto mb-5`};
    ${p => p.ismedium ? tw`md:w-sm` : ''};
    ${p => p.hasright ? tw`md:ml-sm` : ''};
     /* @media only screen and (min-width: 640px) {
		${p => p.inputStyle ? { ...p.inputStyle } : ''};
	}; */
`;

const TextMessage = styled.p`
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

const TextPlaceholder = styled.label`
    ${tw`absolute left-0 ml-3 capitalize top-2.5`};
    color      : ${props => props.hasError ? props.theme.dangerColor: 'inherit' };
	font-weight: ${props => props.hasError ? 'bold'            : 'inherit' };
`;

const TextInput = styled.input`
    ${tw`absolute w-full h-full pl-2 border-none rounded outline-none focus:outline-none active:outline-none`};
    color      : ${props => props.hasError ? props.theme.dangerColor : 'inherit' };
	font-weight: ${props => props.hasError ? 'bold'            : 'inherit' };
    background: transparent;
    &:focus ~ ${TextPlaceholder} {
        ${tw`h-4 px-1 text-xs font-bold rounded -top-3`};
        background: ${p => p.theme.themeColor};
    }
    &:disabled ~ ${TextPlaceholder} {
        ${tw`h-4 px-1 text-xs font-bold rounded -top-3`};
        background: ${p => p.theme.themeColor};
    };
    &:valid ~ ${TextPlaceholder} {
        ${tw`h-4 px-1 text-xs font-bold rounded -top-3`};
        background: ${p => p.theme.themeColor};
    };
`;

const TextField = styled.div`
    ${tw`relative inline-block w-auto text-xs rounded-md h-11`};
    border       : ${ props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}` };
    & :focus-within {
        border: 2px solid ${props=> props.hasError ? `2px solid ${props.theme.dangerColor}` : props.theme.focusColor};
    };
`;

const PasswordMeter = styled.div`
    ${tw`absolute block w-auto h-auto py-1 pl-2 text-xs leading-none tracking-tight rounded shadow-sm pr-7 -right-9 -top-6`};
    background: ${p => p.theme.themeColor};
`;

const PasswordRule = styled.li`
    ${props => props.rulePassed ? tw`line-through list-none` : tw`list-none`};
    color: ${props => props.rulePassed ? props.theme.successColor : props.theme.focusColor};
`;

export default Input