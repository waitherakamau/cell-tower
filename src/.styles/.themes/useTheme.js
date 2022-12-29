import { createGlobalStyle } from 'styled-components';
import style                 from 'styled-theming';

const getBackground = style('mode', {
    light: '#f9fafb',
    dark: '#111827'
});

const getForeground = style('mode', {
    light: '#282828',
    dark: '#f9fafb'
});

const getFontFam = style('mode', {
    light: 'nunito',
    dark: 'lato'
});

const getFontSrc = style('mode', {
    light: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap',
    dark: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap'
});

const getFontSize = style('textZoom', {
  normal: '12px',
  magnify: '14px'
})

const GlobalStyle = createGlobalStyle`
a:hover,a:active, a:visited, a:focus {
	text-decoration:none;
	color:inherit
}
@font-face {
    font-family: 'Cairo', sans-serif;
    src        : url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap');
};
body {
    background-color: ${getBackground};
    color: ${getForeground};
    font-size: ${getFontSize};
    width: 100%;
    font-family: 'Cairo', sans-serif;
    @font-face {
        font-family: 'Cairo', sans-serif;
        src        : url(${getFontSrc});
    };
}

::-webkit-scrollbar {
	width: 5px;
	margin-right:5px;
	background   : #F79441;
}	
::-webkit-scrollbar-track {
	border-radius: 30px;
}	
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background   : #F79441;
}

/** Classes for the displayed toast **/
/** Used to define container behavior: width, position: fixed etc... **/
.Toastify__toast-container {
}
.Toastify__toast {
}
.Toastify__toast--rtl {
}
.Toastify__toast--dark {
}
.Toastify__toast--default {
}
.Toastify__toast--info {
}
.Toastify__toast--success {
}
.Toastify__toast--warning {
}
.Toastify__toast--error {
}
.Toastify__toast-body {
}

.bp3-input, .bp3-input:focus, .bp3-input.bp3-active {
    box-shadow: none !important
}
`;

export default GlobalStyle;