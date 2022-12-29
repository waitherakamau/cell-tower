
/*-----------------------------------------

	Dynamic Form

	Dynamic Form Component Accepts:
	- implement
		- input sizes ( xs - 30%, sm - 50%, md - 60%, lg-100% ) - pass width
		- input addons ( append, prepend ) e.g..currency,decimals etc
		- input
			- md-outlined
			- md-underlined
			- shaded
			- default
		- checkbox && switch
		- rate
		- slider
		- tag picker
		- label text
	
-----------------------------------------*/

import React 				    from 'react';
import { Spin }                 from 'antd';
import { LoadingOutlined }      from '@ant-design/icons';
import styled                   from 'styled-components';
import tw                       from 'twin.macro';


// components
import Input       			from '@components/ui/forms/elements/input';
import TextArea             from '@components/ui/forms/elements/input-textarea';
import InputAutocomplete 	from '@components/ui/forms/elements/input-autocomplete';
import AutocompleteValue    from '@components/ui/forms/elements/input-autocomplete-value';
import InputDateRange 	    from '@components/ui/forms/elements/input-daterange';
import InputDate    	    from '@components/ui/forms/elements/input-date';
import InputDateGeneric   	from '@components/ui/forms/elements/input-date-generic';
import InputPhone    	    from '@components/ui/forms/elements/input-phone';
import InputPhoneKe    	    from '@components/ui/forms/elements/input-phone-ke';
import FileInput   			from '@components/ui/forms/elements/file-input';
import DownloadInput   		from '@components/ui/forms/elements/download-input';
import DragAndDrop   	    from '@components/ui/forms/elements/dragndDrop';
import Radio       			from '@components/ui/forms/elements/radio';
import AirtimeList          from '@components/ui/forms/elements/airtime-provider-list';
import BeneficiaryType      from '@components/ui/forms/elements/beneficiary-type';
import AirtimeAmountList    from '@components/ui/forms/elements/airtime-amount-list';
import SelectCharges        from '@components/ui/forms/elements/select-charges';
import Select      			from '@components/ui/forms/elements/select';
import SelectValue      	from '@components/ui/forms/elements/select-value';
import PinInput    			from '@components/ui/forms/elements/pin-input';
import PinPad    			from '@components/ui/forms/elements/pin-pad';
import Button               from '@components/ui/elements/Button';
import CheckBox             from '@components/ui/forms/elements/checkbox';
import ItemList             from '@components/ui/forms/elements/promptOptionList';

//services
import CamelToSentence from "@services/helpers/camel-to-sentence";

export default class DynamicForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false
        }

        this.createForm         = this.createForm.bind(this)
        this.setLoadingState    = this.setLoadingState.bind(this)
        this.setFormState       = this.setFormState.bind(this)
        this.submit             = this.submit.bind(this)
        this.updateInputState   = this.updateInputState.bind(this)
        this.updateTextState    = this.updateTextState.bind(this)
        this.reset              = this.reset.bind(this)
    }
    async componentDidUpdate(prevProps, prevState) {
        const { initialState  } = this.props
        
        if (prevProps.initialState && JSON.stringify(prevProps.initialState) !== JSON.stringify(initialState)) {
            let formId = this.state.formstateId
            let formState = this.state[formId]

            let newStateKeys = Object.keys(initialState)
            for(let i of newStateKeys){
                
                formState = formState.map(entry => {
                    if(entry.inputId === i){
                        entry = {
                            ...entry,
                            textInput: initialState[i]
                        }
                    }
                    return entry
                })
            }
            
            await this.setState({
                [formId]: formState
            })
            
        }
    }
    async componentDidMount(){
        //generate Form State if it is a standalone Form
        const { config, isWizardComponent = false, initialState = false  } = this.props
        
        //handle stand alone forms
        if(!isWizardComponent){
            //formState = [{inputId: "username", hasError: false, message: "", textInput: ""}]
            let formState  = []
			let sections   = config.sections
            let formId     = `form-${config.formId}`
            
            sections.map((formEntry, index) => {
                let inputs = formEntry.elements

                inputs.map((input, index) => {
                    //set ids to state
                    if(!['displaylist', 'button', 'component', 'radio', 'airtime-list'].includes(input.type)){
                        let inputId = `${input.id}`
                        formState.push({
                            inputId     ,
                            hasError    : false,
                            message     : input.helperText ? input.helperText : "",
                            textInput   : initialState && initialState[inputId] ? initialState[inputId] : "",
                            optional    : input.optional || false
                        })
                    }

                    if(input.type === 'radio' || input.type === 'airtime-list'){
                        let inputId = `${input.id}`
                        let hasDefault = false
                        let defaultValue = ""
                        let options = input.optionsList

                        //get default if any
                        options.map(item => {
                            if(item.default){
                                hasDefault = true
                                defaultValue = item.value
                            }
                        })

                        //set default if none
                        if(!hasDefault ){
                            defaultValue = options[0].value
                        }

                        formState.push({
                            inputId     ,
                            hasError    : false,
                            message     : "",
                            textInput   : defaultValue
                        })
                    }
                })
            })
            await this.setState({
                [formId]: formState,
                initialState,
                formstateId: formId
            })
        }
    }
    async setFormState (formId, newState) {
        await this.setState({
            [formId]: newState
        })
    }
    async updateInputState (inputId, formId, stateInfo) {
        await this.setState({
            [formId] : [
                ...this.state[formId].map(entry => {
                    if(entry.inputId === inputId){
                        entry.hasError = stateInfo.hasError
						entry.textInput = stateInfo.input
                        entry.message  = stateInfo.message
                    }
                    return entry
                })
            ]
        })
    }
    async updateTextState (inputId, formId, stateInfo){
        await this.setState({
            [formId]: [
                ...this.state[formId].map(entry => {
                    if(entry.inputId === inputId){
                        entry.textInput = stateInfo.textInput
                    }
                    return entry
                })
            ]
        })
    }
    async setLoadingState (isLoading) {
        await this.setState({
            isLoading
        })
    }
    async submit () {
        //checkif the current step is a form and then check if all the inputs are valid before proceeding
        let { config, state = this.state } = this.props

        let formId = `form-${config.formId}`
        let formStateData = state[formId]

        let hasErrors = false

        await this.setState({
            [formId]: [
                ...formStateData.map(entry => {
                    //check for empty strings
                    if( typeof entry.textInput === 'String' && !entry.textInput.trim() === ""){
                        hasErrors = true
                        entry.hasError = true
                        entry.message = `${entry.inputId.split('-')[0]} cannot be empty`
                    }

                    if(entry.hasError){
                        hasErrors = true
                        entry.hasError = true
                    }

                    return entry
                })
            ]
        })
    }
    async reset () {
        //checkif the current step is a form and then check if all the inputs are valid before proceeding
        let { config, state = this.state } = this.props

        let formId = `form-${config.formId}`
        let formStateData = state[formId]

        await this.setState({
            [formId]: [
                ...formStateData.map(entry => {
                    //reset form
                    if( entry.textInput){
                        entry.hasError = false
                        entry.textInput = ''
                        entry.message = ``
                    }

                    return entry
                })
            ]
        })
    }
    createForm () {
        //render from
        let {
            config,
            updateInputState = this.updateInputState,
            updateTextState = this.updateTextState,
            setFormState = this.setFormState,
            state = this.state,
            onBlurActions = false,
            txnData = false
        } = this.props

        let Form = []
        let sections = config.sections
        let hideFormTitle = config.hideFormTitle
        let focusColor = config.focusColor
        let variant = config.variant

        //map each form section
        sections.map((formEntry, index) => {
            //group title
            let groupTitle = formEntry.groupTitle;
            let groupTitleType = formEntry.groupTitleType;
            let inputs = formEntry.elements;
            let display = formEntry.display;
            let formId = `form-${config.formId}`;
            let justifyItems = formEntry.justify || false;
            let alignItems = formEntry.align || false;
            let sectionGrid = formEntry.sectionGrid || false;
            let sectionRowSpan = formEntry.sectionRowSpan || false;
            //let elementRowSpan = formEntry.elementRowSpan || false;

            Form.push(
                <div key = {`form-fieldset-${index}`} elementgrid = {sectionGrid.toString()} sectionrowspan = {sectionRowSpan.toString()}>
                    {/* group title */}
                    {
                        groupTitle.trim() !== '' && !groupTitleType && <div tw = "py-2 font-semibold tracking-wider" >{groupTitle}</div>
                    }
                    {
                        groupTitle.trim() !== '' && groupTitleType && < div showicon type= { groupTitleType } description= { groupTitle }/>
                    }

                    {/** group elements */}
                    <DivElement display={display} justify= {justifyItems} align = {alignItems} key = {`form-fieldData-${index}`}>
                        {
                            inputs.map((input, index) => {
                                if(state[formId]){
                                    //get input state
                                    let inputState = state[formId].find(e => e.inputId === `${input.id}`)
                                    let isGeneralInput = ["text", "email", "password", "number"].includes(input.type)

                                    //input focus color
                                    if(input.focusColor){
                                        focusColor = input.focusColor
                                    }

                                    //general inputs: text, email, password, number, checkbox
                                    if(isGeneralInput){
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                    <Input
                                                        key           = { `${input.label}-${index}` }
                                                        inputId       = { `${input.id}` }
                                                        hasError      = { inputState.hasError }
                                                        formId        = { formId }
                                                        disabled      = { input.disabled }
                                                        disablePaste  = { input.disablePaste }
                                                        updateState   = { updateInputState }
                                                        updateText    = { updateTextState }
                                                        type          = { input.type }
                                                        variant       = { variant    } 
                                                        label         = { input.label      }
                                                        focusColor    = { focusColor }
                                                        helperText    = { input.helperText }
                                                        message       = { inputState.message}
                                                        validation    = { input.validation }
                                                        value         = { inputState.textInput }
                                                        style         = { input.style ? input.style : {}}
                                                        autofocus     = { input.autofocus }
                                                        onBlurActions = { onBlurActions ? onBlurActions : false } //presentments - onBlur
                                                        onBlur        = { input.onBlur }
                                                        txnData       = { txnData ? txnData : {} }
                                                        formStatus    = {{ 
                                                            formId, 
                                                            formState: state [ `form-${config.formId}`], 
                                                            setFormState
                                                        }}
                                                        showMeter     = { input.showMeter }
                                                    />
                                            )
                                            
                                        }else{
                                            return (
                                                <Input
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    disablePaste  = { input.disablePaste }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    onBlurActions = { onBlurActions ? onBlurActions : false } //presentments - onBlur
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                    showMeter     = { input.showMeter }
                                                />
                                            )
                                        }
                                        
                                    }
                                    // Text Area
									if(input.type === "textarea"){
										return (
											<TextArea 
												key           = { `${input.label}-${index}` }
												inputId       = { `${input.id}` }
												hasError      = { inputState.hasError }
												formId        = { formId }
												disabled      = { input.disabled }
												disablePaste  = { input.disablePaste }
												updateState   = { updateInputState }
												updateText    = { updateTextState }
												type          = { input.type }
												variant       = { variant    } 
												label         = { input.label      }
												focusColor    = { focusColor }
												helperText    = { input.helperText }
												message       = { inputState.message}
												validation    = { input.validation }
												value         = { inputState.textInput }
												style         = { input.style ? input.style : {}}
												autofocus     = { input.autofocus }
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
												formStatus    = {{ 
													formId, 
													formState: state [ `form-${config.formId}`], 
													setFormState
												}}
                                                showMeter     = { input.showMeter }
                                                digitsOnly    = {input.digitsOnly}
                                                rows          = {input.areaRows ? input.areaRows : 4}
											/>
										)
                                    }
                                    // Auto Complete
									if(input.type === "autocomplete"){

                                        let focusCallback = input.onFocus
                                        let focus         = this.props[focusCallback] || false
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                <InputAutocomplete 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    placeholder   = { input.placeholder }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    options       = { input.dataSet }
                                                    onFocus       = { focus ? () => focus ( config.formId, state [ `form-${config.formId}` ], this.setFormState) : false  }
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                            
                                        }else{
                                            return (
                                                <InputAutocomplete 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    placeholder   = { input.placeholder }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    options       = { input.dataSet }
                                                    onFocus       = { focus ? () => focus ( config.formId, state [ `form-${config.formId}` ], this.setFormState) : false  }
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }

                                        										
                                                                                    
                                    }
                                    // Auto Complete value
									if(input.type === "autocompletevalue"){

                                        let focusCallback = input.onFocus
                                        let focus         = this.props[focusCallback] || false
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                <AutocompleteValue 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    placeholder   = { input.placeholder }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    options       = { input.optionsList }
                                                    onFocus       = { focus ? () => focus ( config.formId, state [ `form-${config.formId}` ], this.setFormState) : false  }
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                            
                                        }else{
                                            return (
                                                <AutocompleteValue 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    placeholder   = { input.placeholder }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    options       = { input.optionsList }
                                                    onFocus       = { focus ? () => focus ( config.formId, state [ `form-${config.formId}` ], this.setFormState) : false  }
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }

                                        										
                                                                                    
                                    }
                                    // Date Range
									if (input.type === "daterange") {
                                        return (
                                            <InputDateRange 
                                                key           = { `${input.label}-${index}` }
                                                inputId       = { `${input.id}` }
                                                hasError      = { inputState.hasError }
                                                formId        = { formId }
                                                disabled      = { input.disabled }
                                                updateState   = { updateInputState }
                                                updateText    = { updateTextState }
                                                type          = { input.type }
                                                variant       = { variant    } 
                                                label         = { input.label      }
                                                focusColor    = { focusColor }
                                                helperText    = { input.helperText }
                                                message       = { inputState.message}
                                                validation    = { input.validation }
                                                value         = { inputState.textInput }
                                                style         = { input.style ? input.style : {}}
                                                autofocus     = { input.autofocus }
                                                minDate       = { input.minDate }
                                                maximumDate   = { input.maximumDate }
                                            />
                                        )                                          
                                    }
                                    // Date
									if(input.type === "date"){
                                        return (
                                            <InputDate 
                                                key           = { `${input.label}-${index}` }
                                                inputId       = { `${input.id}` }
                                                hasError      = { inputState.hasError }
                                                formId        = { formId }
                                                disabled      = { input.disabled }
                                                updateState   = { updateInputState }
                                                updateText    = { updateTextState }
                                                type          = { input.type }
                                                variant       = { variant    } 
                                                label         = { input.label      }
                                                focusColor    = { focusColor }
                                                helperText    = { input.helperText }
                                                message       = { inputState.message}
                                                validation    = { input.validation }
                                                value         = { inputState.textInput }
                                                style         = { input.style ? input.style : {}}
                                                autofocus     = { input.autofocus }
                                            />
                                        )
                                    }
                                    // Date
                                    if(input.type === "dategeneric"){
                                        return (
                                            <InputDateGeneric 
                                                key           = { `${input.label}-${index}` }
                                                inputId       = { `${input.id}` }
                                                hasError      = { inputState.hasError }
                                                formId        = { formId }
                                                disabled      = { input.disabled }
                                                updateState   = { updateInputState }
                                                updateText    = { updateTextState }
                                                type          = { input.type }
                                                variant       = { variant    } 
                                                label         = { input.label      }
                                                focusColor    = { focusColor }
                                                helperText    = { input.helperText }
                                                message       = { inputState.message}
                                                validation    = { input.validation }
                                                value         = { inputState.textInput }
                                                style         = { input.style ? input.style : {}}
                                                autofocus     = { input.autofocus }
                                                minDate       = { input.minDate }
                                                maximumDate   = { input.maximumDate }
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
                                                formStatus    = {{ 
                                                    formId, 
                                                    formState: state [ `form-${config.formId}`], 
                                                    setFormState
                                                }}
                                            />
                                        )
                                    }
                                    //Phone
                                    if(input.type === "phone"){
                                        return (
                                            <InputPhone 
                                                key           = { `${input.label}-${index}` }
                                                inputId       = { `${input.id}` }
                                                hasError      = { inputState.hasError }
                                                formId        = { formId }
                                                disabled      = { input.disabled }
                                                updateState   = { updateInputState }
                                                updateText    = { updateTextState }
                                                type          = { input.type }
                                                variant       = { variant    } 
                                                label         = { input.label      }
                                                focusColor    = { focusColor }
                                                helperText    = { input.helperText }
                                                presentment   = { input.presentment ? input.presentment : false }
                                                message       = { inputState.message}
                                                validation    = { input.validation }
                                                value         = { inputState.textInput }
                                                style         = { input.style ? input.style : {}}
                                                autofocus     = { input.autofocus }
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
                                                formStatus    = {{ 
                                                    formId, 
                                                    formState: state [ `form-${config.formId}`], 
                                                    setFormState
                                                }}
                                            />
                                        )
                                    }
                                    //KE Phone
                                    if(input.type === "kephone"){
                                        return (
                                            <InputPhoneKe 
                                                key           = { `${input.label}-${index}` }
                                                inputId       = { `${input.id}` }
                                                hasError      = { inputState.hasError }
                                                formId        = { formId }
                                                disabled      = { input.disabled }
                                                updateState   = { updateInputState }
                                                updateText    = { updateTextState }
                                                type          = { input.type }
                                                variant       = { variant    } 
                                                label         = { input.label      }
                                                focusColor    = { focusColor }
                                                helperText    = { input.helperText }
                                                presentment   = { input.presentment ? input.presentment : false }
                                                message       = { inputState.message}
                                                validation    = { input.validation }
                                                value         = { inputState.textInput }
                                                style         = { input.style ? input.style : {}}
                                                autofocus     = { input.autofocus }
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
                                                formStatus    = {{ 
                                                    formId, 
                                                    formState: state [ `form-${config.formId}`], 
                                                    setFormState
                                                }}
                                            />
                                        )
                                    }
                                    //PIN PAD
									if ( input.type === "pinpad"		) {
										return (
											<PinPad 
												key           = { `${input.label}-${index}` }
												dataKey       = { `${input.label}-${index}` }
												length        = { 6 }
												inputId       = { `${input.id}` }
												formId        = { formId }
												variant       = { variant } 
												label         = { input.label }
												focusColor    = { focusColor }
												helperText    = { input.helperText }
												message       = { inputState.message }
												value         = { inputState.textInput }
												hasError      = { inputState.hasError }
												updateState   = { updateInputState }
												updateText    = { updateTextState }
												error         = { input.error ? input.error : "Invalid One Time Pin"}
												style         = { input.style ? input.style : {}}
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
												formStatus    = {{ 
													formId, 
													formState: state [ `form-${config.formId}`], 
													setFormState
												}}
											/>
										)										
																					
									}
                                    //PIN
									if ( input.type === "pin"		) {
										return (
											<PinInput 
												key           = { `${input.label}-${index}` }
												dataKey       = { `${input.label}-${index}` }
												length        = { 6 }
												inputId       = { `${input.id}` }
												formId        = { formId }
												variant       = { variant } 
												label         = { input.label }
												focusColor    = { focusColor }
												helperText    = { input.helperText }
												message       = { inputState.message }
												value         = { inputState.textInput }
												hasError      = { inputState.hasError }
												updateState   = { updateInputState }
												updateText    = { updateTextState }
												error         = { input.error ? input.error : "Invalid One Time Pin"}
												style         = { input.style ? input.style : {}}
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
												formStatus    = {{ 
													formId, 
													formState: state [ `form-${config.formId}`], 
													setFormState
												}}
											/>
										)										
																					
									}
                                    //Checkbox
									if ( input.type === "checkbox"	) {
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                <CheckBox 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }else{
                                            return (
                                                <CheckBox 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }
																					
									}
                                    //Select
									if ( input.type === "select"	) {
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return  showIfValue === match && (
                                                <Select 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }else{
                                            return (
                                                <Select 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }											
									}
                                    //Select value
									if ( input.type === "selectValue"	) {
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                <SelectValue 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }else{
                                            return (
                                                <SelectValue 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                />
                                            )
                                        }
																					
									}
                                    //File
									if(input.type === "file"){
										return (
											<FileInput 
												key           = { `${input.label}-${index}` }
												inputId       = { `${input.id}` }
												hasError      = { inputState.hasError }
												formId        = { formId }
												disabled      = { input.disabled }
												updateState   = { updateInputState }
												updateText    = { updateTextState }
												type          = { input.type }
												variant       = { variant    } 
												label         = { input.label      }
												focusColor    = { focusColor }
												helperText    = { input.helperText }
												presentment   = { input.presentment ? input.presentment : false }
												message       = { inputState.message}
												validation    = { input.validation }
												value         = { inputState.textInput }
												style         = { input.style ? input.style : {}}
												autofocus     = { input.autofocus }
												accept        = { input.accept ? input.accept : "*"}
											/>
										)
                                    }
                                    //Download Anchor tag
									if(input.type === "downloadInput"){
										return (
											<DownloadInput 
												key           = { `${input.label}-${index}` }
												inputId       = { `${input.id}` }
												hasError      = { inputState.hasError }
												formId        = { formId }
												disabled      = { input.disabled }
												updateState   = { updateInputState }
												updateText    = { updateTextState }
												type          = { input.type }
												variant       = { variant    } 
												label         = { input.label      }
												focusColor    = { focusColor }
												helperText    = { input.helperText }
												message       = { inputState.message}
												validation    = { input.validation }
												value         = { inputState.textInput }
												style         = { input.style ? input.style : {}}
                                                downloadUrl   = { input.download }
											/>
										)
                                    }
                                    //Drag nd Drop
									if(input.type === "dragndDrop"){
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let greaterAmount = showIf['is-greater-than']
                                            greaterAmount = this.props[greaterAmount] ? this.props[greaterAmount] : greaterAmount
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return Number(showIfValue) > Number(greaterAmount) && (
                                                <DragAndDrop 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    presentment   = { input.presentment ? input.presentment : false }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    maxFiles      = { input.maximum }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    accept        = { input.accept ? input.accept : "*"}
                                                />
                                            )

                                        }else{

                                            return (
                                                <DragAndDrop 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    hasError      = { inputState.hasError }
                                                    formId        = { formId }
                                                    disabled      = { input.disabled }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState }
                                                    type          = { input.type }
                                                    variant       = { variant    } 
                                                    label         = { input.label      }
                                                    focusColor    = { focusColor }
                                                    helperText    = { input.helperText }
                                                    presentment   = { input.presentment ? input.presentment : false }
                                                    message       = { inputState.message}
                                                    validation    = { input.validation }
                                                    value         = { inputState.textInput }
                                                    maxFiles      = { input.maximum }
                                                    maxSize       = { input.maxSize }
                                                    style         = { input.style ? input.style : {}}
                                                    autofocus     = { input.autofocus }
                                                    accept        = { input.accept ? input.accept : "*"}
                                                />
                                            )
                                        }
                                    }
                                    //Radio
									if(input.type === "radio"){
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return  showIfValue === match && (
                                                <Radio 
                                                    key           = { `${input.id}-${index}` }
                                                    dataKey       = { `${input.id}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant } 
                                                    label         = { input.label || ""}
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText || ""  }
                                                    value         = { inputState.textInput  }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false } //presentments - onBlur
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                    style         = { input.style ? input.style : {}}
                                                />
                                            )
                                        }else{
                                            return (
                                                <Radio 
                                                    key           = { `${input.id}-${index}` }
                                                    dataKey       = { `${input.id}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant } 
                                                    label         = { input.label || ""}
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText || ""  }
                                                    value         = { inputState.textInput  }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }				
                                                    optionsList   = { input.optionsList}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false } //presentments - onBlur
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                    style         = { input.style ? input.style : {}}
                                                />
                                            )
                                        }								
																					
									}
									//Airtime List
									if(input.type === "airtime-list"){
										return (
											<AirtimeList 
												key           = { `${input.id}-${index}` }
												dataKey       = { `${input.id}-${index}` }
												inputId       = { `${input.id}` }
												formId        = { formId }
												variant       = { variant } 
												label         = { input.label || ""}
												focusColor    = { focusColor      }
												helperText    = { input.helperText || ""  }
												value         = { inputState.textInput  }
												updateState   = { updateInputState }
												updateText    = { updateTextState  }				
												optionsList   = { input.optionsList}
												style         = { input.style ? input.style : {}}
											/>
										)										
																					
									}
									//Airtime Amount
									if(input.type === "airtime-amount"){
										return (
											<AirtimeAmountList 
												key           = { `${input.id}-${index}` }
												dataKey       = { `${input.id}-${index}` }
												inputId       = { `${input.id}` }
												formId        = { formId }
												variant       = { variant } 
												label         = { input.label || ""}
												focusColor    = { focusColor      }
												helperText    = { input.helperText || ""  }
												value         = { inputState.textInput  }
												updateState   = { updateInputState }
												updateText    = { updateTextState  }				
												optionsList   = { input.optionsList}
												style         = { input.style ? input.style : {}}
											/>
										)										
																					
									}
									// Beneficiary type
									if(input.type === "beneficiary-type"){
										return (
											<BeneficiaryType 
												key           = { `${input.id}-${index}` }
												dataKey       = { `${input.id}-${index}` }
												inputId       = { `${input.id}` }
												formId        = { formId }
												variant       = { variant } 
												label         = { input.label || ""}
												focusColor    = { focusColor      }
												helperText    = { input.helperText || ""  }
												value         = { inputState.textInput  }
												updateState   = { updateInputState }
												updateText    = { updateTextState  }				
												optionsList   = { input.optionsList}
												style         = { input.style ? input.style : {}}
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
												formStatus    = {{ 
													formId, 
													formState: state [ `form-${config.formId}`], 
													setFormState
												}}
											/>
										)										
																					
                                    }
                                    //radio button charges
                                    if(input.type === "select-charges"){
										return (
											<SelectCharges 
												key           = { `${input.id}-${index}` }
												dataKey       = { `${input.id}-${index}` }
												inputId       = { `${input.id}` }
												formId        = { formId }
												variant       = { variant } 
												label         = { input.label || ""}
												focusColor    = { focusColor      }
												helperText    = { input.helperText || ""  }
												value         = { inputState.textInput  }
												updateState   = { updateInputState }
												updateText    = { updateTextState  }				
												optionsList   = { input.optionsList}
												style         = { input.style ? input.style : {}}
												onBlurActions = { onBlurActions ? onBlurActions : false }
												onBlur        = { input.onBlur }
												txnData       = { txnData ? txnData : {} }
												formStatus    = {{ 
													formId, 
													formState: state [ `form-${config.formId}`], 
													setFormState
												}}
											/>
										)										
																					
                                    }
                                    //Button
                                    if(input.type === "button"){
                                        let callbackName = input.onClick
                                        let callback = this.props[callbackName] || false
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                <div key = { `btn-${index}` }>
                                                    <Button outlined = {input.style ? input.style.outlined : false}
                                                    secondary = {input.style ? input.style.secondary : false}
                                                    primary = {input.style ? input.style.primary : false}
                                                    grayIn = {input.style ? input.style.grayIn : false}
                                                    sm = {input.style ? input.style.sm : false}
                                                    callback = { 
														callback ? 
															( ) => callback ( config.formId, state [ `form-${config.formId}` ], this.setFormState, input.id  ) 
															: 
															this.submit 
													}>
														{ input.label }
													</Button>
                                                </div>
                                            )
                                        }else{
                                            return (
                                                <div key = { `btn-${index}` }>
                                                    <Button outlined = {input.style ? input.style.outlined : false}
                                                    secondary = {input.style ? input.style.secondary : false}
                                                    primary = {input.style ? input.style.primary : false}
                                                    grayIn = {input.style ? input.style.grayIn : false}
                                                    callback = { 
														callback ? 
															( ) => callback ( config.formId, state [ `form-${config.formId}` ], this.setFormState, input.id  ) 
															: 
															this.submit 
													}>
														{ input.label }
													</Button>
                                                </div>
                                            )
                                        }
                                    }
                                    //Component
                                    if(input.type === 'component'){
                                        let showIf = input['show-if']

                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput
                                            let checks = showIf['checks']

                                            let passedChecks = false

                                            if(checks){
                                                for(let check of checks){
                                                    let param = check.param
                                                    let matches = check.matches

                                                    if(txnData[param] === matches){
                                                        passedChecks = true
                                                    }else{
                                                        passedChecks = false
                                                    }
                                                }
                                            }

                                            if(checks && passedChecks){
                                                return showIfValue === match && <React.Fragment key = { `component-${index}` }> {input.component} </React.Fragment>
                                            }

                                            if(!checks){
                                                return showIfValue === match && <React.Fragment key = { `component-${index}` }> {input.component} </React.Fragment>
                                            }
                                        }else{
                                            return <React.Fragment key = { `component-${index}` }> {input.component} </React.Fragment>
                                        }
                                    }
                                    //list
									if ( input.type === "displaylist"	) {
                                        let optList = this.props[input.optionsList] || []
                                        let showIf = input['show-if']

                                        //Conditional rendering
                                        if(showIf){
                                            let showIfId = showIf.field
                                            let match = showIf.matches
                                            let showIfValue = state[formId].find(e => e.inputId === showIfId).textInput

                                            return showIfValue === match && (
                                                <ItemList 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                    optionsList   = {this.props.optionsList}
                                                    editAction = {this.props.editAction}
                                                    deleteAction = {this.props.deleteAction}
                                                />
                                            )
                                        }else{
                                            return (
                                                <ItemList 
                                                    key           = { `${input.label}-${index}` }
                                                    inputId       = { `${input.id}` }
                                                    formId        = { formId }
                                                    variant       = { variant         } 
                                                    label         = { input.label           }
                                                    focusColor    = { focusColor      }
                                                    helperText    = { input.helperText      }
                                                    message       = { inputState.message    }
                                                    value         = { inputState.textInput  }
                                                    hasError      = { inputState.hasError   }
                                                    updateState   = { updateInputState }
                                                    updateText    = { updateTextState  }	
                                                    style         = { input.style ? input.style : {}}
                                                    onBlurActions = { onBlurActions ? onBlurActions : false }
                                                    onBlur        = { input.onBlur }
                                                    txnData       = { txnData ? txnData : {} }
                                                    formStatus    = {{ 
                                                        formId, 
                                                        formState: state [ `form-${config.formId}`], 
                                                        setFormState
                                                    }}
                                                    optionsList   = {optList}
                                                    editAction = {this.props.editAction}
                                                    deleteAction = {this.props.deleteAction}
                                                />
                                            )
                                        }
																					
									}

                                }else{
                                    return null
                                }
                            })
                        }
                    </DivElement>

                </div>
            )
        })

        //add form title
        if(!hideFormTitle){
            return (
                <div>
                    <p tw = "font-bold text-base" >{CamelToSentence(config.formId)}</p>
                    <p tw = "mt-3" dangerouslySetInnerHTML = {{
							__html: config.formDescription ? config.formDescription : 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
					}}></p>
                    { Form }
                </div>
            )
        }

        return Form
    }
    render() {
        // form props
        const { 
            isWizardComponent, 
            config, 
            callback, 
            disableForm = false, 
            txnData, 
            backButton, 
            backButtonText = 'Back', 
            secondaryButtonText = 'ENTER', 
            resetButton, 
            secondaryButton, 
            buttonSuccess, 
            buttonDanger, 
            buttonPrimary, 
            resetOutlined,
            buttonmakefull,
            mainSecondary,
            backBOutlined,
            primarysm,
            primarylg,
            backsm
        } = this.props
        
        // internal state
        const { isLoading } = this.state
        
        //set params for callback action
        let formId = config.formId
        let formState = this.state[`form-${config.formId}`]
        let isGrid = config.gridContainer || false
        let setFormState = this.setFormState
        let setLoadingState = this.setLoadingState

        //add button and submit action to form
        let submitAction = this.submit

        if(callback){
            submitAction = () => callback(formId, formState, setFormState, setLoadingState, txnData)
        }

        //set button text
        let buttonText = 'Submit'
        if(config.submitLabel){
            buttonText = config.submitLabel
        }

        //check form loading
        let formIsLoading   = !isWizardComponent && isLoading
        let formNotLoading  = !isWizardComponent && !isLoading
        const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ffffff" }} spin />

        return (
            <>
                { /* Create the form */}

                <Container isgrid = {isGrid}>
                    { this.createForm() }
                </Container>

                {/* Show submit button for Standalone Forms */}
                {
                    !disableForm && formNotLoading && <div tw = "mt-2">
                        {
                            !backButton && !resetButton && !secondaryButton && <div tw = "mt-5">
                                <Button primary={!mainSecondary} secondary={mainSecondary} sm={primarysm} lg={primarylg} callback = {submitAction} success = {buttonSuccess} makefull = {buttonmakefull}>{buttonText}</Button>
                            </div>
                        }
                        {
                            backButton && !resetButton && (
                                <div tw = "flex w-full items-center justify-between mt-5">
                                    <div tw='w-1/2 mr-2'>
                                        <Button grayIn={!backBOutlined} outlined={backBOutlined} primary={backBOutlined} sm={backsm} callback = {()=>backButton(formState)}>{backButtonText}</Button>
                                    </div>
                                    <div tw='w-1/2'>
                                        <Button primary={!mainSecondary} secondary={mainSecondary} callback = {submitAction} sm={primarysm} success = {buttonSuccess}makefull = {buttonmakefull}>{buttonText}</Button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            resetButton && <div tw = "flex flex-col sm:flex-row items-center justify-between mt-5">
                                <Button secondary callback = {submitAction} success = {buttonSuccess}>{buttonText}</Button>
                                <Button outlined={resetOutlined} secondary callback = {()=> this.reset()} danger = {buttonDanger}>RESET</Button>
                            </div>
                        }
                        {
                            secondaryButton && <div tw = "flex flex-col sm:flex-row items-center justify-between mt-5">
                                <Button secondary = {!buttonPrimary} callback = {submitAction} primary = {buttonPrimary}>{buttonText}</Button>
                                <Button secondary callback = {()=>secondaryButton(formState)} danger = {buttonDanger} success = {buttonSuccess}>{secondaryButtonText}</Button>
                            </div>
                        }
                        </div>
                }

                {
                    !disableForm && formIsLoading && (
                        <div tw = "mt-3">
                            <Button success = {buttonSuccess} primary={!mainSecondary} secondary={mainSecondary} callback = {() => {}} makefull = {buttonmakefull}>
                                <Spin indicator={antIcon} size= "small"/>
                            </Button>
                        </div>
                    )
                }
            </>
        )
    }
};

const SubmitButton = styled.button`
    background-image: linear-gradient(270deg, #F37021 0%, #F9BC11 100%);
`

const Container = styled.div`
    ${p => p.isgrid ? tw`grid w-full grid-cols-1 sm:grid-cols-2` : ''};
    ${p => p.isgrid ? { 'column-gap': `${p.isgrid}` } : ''};
`;

const DivElement = styled.div`
    ${props => props.display === 'row' ? tw`flex flex-row flex-wrap w-full` : tw`flex flex-col flex-wrap`};
    ${props => props.justify === 'center' ? tw`justify-center` : props.justify === 'end' ? tw`justify-end` : tw`justify-start`};
    ${props => props.align === 'center' ? tw`items-center` : props.align === 'end' ? tw`items-end` : props.align === 'start' ? tw`items-start` : tw`items-stretch`};
`;