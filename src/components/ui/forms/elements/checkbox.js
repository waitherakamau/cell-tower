import React from 'react'
import tw from 'twin.macro';
import styled from 'styled-components';

export default class InputCheckbox extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            checked: false
        }
        this.setCheckBoxState = this.setCheckBoxState.bind(this)
    }
    async setCheckBoxState () {
		const {
			inputId, 
			formId,
            updateText,
            updateState,
            value = false
		} = this.props
        let { checked } = this.state

        //console.log(inputId, value)
        updateText ( inputId, formId, { textInput: !value })
        updateState (inputId, formId, { hasError: false, input: !value })

        //console.log(checked, value)
        // await this.setState({
        //     checked: !checked
        // })
        //console.log('done',checked, value)
        
    }
    render() {
        let { 
            label, 
            focusColor = "#00b1ac",
            style = {},
            helperText,
            value
        } = this.props
        let { checked } = this.state

        return (
            <React.Fragment>
                <span tw = 'text-xs tracking-wide font-semibold'>{helperText}</span>
                
                <label tw = "relative flex flex-row items-center block select-none pl-9 mt-2 mb-5 font-medium text-xs tracking-wider">
                    <span dangerouslySetInnerHTML = {{ __html: label }}></span>
                    <Checkbox type = "checkbox" checked = { value } onChange = { () =>this.setCheckBoxState() } />
                    <CheckSpan/>
                </label>
            </React.Fragment>
        )
    }
};

const CheckSpan = styled.span`
    ${tw`absolute top-0 left-0 w-6 h-6 bg-transparent border rounded border-secondary-100`};
    & :after {
        ${tw`absolute hidden w-2 h-3 transform rotate-45 border-white left-2 top-1 border-r-3 border-b-3`};
        content: ""
    }
`;

const Checkbox = styled.input`
    ${tw`absolute top-0 left-0 w-0 h-0`};
    & :checked ~ ${CheckSpan} {
        ${tw`bg-secondary-100`};
    };
    & :checked ~ ${CheckSpan} :after {
        ${tw`block`};
    }
`;
