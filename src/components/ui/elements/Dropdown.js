import tw from 'twin.macro';
import styled from 'styled-components';
import { AiFillCaretDown } from 'react-icons/ai'

const Dropdown = ({ content, trigger, style, alignment }) => {
    //determine styles
    let styleObject      = false

    if ( style && typeof style === 'object' ) {
        styleObject =  style
    }

    //determine alignment
    let currentAlignment = 'center'

    if ( alignment && ['left','right'].includes ( alignment )){
        currentAlignment = alignment
    }

    //TODO: determine placement
    let currentPlacement = 'bottom'

    return (
        <div tw = "relative inline-block h-full transition duration-500 ease-out cursor-pointer">
            <Trigger>{trigger}</Trigger>
            <Content currentAlignment = {currentAlignment} inputSize = {styleObject}>
                {content}
            </Content>
        </div>
    )
};

const MegaDropdown = ({ content, trigger, style, minimized }) => {
    //determine styles
    let styleObject = {}

    if ( style && typeof style === 'object' ) {
        styleObject =  style
    }

    return (
        <MegaContainer>
            <div tw = "h-full flex items-center justify-center">{trigger}<AiFillCaretDown style = {{marginLeft:'.5rem'}}/></div>
            <MegaContent minimized = {minimized}>
                {content}
            </MegaContent>
        </MegaContainer>
    )
};

const MegaContent = styled.div`
    ${tw`left-0 invisible -mt-4 overflow-hidden transition duration-500 ease-out rounded opacity-0 top-12 z-1`};
    position        : fixed;
    width           : ${p =>  p.minimized ? 'calc(100% - 0px)':'calc(100% - 0px)'};
    box-shadow      : 0px 8px 16px 0px rgba(0,0,0,0.05);
`;

const MegaContainer = styled.div`
    ${tw`inline-block w-auto h-full transition duration-500 ease-out cursor-pointer`};
    & :hover ~ ${MegaContent} {
        ${tw`visible mt-2 opacity-100 h-52`};
    };
`;

const Content = styled.div`
    ${tw`overflow-hidden transition duration-1000 ease-in-out rounded shadow-lg hover:visible`};
    ${p => p.inputSize ? { ...p.inputSize } : ''};
    ${p => p.currentAlignment === 'center' ? tw`left-2/4 -translate-x-2/4` : p.currentAlignment === 'left' ? tw`left-0` : p.currentAlignment === 'right' ? tw`right-0` : ''};
    visibility: hidden;
`;

const Trigger = styled.div`
    ${tw`flex items-center justify-center h-full`};
    &:hover ~ ${Content} {
        visibility: visible;
    };
`;


export { Dropdown, MegaDropdown }