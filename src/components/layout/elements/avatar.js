import styled from 'styled-components';
import tw from 'twin.macro';


const Avatar = ({ initials, sm, lg, xl }) => {
    return (
        <Container small = {sm} large = {lg} xl = {xl} avatarname = {initials} tw = "flex items-center justify-center overflow-hidden text-center rounded-full shadow-lg cursor-default">
            <span tw = "font-extrabold uppercase">{initials}</span>
        </Container>
    )
}

export default Avatar;

const colors = ['#00AA55', '#009FD4', '#B381B3', '#939393', '#E3BC00', '#D47500', '#DC2A2A'];

function numberFromText(text) {
    // numberFromText("AA");
    const charCodes = text
      .split('') // => ["A", "A"]
      .map(char => char.charCodeAt(0)) // => [65, 65]
      .join(''); // => "6565"
    return charCodes;
};

const Container = styled.div`
    ${p => p.large ? tw`w-16 h-16 text-xl` : ''};
    ${p => p.small ? tw`w-10 h-10 text-xl` : ''};
    ${p => p.xl ? tw`w-20 h-20 md:(w-24 h-24) text-4xl` : ''}
    background: ${p => colors[numberFromText(p.avatarname) % colors.length]};
`;