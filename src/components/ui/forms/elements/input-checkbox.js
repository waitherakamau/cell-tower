import React from "react";
import tw from 'twin.macro';
import styled from 'styled-components';

export default class InputCheckbox extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        let { 
            setCheckBoxState, 
            checked, 
            label, 
            focusColor = "#00b1ac" 
        } = this.props

        return (
            // <React.Fragment>
            //     <div tw= "relative block pl-12 pt-2 mt-5 mb-10 text-xs cursor-pointer" onClick = { setCheckBoxState } >
            //         <Input type="checkbox" checked = { checked }/>
            //         <Span></Span>
            //         <span tw = "relative -top-1 -left-5" dangerouslySetInnerHTML = {{ __html: label }}></span>
            //     </div>
            // </React.Fragment>
            <label tw = "relative flex flex-row items-center block cursor-pointer select-none pl-9 my-7"><span dangerouslySetInnerHTML = {{ __html: label }}></span>
                <Checkbox type = "checkbox" checked = { checked } onChange = { setCheckBoxState } />
                <CheckSpan/>
            </label>
        )
    }
};

const CheckSpan = styled.span`
    ${tw`absolute top-0 left-0 w-6 h-6 bg-transparent border rounded border-primary-100`};
    & :after {
        ${tw`absolute hidden w-2 h-3 transform rotate-45 border-white left-2 top-1 border-r-3 border-b-3`};
        content: ""
    }
`;

const Checkbox = styled.input`
    ${tw`absolute top-0 left-0 w-0 h-0`};
    & :checked ~ ${CheckSpan} {
        ${tw`bg-primary-100`};
    };
    & :checked ~ ${CheckSpan} :after {
        ${tw`block`};
    }
`;


const Span = styled.span`
    ${tw`absolute top-0 left-0 w-5 h-5 bg-gray-300 border border-gray-900 rounded hover:bg-gray-500`};
    & :after {
        ${tw`hidden w-2 h-3 rotate-45 border-b-2 border-r-2 border-white left-3 top-2`};
    };
`;

const Input = styled.input`
    ${tw`absolute w-0 h-0`};
    & :checked ~ ${Span} {
        background-color: ${props => props.theme.secondaryColor};
    };
    & :checked ~ ${Span} :after {
        ${tw`block`};
    };
`;
