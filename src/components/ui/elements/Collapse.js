import React, { useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { BiUpArrow, BiDownArrow } from 'react-icons/bi';

function Collapse({panelHeader, children, setdefault}) {

    const [panelOpen, setpanelOpen] = useState(setdefault)
    return (
        <div tw = 'border-b-2 border-primary-100'>
            <div tw = 'w-full flex items-center justify-between py-2' onClick = { ()=> setpanelOpen(!panelOpen)}>
                <span tw = 'font-semibold text-base tracking-wider'>{panelHeader}</span> 
                <div>
                    { panelOpen && (<BiUpArrow onClick = { ()=> setpanelOpen(!panelOpen)} />)}
                    { !panelOpen && (<BiDownArrow onClick = { ()=> setpanelOpen(!panelOpen)} />)}
                </div>
            </div>

            <Body tw = 'pb-2' isopen = {panelOpen}>
                {children}
            </Body>
        </div>
    )
}

const Body = styled.div`
    ${p => p.isopen ? '' : tw`hidden`}
`;

export default Collapse
