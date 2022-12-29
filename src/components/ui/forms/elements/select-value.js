import fastValidation from "@services/helpers/fast-validation";
import { IoMdArrowDropdown } from 'react-icons/io';
import styled from 'styled-components';
import tw from 'twin.macro';
import React 				from 'react';

class Select extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showOptionList: false,
            optionsList: [],
            inputVal: ""
        }
        this.handleClickOutside = this.handleClickOutside.bind(this)
		this.handleListDisplay  = this.handleListDisplay.bind(this)
		this.handleOptionClick  = this.handleOptionClick.bind(this)   
        this.handleChangeText   = this.handleChangeText.bind(this)
        
        this.selectRef = React.createRef();
    }
    async componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside)
        this.setState({
			selectValue: this.props.defaultText
		})

        const { optionsList, value } = this.props
        if(value){
			let dataExists     = optionsList.find ( e => e.value === value )
			this.setState({ inputVal: dataExists?.name || "" })
		}
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside)
    }
    async handleClickOutside(e) {
        if(!e.target.classList.contains("custom-select-option") && 
            !e.target.classList.contains("selected-text")
        ){

            

            this.setState({
				showOptionList: false
			})
        }
    }
    async handleListDisplay() {
		this.setState ({
            showOptionList: !this.state.showOptionList
        })
    }
    async handleOptionClick(e, index) {
        const { 
			updateText, 
			inputId, 
			formId,
			helperText, 
			updateState, 	
			onBlur        = false,
			onBlurActions = false,
			formStatus    = {},
			txnData       = {},
        } = this.props
        
        let input =   e.target.getAttribute ( "data-name" )
        let inputVal =   e.target.getAttribute ( "data-val" )
		updateText  ( inputId, formId, { textInput: inputVal })
        updateState ( inputId, formId, { hasError: false ,input: inputVal, message: helperText })
        
        onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input: inputVal, inputIndex: index, inputId, ...txnData })

		this.setState({
			showOptionList   : false,
            inputVal: input
		})
    }
    handleChangeText() {}
    render() {
        const { optionsList, focusColor, label, inputId, message, hasError, value, style, variant } = this.props
        const { showOptionList, inputVal } = this.state

        if(!variant || variant === 'outlined'){
            return (
                <Container ismedium = {style.medium} hasright = {style.mdRight}>
                    <div tw = "flex flex-col h-auto w-full" >
                        <InputWrapper hasError = {hasError} focusColor = {focusColor} >
                            <Input
                                onClick  = { this.handleListDisplay }
                                type     = { "text" }	
                                id       = {inputId}
                                onFocus  = { this.handleListDisplay }
                                onChange = { this.handleChangeText }				hasError = {hasError}
                                value    = { inputVal  }
                                required
                            />
                            <Placeholder htmlFor = {inputId} onClick  = { this.handleListDisplay } hasError = {hasError} >{label}</Placeholder>
    
                            <div tw = "absolute right-2 bottom-1/3 translate-y-2/4" onClick  = { this.handleListDisplay }>
                                <IoMdArrowDropdown className="text-lg"/>
                            </div>
                        </InputWrapper>
                            <Statustext hasError = {hasError} > {message} </Statustext>
                    </div>
                    {
                        showOptionList && (
                            <SelectOption  >
                                {
                                    optionsList.map((option, index) => {
                                        return <Selectlist
                                            className = "custom-select-option"
                                            data-name = { option.name }
                                            data-val  = { option.value }
                                            key       = { option.id } 
                                            onClick   = { e => this.handleOptionClick(e, index) } >
                                                { option.name }
                                            </Selectlist>
                                    })
                                }
                            </SelectOption>
                        )
                    }
                </Container>
            )
        }

        if(variant && variant === 'toplabel'){
            return (
                <Container ismedium = {style.medium} hasright = {style.mdRight}>
                    <TopLabel tw = "text-sm">{label}</TopLabel>
                    <div tw = "flex flex-col h-auto w-full mt-3" >
                        <TopInputWrapper hasError = {hasError} focusColor = {focusColor} >
                            <TopLabelInput
                                onClick  = { this.handleListDisplay }
                                type     = { "text" }
                                hasError = {hasError}
                                onFocus  = { this.handleListDisplay }
                                onChange = { this.handleChangeText }
                                value    = { inputVal  }
                                required
                            />
    
                            <div tw = "absolute right-2 bottom-1/2 translate-y-2/4" onClick  = { this.handleListDisplay }>
                                <IoMdArrowDropdown className="text-lg"/>
                            </div>
                        </TopInputWrapper>
                            <Statustext tw = "md:text-sm" hasError = {hasError} > {message} </Statustext>
                    </div>
                    {
                        showOptionList && (
                            <SelectOption tw = "top-11"  >
                                {
                                    optionsList.map((option, index) => {
                                        return <Selectlist
                                            className = "custom-select-option"
                                            data-name = { option.name }
                                            data-val  = { option.value }
                                            key       = { option.id } 
                                            onClick   = { e => this.handleOptionClick(e, index) } >
                                                { option.name }
                                            </Selectlist>
                                    })
                                }
                            </SelectOption>
                        )
                    }
                </Container>
            )
        }
        
    }
};

const TopLabel = styled.label`
    color: ${p => p.theme.textColor};
`;

const Selectlist = styled.li`
    ${tw`py-2 pl-3 pr-5 list-none text-sm font-medium tracking-wide leading-relaxed cursor-pointer hover:(bg-secondary-200 text-white)`};
`;

const Container = styled.div`
    ${tw`relative inline-block w-full mb-4 text-xs text-left`};
    ${p => p.ismedium ? tw`md:w-sm` : ''};
    ${p => p.hasright ? tw`md:ml-sm` : ''};
`;

const TopInputWrapper = styled.div`
    ${tw`relative inline-block w-full leading-none rounded-md h-9`};
`;

const InputWrapper = styled.div`
    ${tw`relative inline-block w-full leading-none rounded-md h-11`};
`;

const Placeholder = styled.label`
    ${tw`absolute left-0 ml-2 text-xs capitalize top-3`};
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
	font-weight: ${p => p.hasError ? 'bold'            : 'inherit' };
`;

const TopLabelInput = styled.input`
    ${tw`absolute w-full h-full pl-3 border rounded outline-none cursor-default`};
    background: transparent;
    ${p => p.hasError ? tw`focus:border-0 focus:ring ring-warning ring-opacity-70` : tw`focus:border-0 focus:ring ring-primary-100 ring-opacity-40`};
	border-color     : ${props => props.hasError ? props.theme.dangerColor : props.theme.borderColor};
    & :focus-within {
        border-color     : ${props => props.hasError ? props.theme.dangerColor : props.theme.borderColor};
    };
    & :focus ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs font-bold rounded -top-3`};
        background: ${p => p.theme.themeColor};
    };
    & :valid ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs rounded -top-3`};
        background: ${p => p.theme.themeColor};
    };
`;

const Input = styled.input`
    ${tw`absolute w-full h-full pl-3 border rounded outline-none cursor-default`};
    background: transparent;
	border     : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `2px solid ${props.theme.borderColor}`};
    & :focus-within {
        border: 2px solid ${props=> props.hasError ? `${props.theme.dangerColor}` : props.theme.focusColor};
    };
    & :focus ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs font-bold rounded -top-3`};
        background: ${p => p.theme.themeColor};
    };
    & :valid ~ ${Placeholder} {
        ${tw`h-4 px-1 text-xs rounded -top-3`};
        background: ${p => p.theme.themeColor};
    };
`;

const Statustext = styled.p`
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

const SelectOption = styled.ul`
    ${tw`absolute w-full pt-4 pb-2 overflow-y-scroll text-left transition duration-500 ease-in rounded shadow top-1 z-1 min-h-14 max-h-52 border`};
    background: ${p => p.theme.bgColor};
    ::-webkit-scrollbar {
	width: 5px;
	margin-right:5px
    }	
    ::-webkit-scrollbar-track {
        border-radius: 30px;
    }	
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background   : rgb(239, 247, 246);
    }
`;

export default  Select;