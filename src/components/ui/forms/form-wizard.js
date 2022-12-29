import React, { Component } from 'react'
import styled 				from 'styled-components'
import tw  					from 'twin.macro'
import { Spin }             from 'antd';
import { LoadingOutlined }  from '@ant-design/icons';

import DynamicForm     from '@components/ui/forms/dynamic-form'
import CheckBox 	   from '@components/ui/forms/elements/input-checkbox'
import CamelToSentence from "@services/helpers/camel-to-sentence"

class FormWizard extends Component {
	constructor(props){
        super(props)
        this.state = {
            step        : 1,
			showCheckBox: false,
			checkBoxSelected: false,
			checkBoxLabel : ""
        }
		this.updateInputState = this.updateInputState.bind(this)
		this.updateTextState  = this.updateTextState.bind(this)
		this.setCheckBoxState  = this.setCheckBoxState.bind(this)
		this.previousStep  = this.previousStep.bind(this)
		this.nextStep  = this.nextStep.bind(this)
		this.setFormState  = this.setFormState.bind(this)
    }
    componentDidMount() {
        const { config } = this.props

        config.map( (entry, index) => {
            if(entry.stepType === "form"){
                let formState = []
                let formConfig = entry.formConfig
                let sections = formConfig.sections
                let formId = `form-${formConfig.formId}`

                sections.map(formEntry => {
                    let inputs = formEntry.elements

                    inputs.map(input => {
						if(!['displaylist', 'button', 'component'].includes(input.type)){
							formState.push({
								inputId: `${input.id}`,
								hasError: false,
								message: input.helperText,
								textInput: ""
							})
						}
						if(input.type === 'radio' || input.type === 'airtime-list'){
							let inputId = `${input.id}`
							let hasDefault = false
							let defaultValue = ""
							let options = input.optionsList
	
							//get default if any
							options.forEach(item => {
								if(item.default){
									hasDefault = true
									defaultValue = item.value
								}
							})
	
							formState.push({
								inputId     ,
								hasError    : false,
								message     : "",
								textInput   : defaultValue
							})
						}
                    })
                })

                this.setState({
                    [formId]: formState
                })
            }
        })
    }
    updateInputState (inputId, formId, stateInfo) {
        this.setState({
            [formId]: [
                ...this.state[formId].map(entry => {
                    if(entry.inputId === inputId){
                        entry.hasError = stateInfo.hasError,
                        entry.textInput = stateInfo.input,
                        entry.message = stateInfo.message
                    }

                    return entry
                })
            ]
        })
    }
    updateTextState (inputId, formId, stateInfo) {
        this.setState({
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
    setCheckBoxState() {
        this.setState({
            checkBoxSelected: !this.state.checkBoxSelected
        })

    }
	previousStep () {
		this.setState({
			step: this.state.step - 1
		})
    }
    nextStep () {
        const { config } = this.props
        const entry = config[this.state.step - 1]

        //check if the current form is aform and then check if all fields are vald
        if(entry.stepType === 'form'){
            let formId = `form-${config.formConfig.formId}`
            let formStateData = this.state[formId]

            let hasError = false

            this.setState({
				[formId]: [
					...formStateData.map(entry => {
						if (typeof entry.textInput === "String" && entry.textInput === '') {
							hasError = true
							entry.hasError = true
							entry.message = `${entry.inputId.split('-')[0]} cannot be empty`
						}
						if (typeof entry.textInput === "String" && entry.textInput.trim() === '') {
							hasError = true
							entry.hasError = true
							entry.message = `${entry.inputId.split('-')[0]} cannot be empty`
						}
						if (entry.hasError) {
							hasError = true
							entry.hasError = true
						}
					})
				]
			})

            if(hasError){

            }else{
                this.setState({
					step: this.state.step + 1
				})
            }
        }else{
            this.setState({
				step: this.state.step + 1
			})
        }

    }
    setFormState(key, newState) {
        this.setState({
			[key]: newState
		})
    }
	render() {
		
		const { config, onCancel, generateVerificationOtp, onBlurActions, txnData = {}, onStepSubmit, onWizardSubmit, formIsLoading } = this.props
		const { step, checkBoxSelected } = this.state
		let checkBoxLabel = "", showCheckBox = false;

		{/* here we show checkbox if configured */}
		let stepData = config[step - 1]
		let keys = Object.keys(this.state)

		if( stepData.checkToSubmit ){
			checkBoxLabel = stepData.checkBoxContent
			showCheckBox  = true			
        }
        const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ffffff" }} spin />

		return (
			<>
				<div tw='lg:(w-full flex)'>
					{/* wizard steps */}
					<div tw='flex items-start justify-around mt-2 overflow-ellipsis lg:hidden'>
						{
							config.map((stepInfo, stepIndex) => {
								//data already captured
								if(stepIndex + 1 === step){
									return (
										<div key={stepIndex} tw='w-12 text-center py-2 px-1 text-primary-100 font-bold text-base border-b-2 border-primary-100 uppercase mr-4 overflow-ellipsis' >
											<span>{stepIndex + 1}</span>
										</div>
									)
								}else{
									return (
										<div key={stepIndex} tw='w-12 text-center py-2 px-1 text-gray-400 font-bold text-base border-b border-transparent uppercase mr-4 overflow-ellipsis' >
											<span>{stepIndex + 1}</span>
										</div>
									)
								}
							})
						}
					</div>
					<div tw='hidden lg:block'>
						<div tw='flex h-20'>
							<p tw='font-bold text-5xl self-end text-primary-100'>
								0{step}
							</p>
							<p tw='ml-2 font-medium text-5xl self-start pt-2'>
								<span>/</span>
								<span>0{config.length}</span>
							</p>
						</div>

						<div tw='w-80 mt-3 pt-3 pl-2 border border-primary-100 border-dashed'>
							{
								config.map((stepInfo, stepIndex) => {
									//data already captured
									if(stepIndex + 1 === step){
										return (
											<div key={stepIndex} tw='pb-5' >
												<span tw='font-bold tracking-wide text-base uppercase text-primary-100'>{stepInfo.stepName}</span>
											</div>
										)
									}else{
										return (
											<div key={stepIndex} tw='pb-5' >
												<span tw='font-bold tracking-wide text-base pb-5 uppercase text-gray-400'>{stepInfo.stepName}</span>
											</div>
										)
									}
								})
							}
						</div>
					</div>

					<div tw='lg:(ml-6)'>
						{/* current step title */}
						<p tw='mt-3 mb-6 font-semibold text-xl tracking-wide text-primary-100 lg:text-3xl'>
							{ config[step - 1]['stepTitle'] }
						</p>

						{/* display current step */}
						{
							config[step - 1]['stepType'] === 'form' && (
								<DynamicForm  
									isWizardComponent       = { true }
									updateInputState        = { this.updateInputState }
									updateTextState         = { this.updateTextState }
									config                  = { config[step - 1]['formConfig'] }
									state                   = {this.state}
									generateVerificationOtp = { generateVerificationOtp }
									onBlurActions           = { onBlurActions }
									txnData                 = { txnData }
								/>
							)
						}
						{
							config[step - 1]['stepType'] === 'summary' && (
								<div>
									<h2 tw = "text-lg" >
										{ stepData.heading }
									</h2>
									<p dangerouslySetInnerHTML = {{ __html: stepData.subHeading ? stepData.subHeading : 'Confirm Your Information' }} />
									{
										keys.map((key, index) => {
											if(key.startsWith('form-')){
												let data = this.state[key]

												return (
													!stepData.hideDetails && (
														<React.Fragment key = {key} >
															<p tw = "w-full text-sm font-bold pt-2 pr-3 text-left" >
																{CamelToSentence(key)}
															</p>
															{
																data.map(entry => {
																	<div tw = "relative float-left w-full even:bg-gray-200" key={entry.inputId} >
																		<SummaryEntry>
																			{CamelToSentence(entry.inputId)}
																		</SummaryEntry>
																		<SummaryEntry>
																			{entry.textInput.toString()}
																		</SummaryEntry>
																	</div>
																})
															}
														</React.Fragment>
													)
												)
											}
										})
									}
								</div>
							)
						}
						{/* here we can set up any component added  */}
						{ stepData.component } 

						{/* checkbox if enabled */}
						{ 
							showCheckBox && (
								<CheckBox 
									checked          = { checkBoxSelected } 
									label            = { checkBoxLabel } 
									setCheckBoxState = { this.setCheckBoxState }
								/>
							)
						}

						{/* navigation buttons */}
						<div tw = "mt-6 pb-3 flex items-center justify-between" >
							{
								step === 1 && onCancel && (
									<BackButton onClick = { onCancel }>
										cancel
									</BackButton>
								)
							}
							{
								step > 1 && (
									<BackButton onClick = { this.previousStep }>
										Back
									</BackButton>
								)
							}
							{
								!formIsLoading && step < config.length && (
									<Button onClick = { onStepSubmit ? () => {
										let formId = `form-${stepData.formConfig.formId}`
										let formStateData = this.state[formId]
										onStepSubmit(formId, formStateData, this.setFormState, this.state)
									} : this.nextStep} >
										continue
									</Button>
								)
							}
							{
								formIsLoading && step < config.length && (
									<Button onClick = { ()=> {} } >
										<Spin indicator={antIcon} size= "small"/>
									</Button>
								)
							}
							{/* final step */}
							{
								step === config.length && !showCheckBox && (
									<Button onClick = { () => onWizardSubmit(this.state) } >
										{ config[step - 1].actionButtonLabel ? config[step - 1].actionButtonLabel : "Submit" }
									</Button>
								)
							}
							{
								step === config.length && showCheckBox && checkBoxSelected && (
									<Button onClick = { () => onWizardSubmit(this.state) } >
										{ config[step - 1].actionButtonLabel ? config[step - 1].actionButtonLabel : "Submit" }
									</Button>
								)
							}
						</div>
					</div>
				</div>
			</>
		)
	}
};

const Button = styled.button`
	${tw`text-center h-11 rounded-lg text-gray-100 uppercase px-4 font-semibold tracking-wide`};
	background-image: linear-gradient(90deg, #662D91 0%, #4C226D 100%);
	min-width: 112px;
`;

const BackButton = styled.button`
	${tw`text-center h-11 rounded-lg text-primary-100 uppercase px-4 font-semibold tracking-wide bg-transparent border-3 border-primary-100`};
	min-width: 112px;
`;

const SummaryEntry = styled.div`
    ${tw`relative float-left text-right w-52 leading-normal pr-2 text-gray-400 first:text-left first:font-normal even:bg-gray-200`};
`;


export default FormWizard;