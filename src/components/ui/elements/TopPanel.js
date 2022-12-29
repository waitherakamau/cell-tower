import React from 'react'
import styled from 'styled-components'
import 'twin.macro'

const TopPanel = ({ children, title }) => {
  return (
    <div className='w-full h-full px-10 py-3'>
        <h1 className='text-lg font-semibold mt-2 tracking-wide leading-loose'>{title}</h1>

        <Div className='mt-2 border-t-3 border-secondary-100 rounded p-2'>
            { children }
        </Div>
    </div>
  )
}

const Div = styled.div`
    background: ${p => p.theme.bgColor};
`;

export default TopPanel