import React                from 'react'
import Head                 from 'next/head';
import styled               from 'styled-components'
import { ToastContainer }   from 'react-toastify';
import 'twin.macro';

import Footer from '@components/layout/elements/footer'

const Auth = ({ children }) => {
        
    return (
        <Div tw = "w-full h-full overflow-hidden">
            <Head>
                <title>Hello tractor cell-tower | Authorization</title>
                <meta name = "lang"  content = "en-US"/>
                <meta lang = "en-US"/>
                <meta charset="utf-8"/>
                <meta name = "keywords" content = "Hello Tractor, cell tower Dash board" />
                <meta name = "viewport" content = "width=device-width, initial-scale=1.0"/>
                <meta name = "author" content = "Effence Kamau, Hello Tractor"/>
                <meta name = "description" content = "safaricom cell tower dashboard"/>

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'  />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet"/>
            </Head>
            
            <Div tw='w-full h-screen'>
                <div tw='fixed top-0 w-full'>
                    <img src='/images/small_auth_header.png' tw='w-full h-8 lg:hidden' alt='headersmall' />
                    <img src='/images/header.png' tw='w-full h-8 hidden lg:block' alt='headerlarge' />
                </div>

                <div tw='bg-secondary-100 ml-4 p-2 rounded-b-lg w-28 mt-8 lg:(w-48 h-24 ml-24)' >
                    <img src='/images/logo.png' tw='w-full h-auto' alt='logo' />
                </div>

                <div tw='w-full h-full mt-5 mb-12'>
                    { children }
                </div>

                <Footer/>
            </Div>
			<ToastContainer />
        </Div>
    )
};

const Div = styled.div`
    overflow: hidden;
    background-color: ${props => props.theme.bgColor};

    @media only screen and (min-width: 768px){
        background-image    : url('/images/bg.jpg');
        background-color: rgba(255, 255, 255, 0.8);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        background-attachment: fixed;
        background-position-y: 20px;
        /* background-position: 0px 20px; */
    }
`;

export default (Auth)