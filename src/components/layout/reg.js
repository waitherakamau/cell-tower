import React                from 'react'
import Head                 from 'next/head';
import styled               from 'styled-components'
import { ToastContainer }   from 'react-toastify';
import 'twin.macro';

import Footer from '@components/layout/elements/footer'

const RegAuth = ({ children }) => {
        
    return (
        <Div tw = "w-full h-full overflow-hidden">
            <Head>
                <title>Faulu Internet Banking | Self Registration</title>
                <meta name = "lang"  content = "en-US"/>
                <meta lang = "en-US"/>
                <meta charset="utf-8"/>
                <meta name = "keywords" content = "online banking, internet banking, faulu, faulu mfb, faulu microfinance bank, DigiCash" />
                <meta name = "viewport" content = "width=device-width, initial-scale=1.0"/>
                <meta name = "author" content = "Moses Maru, Eclectics International"/>
                <meta name = "description" content = "Faulu Microfinance Bank Internet Banking"/>

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'  />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet"/>
            </Head>
            
            <Div tw='w-full h-full'>
                <div tw='fixed top-0 w-full'>
                    <img src='/images/small_auth_header.png' tw='w-full h-8 lg:hidden' alt='headerimg' />
                    <img src='/images/header.png' tw='w-full h-8 hidden lg:block' alt='headerlargeimg' />
                </div>

                <div tw='w-full h-full mt-5 mb-10'>
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
`;

export default (RegAuth)