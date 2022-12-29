import React from "react";
import 'twin.macro';
import styled   from 'styled-components';

export default function Modal({ isOpen = false, toggle, size, children }) {
    let width = size || '280px'

  return (
    <>
      {isOpen ? (
        <>
            <div tw="fixed inset-0 z-50">
                <div tw="flex items-center justify-end w-full h-screen py-4 text-center">
                    
                    <div tw="fixed inset-0 transition-opacity" onClick={toggle} aria-hidden="true">
                    <div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                    {/* <span tw="hidden sm:inline-block sm:align-middle sm:h-full" aria-hidden="true">&#8203;</span> */}
                    <Container drawersize = {width}>
                        {children}
                    </Container>
                    
                </div>
            </div>

        </>
      ) : null}
    </>
  );
}


const Container = styled.div`
    width: ${p => p.drawersize};
`;