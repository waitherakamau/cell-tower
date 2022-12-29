import { AiOutlineClose } from 'react-icons/ai';
import tw from 'twin.macro';
import styled from 'styled-components';
import React 				from 'react';

export default class PinInput extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pin : '',
			keys: [1,2,3,4,5,6,7,8,9,0],
			showKeypad: false
        }
        this.validateOnEnter  = this.validateOnEnter.bind(this)
		this.validateOnBlur   = this.validateOnBlur.bind(this)
		this.handleChangeText = this.handleChangeText.bind(this)
    }
    // componentDidMount () {
    //     document.getElementById("otpinput").addEventListener("keypress", function(evt) {
	// 		evt.preventDefault()
	// 	})
    // }
    validateOnEnter(e) {

		let input    = e.target.value
		const {  inputId, formId, length, updateState } = this.props

		if (e.keyCode === 13) {

			if (input.length !== length){
				updateState (inputId, formId, { hasError: true, input, message: "" })
			}
			else {
				updateState (inputId, formId, { hasError: false, input, message: "" })
			}

		}
		else {
			updateState (inputId, formId, { hasError: false, input, message: "" })			
		}
		
	}
    async handleChangeText(e) {
        let input = e.target.value
        const {  inputId, formId, length, updateState, updateText, onBlur, onBlurActions, formStatus, txnData, value } = this.props

        let { pin } = this.state
        let newPin = `${pin}${input}`;
        updateText(inputId, formId, { textInput: input })


        if(value.length <= length){
            //updateText(inputId, formId, { textInput: input })
            //updateState(inputId, formId, { hasError: false, input: input, message: ""})
            //updateText(inputId, formId, { textInput: input })

            await this.setState({
                pin: newPin
            })

            if(value.length === length - 1){

                updateState(inputId, formId, { hasError: true, input: input, message: "" })
                onBlur && onBlurActions && onBlurActions[onBlur] && onBlurActions[onBlur]({ ...formStatus, input, inputId, ...txnData })
            }else{
                updateState(inputId, formId, { hasError: true, input: input, message: "" })
            }
        }else{
            await this.setState({
                pin
            })
        }
    }
    validateOnBlur(e) {
        let input = e.target.value

        const {  inputId, formId, length, updateState, onBlur, onBlurActions, formStatus, txnData } = this.props

        if(input.length !== length){
            updateState(inputId, formId, { hasError: true, input, message: "Invalid verification code length" })
        }else if (input.length === length){
            //onBlur && onBlurActions && onBlurActions[onBlur] && onBlurActions[onBlur]({ ...formStatus, input, inputId, ...txnData })
        }
    }
    async handleScrambledChangeText (input) {
        const {  inputId, formId, updateText, updateState, length,  onBlur, onBlurActions, formStatus, txnData } = this.props

        if(input === "close"){
            await this.setState({
                pin: "",
                showKeypad: !this.state.showKeypad
            })
            updateState(inputId, formId, { hasError: false, input: "", message: "" })
        }else{
            let { pin } = this.state
            let newPin = `${pin}${input}`;

            if(newPin.length <= length){
                updateText(inputId, formId, { textInput: "" })
                updateState(inputId, formId, { hasError: true, input: newPin, message: ""})

                await this.setState({
                    pin: newPin
                })

                if(newPin.length === length){
                    await this.setState({
                        showKeypad: false
                    })

                    onBlur && onBlurActions && onBlurActions[onBlur] && onBlurActions[onBlur]({ ...formStatus, input, inputId, ...txnData })
                }else{
                    updateState(inputId, formId, { hasError: true, input: newPin, message: "" })
                }
            }else{
                await this.setState({
                    pin
                })
            }
        }
    }
    render(){
        const { hasError, message, dataKey, focusColor, value, length } = this.props
		const { keys, showKeypad } = this.state
        return (
            <div  data-key = { dataKey }>
            <div tw = "flex flex-col h-auto relative min-w-28 mt-5 mb-3">
                <Text tw = "font-semibold">&nbsp;&nbsp;Enter OTP</Text>
                <InputWrapper 
                    focusColor = {focusColor} 
                    hasError = {hasError} 
                >
                    <input 
                        id         = 'otpinput'
                        type       = "password" 
                        autoComplete = "new-password"
                        maxLength = {`${length}`}
                        tw        = "absolute left-0 w-full h-full rounded tracking-wider text-base text-center bg-transparent"
                        onBlur    = { this.validateOnBlur   } 
                        onKeyUp   = { this.validateOnEnter  }
                        onChange  = { this.handleChangeText } //add an onChange handler	
                        value     = { value }
                        //disabled
                    />
                </InputWrapper>
                    <p tw = "pt-2" >{message}</p>
                    {
                        showKeypad && (
                            <PinContainer>
                                <div tw = "flex flex-row flex-wrap items-center justify-end" >
                                    {
                                        keys.map((entry, index) => {
                                            return <KeyDiv key = { index } onClick = { () => this.handleScrambledChangeText(entry) } >
                                                {entry}
                                            </KeyDiv>
                                        })
                                    }
                                    <KeyDiv key = { 'scrambled-keyboard-reset' } onClick = { () => this.handleScrambledChangeText('close') } >
                                        <AiOutlineClose style = {{ color:'rgba(255,0,0,.5)'}}/>
                                    </KeyDiv>
                                </div>
                            </PinContainer>
                        )
                    }
            </div>
            </div>
        )
    }
}

const PinContainer = styled.p`
    ${tw`absolute w-48 h-auto text-sm tracking-wide rounded shadow-md -top-3 -right-56 z-5`};
    background: ${p => p.theme.bgColor};
`;

const Text = styled.p`
    color: ${p => p.theme.textColor};
`;

const SegmentInput = styled.input`
    & :disabled{
        height            : 30px;
        width             : 30px;
        font-size         : 15px;
        text-align        : center;
        outline           : none;
        background        : transparent;
        border            : none;
        margin-right      : 0px;
        border:none;
        border-bottom     : 2px solid ${p => p.hasError ? 'rgba(255,0,0,.5)' : 'rgba(0,0,0,.2)'};
    };
    & :focus {
        border-bottom: 2px solid ${p => p.theme.primaryColor};
    }
`;

const InputWrapper = styled.div`
    ${tw`relative inline-block w-full mt-2 text-xs leading-none rounded h-9`};
	border  : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `1px solid ${props.theme.borderColor}` };
    & :focus-within {
        border: 2px solid ${p => p.focusColor};
    }
`;

const KeyDiv = styled.button`
    ${tw`flex items-center justify-center w-1/3 h-12 text-sm font-medium outline-none cursor-pointer active:opacity-0 focus:outline-none active:outline-none hover:bg-secondary-200`};
    border-bottom: 1px solid #F0F8FF;
    border-right: 1px solid #F0F8FF;
    color: ${p => p.theme.textColor};
    &:hover {
        color: ${p => p.theme.themeColor};
    }
`;