import React, { useRef } from 'react';
import fastValidation from "@services/helpers/fast-validation";
import styled from 'styled-components';
import tw from 'twin.macro';
import { CloudUploadOutlined } from '@ant-design/icons';


const FileInput = ({
    variant,  
	type, 
	label, 
	focusColor = "skyblue", 
	helperText = "", 
	validation = [],
	disabled = false, 
	inputId = [], 
	formId,
	hasError,
	message,	
	updateState,
	updateText,
	value,
	style,
	presentment = false,
	autofocus,
	accept,
    maxFiles,
    maxSize = 20
}) => {
    const inputRef  = useRef(null)

	//validation
	const validateOnChange = ( e ) =>{

        // let arraFiles = {...e.target.files}
        // delete arraFiles['length']
        // arraFiles = Object.values(arraFiles)
        // console.log(e.target.files, {arraFiles: Object.values(arraFiles)})
        
        //for (let i of arraFiles) {
            let input    = e.target.files[0]
            let fileType = input ? input.type : false
            let fileSize = input ? `${parseFloat (input.size/(1024 *1024)).toFixed(2)}` : false //MB
            let fileName = input ? input.name : false
    
            let files = value && value ? [ ...value] : []
    
            //console.log({input, fileType, files})
            let fileExists = false
            let fileWithinSize = fileSize ? fileSize < maxSize : false
            fileExists = files.find(e => e.name === fileName)
            
            if(fileExists){
                updateState( inputId, formId, { hasError: false, input: files, message: `File exists (${fileName})` })
            }
            if(input && !fileWithinSize){
                updateState( inputId, formId, { hasError: false, input: files, message: `File exceeds limit (${maxSize} MB)` })
            }
            if(!input){
                updateState( inputId, formId, { hasError: false, input: files, message: `Please select a file` })
            }
    
            if(fileType && !fileExists && fileWithinSize && files.length < maxFiles){
                
                files = [...files, input]
                for ( let v of validation ){
                
                    const { isValid, message = v.error } = fastValidation ( 
                        fileName, 
                        v.accept || false,
                        v.max || false,
                        v.error,
                        v.type
                    )
        
                    if ( !isValid ) {
                        updateState ( inputId, formId, { hasError: true, input: files, message: `Invalid type ${fileType} (${fileName})` })
                        break
                    }
                    else {
                        updateState ( inputId, formId, { hasError: false, input: files, message: `` })				
                    }
                }
            }else if(files.length === maxFiles){
                updateState ( inputId, formId, { hasError: false, input: files, message: `Maximum files ${maxFiles}` })
            }
            else if(files.length < 1 && fileWithinSize){
                updateState ( inputId, formId, { hasError: true, input: files, message: `Please select a valid file` })
            }
        //}

		
	}
	const focusInput = () => {
		inputRef.current.focus();
	}
    const removeFile = (removeFile) => {
        let files = [ ...value]
        files = files.filter(e => e.name !== removeFile.name)
        updateState ( inputId, formId, { hasError: false, input: files, message: `` })
    }
	
    return (
        <>
        <TopWrapper tw = "flex flex-col" widthAuto = {style.widthAuto} isMedium = {style.medium} hasRight = {style.mdRight}>
            
            <span tw = "block font-bold tracking-wide text-xs mb-1">{helperText}</span>

            <TopTextField hasError = {hasError} focusColor = {focusColor} isMedium = {style.medium} hasRight = {style.mdRight} >
        
                <Placeholder htmlFor = {inputId} hasError = {hasError} onClick = { focusInput } >
                
                <Message hasError = {hasError} tw = "opacity-90">
                    <CloudUploadOutlined theme="filled"  style={{ fontSize: '24px', color: 'inherit' }}/>
                </Message>

                <div tw = "flex flex-row text-center">
                    <TopLabel>
                        <span tw = "font-semibold text-center" dangerouslySetInnerHTML = {{ __html : label}} ></span>
                        

                        {
                            hasError && <span tw = "font-semibold block text-center text-danger" dangerouslySetInnerHTML = {{ __html : message}} ></span>
                        }
                    </TopLabel>
                    {/* <span class="text-red-500 required-dot ml-2">
                        *
                    </span> */}
                </div>

                
                    
                </Placeholder>
    
                <LabelInput
                    ref       = { inputRef }
                    autoFocus = { autofocus ? true: false }
                    type      = { 'file' }
                    disabled  = { disabled }
                    onChange  = { e => validateOnChange ( e ) } //add an onChange handler								
                    // value     = { value }
                    hasError = {hasError}
                    accept    = { accept }
                    id = {inputId}
                    required
                    //multiple
                />
            </TopTextField>
        </TopWrapper>
        <div tw = "flex flex-col pl-5 pt-3">
            {
                value && value.map((item, index) => (
                        <Message key = {index} hasError = {hasError} tw = "font-semibold leading-tight text-center">
                            {item.name}
                            <span tw = "pl-3 font-bold cursor-pointer" onClick = {()=> removeFile(item)}>X</span>
                        </Message>
                ))
            }
        </div>
        </>
    )
    
};

const TopLabel = styled.p`
    ${tw`text-sm`};
    color: ${p => p.theme.textColor};
`;

const TopWrapper = styled.div`
	${tw`justify-center w-full mb-5`};
	${p => p.widthAuto ? tw`w-auto` : ''};
`;

const Placeholder = styled.label`
    ${tw`absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full py-4`};
    color      : ${ props => props.hasError ? 'rgba(255,0,0,.5)': 'inherit' };
	font-weight: ${ props => props.hasError ? 'bold'            : 'inherit' };
`;

const TopTextField = styled.div`
    ${tw`relative inline-block text-xs leading-none border border-dashed rounded-lg cursor-pointer h-36 w-52`};
    color: ${p => p.theme.textColor};
    border       : ${ props => props.hasError ? '2px solid rgba(255,0,0,.5)' : '1px solid rgba(0,0,0,.1)' };
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