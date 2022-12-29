import { Spin }                 from 'antd';
import { LoadingOutlined }      from '@ant-design/icons';
import styled 				    from 'styled-components';
import tw                       from 'twin.macro';

const Button = ({ primary, secondary, outlined, danger, success, sm, lg, loading = false, callback = () => { }, grayIn, makefull, children }) => {

    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ffffff" }} spin />

    return (
        <StyledButton type = "button" primary = {primary} secondary = {secondary} outlined = {outlined} danger = {danger} success = {success} greyb = {grayIn} makefull = {makefull} onClick = {callback} sm = {sm} lg = {lg}>
            { loading ? <Spin indicator={antIcon} size= "small"/> : children }
        </StyledButton>
    )
};

const StyledButton = styled.button`
    ${tw`flex items-center justify-center w-full tracking-wide text-base font-bold text-center rounded-lg shadow-none outline-none cursor-pointer active:outline-none hover:opacity-80 focus:outline-none text-gray-100 lg:(w-max px-8)`};
    //color: ${p => p.theme.themeColor};
    ${p => p.primary && !p.outlined ? { border: '2px', borderStyle: 'solid', borderColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #662D91 0%, #4C226D 100%);'} : ''};
    ${p => p.secondary && !p.outlined ? { border: '2px', borderColor: 'tranparent', backgroundImage: 'linear-gradient(270deg, #F37021 0%, #F9BC11 100%)'} : ''};
    ${p => p.outlined && p.secondary ? tw`bg-transparent border-2 border-secondary-100 text-secondary-100` : ''};
    ${p => p.outlined && p.primary ? tw`bg-transparent border-2 border-primary-100 text-primary-100` : ''};
    ${p => p.danger && !p.outlined ? tw`border-2 border-transparent bg-danger` : ''};
    ${p => p.success && !p.succcess ? tw`border-2 border-transparent bg-successColor` : ''};
    ${p => p.outlined && p.danger ? tw`bg-transparent border-2 border-danger text-danger` : ''};
    ${p => p.sm ? tw`py-2 px-2` : tw`py-2` };
    ${p => p.lg ? tw`py-4` : tw`` };
    ${p => p.makefull ? tw`w-full lg:w-full` : '' };
    ${p => p.greyb ? {background: '#E2CDF3', color: '#FFFFFF', border: '2px', borderColor: 'transparent'} : ''};
    transition: "all .15s ease";
`;

export default Button