import tw from 'twin.macro';
import styled from 'styled-components';

const Checkbox = ({ 
    setCheckBoxState, 
    checked, 
    label
}) => {

    return (
        <>
            <Label tw = "relative flex flex-row items-center block select-none pl-9 mt-2 mb-5 font-normal text-xs tracking-wider">
                <span dangerouslySetInnerHTML = {{ __html: label }}></span>
                <CheckboxInput type = "checkbox" checked = { checked } onChange = { setCheckBoxState } />
                <CheckSpan/>
            </Label>
        </>
    )
};
const Label = styled.label`
    @font-face {
        font-family: "nunito";
        src        : url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap')format("truetype");
    }
`;
const CheckSpan = styled.span`
    ${tw`absolute top-0 left-0 w-6 h-6 bg-transparent border rounded border-secondary-100`};
    & :after {
        ${tw`absolute hidden w-2 h-3 transform rotate-45 border-white left-2 top-1 border-r-3 border-b-3`};
        content: ""
    }
`;

const CheckboxInput = styled.input`
    ${tw`absolute top-0 left-0 w-0 h-0`};
    & :checked ~ ${CheckSpan} {
        ${tw`bg-secondary-100`};
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

export default Checkbox