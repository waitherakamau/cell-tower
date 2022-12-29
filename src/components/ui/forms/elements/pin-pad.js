import { AiOutlineClose } from 'react-icons/ai';
import tw from 'twin.macro';
import styled from 'styled-components';
import React 				from 'react';

export class PinInputSegments extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pin: ''
        }
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }
    componentDidMount () {
        document.addEventListener('mousedown', this.handleBlur)
    }
    componentWillUnmount () {
        document.removeEventListener('mousedown', this.handleBlur)
    }
    handleBlur (e) {
        if ( !e.target.classList.contains ( "pin-input-root" )  ) {

			const { inputId, formId, length, updateState, updateText, error } = this.props
			let   { pin } = this.state

			if ( pin.length !== length ){
				// update state to have error and update props
				updateState ( inputId, formId, { hasError: true, input: pin, message: error })
			} 
		}
    }
    handleKeyDown (e, i) {
        this.refs[i].value = ""
		const { inputId, formId, length, updateState, updateText,error } = this.props
		updateState ( inputId, formId, { hasError: false, input: this.state.pin, message: "" })
    }
    async handleKeyUp (e, i) {
        const { inputId, formId, length, callback, updateText } = this.props
        let { pin } = this.state
        
        if(e.keyCode === 8){
            this.setState({ pin: pin.slice(0,i) })

			if ( i > 0 ) {
				for ( let x = 0; x < length ; x ++ ) {
					if ( x !== i-1){
						this.refs[x].disabled = true
					}
					else {
						this.refs[x].disabled = false
					}
				}

				this.refs[i-1].focus()
			}
			
			this.refs[i].value = ""
        }else{
            let entry = e.target.value
	
			if ( entry.length  === 1 && i < length - 1 ) {

				let newPin = pin.length === 1 && i == 0 ? entry : pin+entry
				updateText  ( inputId, formId, { textInput: newPin })

				this.setState({ pin: newPin })				

				for ( let x = 0; x < length ; x ++ ) {
					if ( x !== i+1){
						this.refs[x].disabled = true
					}
					else {
						this.refs[x].disabled = false
					}
				}

				this.refs[i+1].focus()
			}

			if ( i === length - 1 ){

				if ( (pin+entry).length > length ) {
					pin = pin.slice ( 0, i)
				}

				let newPin = pin+entry
				updateText  ( inputId, formId, { textInput: newPin })

				this.setState(
					{
						pin:newPin
					}, 
					() =>{
						// callback runs here
						// callback ( this.state.pin )
					}
				)
			}
        }
    }
    generateInputs () {
        const {  formId, length, hasError } = this.props

        let inputs = []
        
        for(let i = 0; i < length; i ++){
            inputs.push(
                <React.Fragment key = {`formId-pin-input-${i}`}>
                    <SegmentInput 
						type       = "password" 
						hasError   = {hasError}
						autoFocus  = { i === 0 ? true : false }
						onKeyDown  = { e => this.handleKeyDown ( e, i ) } 
						onKeyUp    = { e => this.handleKeyUp   ( e, i ) } 
						ref        = { i }
					/>
                </React.Fragment>
            )
        }
    }
    render() {
        return (
            <div data-key = { dataKey } className = 'pin-input-root' tw = "flex flex-col " >
                <p tw = "font-bold">Enter your Verification Code (OTP)</p>
                <div>
                    { this.generateInputs()}
                </div>
                <p tw = "pt-5" >{message}</p>
            </div>
        )
    }
}

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
		this.shuffleKeys      = this.shuffleKeys.bind(this)
    }
    componentDidMount () {
        document.getElementById("pin-input").addEventListener("keypress", function(evt) {
			evt.preventDefault()
		})
    }
    async shuffleKeys() {
        let { keys } = this.state;

        for(let i = keys.length - 1; i > 0; i--){
            const keyArray = new Uint32Array(1);
            window.crypto.getRandomValues(keyArray);
			const j = parseInt(keyArray[0].toString().charAt(0), 10) //Math.floor(Math.random() * i)
			const temp = keys[i]
			keys[i] = keys[j]
			keys[j] = temp
        }
        
        const { inputId, formId, updateState, updateText } = this.props

        updateState(inputId, formId, { hasError: false, textInput: "", message: "" })
        updateText(inputId, formId, { textInput: "" })
        this.setState({
            pin: "",
            keys,
            showKeypad: true
        })
    }
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
    handleChangeText(e) {
        let input = e.target.value
        const {  inputId, formId, updateText } = this.props
        updateState(inputId, formId, { textInput: input })
    }
    validateOnBlur(e) {
        let input = e.target.value

        let { formId, inputId, length, updateState } = this.props

        if(input.length !== length){
            updateState(inputId, formId, { hasError: true, input, message: "Invalid verification code length" })
        }else{
            updateState(inputId, formId, { hasError: false, input, message: "" })
        }
    }
    async handleScrambledChangeText (input) {
        const {  inputId, formId, updateText, updateState, length,  onBlur, onBlurActions, formStatus, txnData } = this.props

        if(input === "close"){
            this.setState({
                pin: "",
                showKeypad: !this.state.showKeypad
            })
            updateState(inputId, formId, { hasError: false, input: "", message: "" })
        }else{
            let { pin } = this.state
            let newPin = `${pin}${input}`;

            if(newPin.length <= length){
                updateText(inputId, formId, { textInput: "" })
                updateState(inputId, formId, { hasError: false, input: newPin, message: ""})

                this.setState({
                    pin: newPin
                })

                if(newPin.length === length){
                    this.setState({
                        showKeypad: false
                    })

                    onBlur && onBlurActions && onBlurActions[onBlur] && onBlurActions[onBlur]({ ...formStatus, input: newPin, inputId, ...txnData })
                }else{
                    updateState(inputId, formId, { hasError: true, input: newPin, message: "" })
                }
            }else{
                this.setState({
                    pin
                })
            }
        }
    }
    render(){
        const { hasError, message, dataKey, focusColor, value, label = 'Enter OTP', style } = this.props
		const { keys, showKeypad } = this.state
        return (
            <div  data-key = { dataKey } tw='w-full' >
            <div tw = "flex w-full flex-col h-auto relative min-w-28 mt-5 mb-3">
                <Text tw = "font-semibold">&nbsp;&nbsp;{label}</Text>
                <InputWrapper focusColor = {focusColor} hasError = {hasError} onClick = { this.shuffleKeys } bgcolor={style.bgColor || '#FFFFFF'} >
                    <input 
                        id         = 'pin-input'
                        type       = "password" 
                        tw        = "absolute left-0 w-full h-full rounded tracking-wider text-base text-center pointer-events-none bg-transparent"
                        onBlur    = { this.validateOnBlur   } 
                        onKeyUp   = { this.validateOnEnter  }
                        onChange  = { this.handleChangeText } //add an onChange handler	
                        value     = { value }
                        disabled
                    />
                </InputWrapper>
                    <TextMessage hasError={hasError} >{message}</TextMessage>
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

const TextMessage = styled.p`
    color: ${props => props.hasError ? props.theme.dangerColor : 'inherit'};
`;

const PinContainer = styled.div`
    ${tw`absolute w-48 ml-2 h-auto text-sm tracking-wide rounded shadow-md -top-3 left-1/2 z-5`};
    background: ${p => p.theme.bgColor};
`;

const Text = styled.p`
    /* color: ${p => p.theme.textColor}; */
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
    ${tw`relative inline-block w-1/2 mt-2 text-xs leading-none rounded-lg h-12`};
	border  : ${props => props.hasError ? `2px solid ${props.theme.dangerColor}` : `1px solid ${props.theme.borderColor}` };
    background-color: ${p => p.bgcolor};
    color: black;
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