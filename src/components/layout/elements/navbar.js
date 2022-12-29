import React                from 'react'
import { AiOutlineDown }    from 'react-icons/ai'
import styled               from 'styled-components';
import tw                   from 'twin.macro'
import Link                 from 'next/link';
import Router               from 'next/router';
import { FiMenu }           from 'react-icons/fi'

const Navbar = ({ signout, titlebarheader, customerName, openSidebar }) => {
  return (
    <div tw='relative' >
        
        <div tw='bg-white absolute w-full px-2 flex items-start justify-between top-1 right-0 text-gray-600 tracking-wide lg:px-12'>
            <FiMenu onClick={openSidebar} tw="mt-3 font-bold text-xl cursor-pointer focus:outline-none lg:hidden" />
            <p tw='font-semibold text-xl mt-2'>
                {titlebarheader}
            </p>

            <div tw=''>
                <Trigger tw='flex items-center'>
                    <img src='/images/logo.png' tw='w-auto h-10' alt='avatar' />
                </Trigger>

                
            </div>
        </div>
    </div>
  )
}

const Content = styled.div`
    ${tw`overflow-hidden transition duration-1000 ease-in-out rounded shadow-lg hover:visible`};
    visibility: hidden;
`;

const Trigger = styled.div`
    ${tw`flex items-center justify-center`};
    &:hover ~ ${Content} {
        visibility: visible;
    };
`;

export default Navbar