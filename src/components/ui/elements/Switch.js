import React from 'react';
import styled from 'styled-components';
import 'twin.macro';

const Switch = ({ title, isChecked, onChange, id = 'toogle' }) => {
    return (
        <div>      
            <div tw="relative inline-block w-8 mr-2 align-middle transition duration-200 ease-in select-none">
                <Input type="checkbox" name={id} id={id} tw="absolute block w-4 h-4 border-4 rounded-full appearance-none cursor-pointer focus:outline-none" onChange = {onChange} checked = {isChecked}/>
                <Label htmlFor={id} tw="block h-4 overflow-hidden rounded-full cursor-pointer border"></Label>
            </div>
            <label htmlFor={id} tw="text-xs text-gray-700">{title}</label>
        </div>
    )
}

const Label = styled.label`
    background-color: #F3F1E9;
    border-color: #FFB768;
`;

const Input = styled.input`
    border-color: #FFB768;
    background-color: #FFB768;
    & :checked {
        right: 0;
        border-color: #FF8600;
        background-color: #FF8600;
    }
    & :checked ~ ${Label} {
        background-color: #F3F1E9;
        border-color: #FF8600;
    }
`;

export default Switch
