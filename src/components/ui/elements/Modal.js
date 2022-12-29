import React from "react";
import styled      from 'styled-components';
import tw              from 'twin.macro';
import { FiX } from 'react-icons/fi'

export default function Modal({ showModal = false, setShowModal, body, title, cancelButton = 'Cancel', confirmButton = "Confirm", confirmModal, hideConfirm = false, children }) {
  return (
    <>
      {showModal ? (
        <>
            <div tw="fixed inset-0 z-50">
            <div tw="flex items-center justify-center w-full h-screen px-4 py-4 text-center">
                
                <div tw="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)} aria-hidden="true">
                <div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

            {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                {/* <span tw="hidden sm:inline-block sm:align-middle sm:h-full" aria-hidden="true">&#8203;</span> */}
                
                <Container role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                
                    <div tw = "w-full h-full pb-2 overflow-hidden">

                        {/* Title */}
                        <Header tw="sticky top-0 right-0 flex items-center justify-end w-full h-12 border-b-4 border-secondary-100">
                            {/* <!-- Heroicon name: outline/exclamation --> */}
                            <h1 tw = "w-full text-lg font-semibold tracking-wide text-center text-primary-100">{title}</h1>
                            <FiX onClick={() => setShowModal(false)} tw = 'text-xl cursor-pointer' />
                        </Header>


                        {/* {BODY} */}
                        <div tw = "w-full h-full">
                            {body}
                            {children}
                        </div>

                    </div>
                
                {/* {Footer} */}
                {/* <div tw="fixed bottom-0 left-0 w-full px-4 py-1 h-11 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                    { !hideConfirm && <button type="button" tw="inline-flex items-center justify-center w-full px-4 py-1 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-secondary-100 hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-300 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => confirmModal(false)}>
                    {confirmButton}
                    </button> }

                    <button type="button" tw="inline-flex items-center justify-center w-full px-4 py-1 text-base font-medium bg-transparent border rounded-md shadow-sm text-primary-100 border-primary-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}>
                    {cancelButton}
                    </button>
                </div> */}
                </Container>
            </div>
            </div>

        </>
      ) : null}
    </>
  );
}

const Container = styled.div`
    ${tw`relative inline-block w-full overflow-hidden overflow-y-scroll text-left align-middle transition-all transform rounded-md shadow-xl lg:w-md`};
    background: ${p => p.theme.bgColor};
    max-height: 97%;
    min-height: 301px;
    @media only screen and(min-width: 700px){
        width: 690px;
    }
    //width: 70%;
`;

const Header = styled.div`
    background-color: #F0F8FF;
`;