import React, { useRef } from 'react';
import fastValidation from "@services/helpers/fast-validation";
import { AiOutlineFile } from 'react-icons/ai';
import styled from 'styled-components';
import tw from 'twin.macro';
import { PaperClipOutlined } from '@ant-design/icons';


const FileInput = ({
    variant,  
	type, 
	label, 
	focusColor = "skyblue", 
	helperText = "", 
	validation = [],
	disabled = false, 
	inputId, 
	formId,
	hasError,
	message,	
	updateState,
	updateText,
	value,
	style,
	presentment = false,
	autofocus,
	accept
}) => {
    const inputRef  = useRef(null)

	//validation
	const validateOnChange = ( e ) =>{

		let input    = e.target.files[0]
		let fileType = input ? input.type : false
		let fileSize = `${ parseFloat (input.size/(1024 *1024)).toFixed(2)} MB`
		let fileName = input ? input.name : false

		if(fileType){
			for ( let v of validation ){
			
				const { isValid, message = v.error } = fastValidation ( 
					fileType, 
					v.min || false,
					v.max || false,
					v.error,
					v.type
				)
	
				if ( !isValid ) {
					updateState ( inputId, formId, { hasError: true, input:"", message: `Invalid type ${fileType} (${fileName})` })
					break
				}
				else {
					updateState ( inputId, formId, { hasError: false, input, message: `${fileName} - size: ${fileSize}` })				
				}
			}
		}else{
			updateState ( inputId, formId, { hasError: true, input:"", message: `Please select a valid file` })
		}
	}
	const focusInput = () => {
		inputRef.current.focus();
	}
	if(variant && variant === 'outlined'){
		return (
			<TextField hasError = {hasError} focusColor = {focusColor}>
				<Placeholder hasError = {hasError} onClick = { focusInput } >
					<div tw = "ml-5">
						<AiOutlineFile style = {{ color: hasError ?'red': 'green', fontSize:20 }} />
					</div>
					<Message
					dangerouslySetInnerHTML = {{ __html : message}}
					/>
				</Placeholder>
	
				<TextInput
					ref       = { inputRef }
					autoFocus = { autofocus ? true: false }
					type      = { type }
					disabled  = { disabled }
					onChange  = { e => validateOnChange ( e ) } //add an onChange handler								
					// value     = { value }
					accept    = { accept }
					required
				/>
			</TextField>
		)
	}

	if(variant && variant === 'toplabel'){ 
		return (
			<TopWrapper tw = "flex flex-col" isMedium = {style.medium} hasRight = {style.mdRight}>
				<p tw = "flex flex-row mb-4">
					<TopLabel>{label}</TopLabel>
					{/* <span class="text-red-500 required-dot ml-2">
						*
					</span> */}
				</p>

				<TopTextField hasError = {hasError} focusColor = {focusColor} isMedium = {style.medium} hasRight = {style.mdRight} >
			
					<Placeholder tw = "justify-between px-2" for = {inputId} hasError = {hasError} onClick = { focusInput } >
						
						<Message hasError = {hasError}>{message}</Message>
						<Message hasError = {hasError} tw = "pb-1 opacity-90">
							<PaperClipOutlined style={{ fontSize: '18px', color: 'inherit' }}/>
						</Message>
					</Placeholder>
		
					<LabelInput
						ref       = { inputRef }
						autoFocus = { autofocus ? true: false }
						type      = { type }
						disabled  = { disabled }
						onChange  = { e => validateOnChange ( e ) } //add an onChange handler								
						// value     = { value }
						hasError = {hasError}
						accept    = { accept }
						id = {inputId}
						required
					/>
				</TopTextField>
			</TopWrapper>
		)
	}
    
};

const TopLabel = styled.p`
    ${tw`text-sm`};
    color: ${p => p.theme.textColor};
`;

const TopWrapper = styled.div`
	${tw`w-full`}
	${p => p.isMedium ? tw`md:w-sm` : ''};
    ${p => p.hasRight ? tw`md:ml-sm` : ''};
`;

const Placeholder = styled.label`
    ${tw`absolute top-0 left-0 flex flex-row items-center w-full h-full`};
    color      : ${ props => props.hasError ? 'rgba(255,0,0,.5)': 'inherit' };
	font-weight: ${ props => props.hasError ? 'bold'            : 'inherit' };
`;

const TopTextField = styled.div`
    ${tw`relative inline-block w-full text-xs leading-none border rounded-md cursor-pointer h-9`};
    color: ${p => p.theme.textColor};
	border-color: ${p => p.hasError ? p.theme.dangerColor : p.theme.borderColor};
	${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`};
`;

const LabelInput = styled.input`
    ${tw`w-full h-full pl-3 text-transparent outline-none opacity-0`};
	background: transparent;
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

const TextField = styled.div`
    ${tw`relative inline-block w-full text-xs leading-none rounded-md cursor-pointer h-9`};
	border: 2px solid ${props=> props.hasError ? `2px solid ${props.theme.dangerColor}` : props.theme.borderColor};
    & :focus-within {
        border: 2px solid ${props=> props.hasError ? `2px solid ${props.theme.dangerColor}` : props.theme.focusColor};
    };
`;

const Message = styled.p`
    color: ${ props => props.hasError ? props.theme.dangerColor : props.theme.textColor };
`;

const TextInput = styled.input`
    ${tw`absolute w-full h-full pl-3 text-transparent rounded outline-none opacity-0`};
	background: transparent;
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

export default FileInput;