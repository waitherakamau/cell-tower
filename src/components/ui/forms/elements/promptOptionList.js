import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

const PromptOptionList = ({
    style = {},
    editAction = () => {} ,
    deleteAction = () => {},
    optionsList
}) => {
    

  return (
    <ListDiv className='p-2 rounded-sm border border-gray-200 my-2' ismedium = {style.medium} hasright = {style.mdRight} >
        {
            optionsList && optionsList.map((item, index) => (
                <OptionDiv className='flex justify-between tracking-wide text-xs leading-loose font-normal pt-1' key = {index} islast = {(optionsList.length - 1) === index } >
                    <div className='flex'>
                    <span className='text-base font-normal'>{index + 1}.</span>
                    <div className='flex flex-col ml-2 text-sm mb-1'>

                        <div className='my-1'>
                        <span>Label: </span> 
                        <span className='font-medium'>{item.label}</span> 
                        </div>

                        <span className='mt-1'>Value: {item.value}</span>

                        { item['jump-to'] && <span>Jump to: {item['jump-to']}</span> }
                    </div>
                    </div>

                    <div className='text-sm tracking-wider font-normal lowercase'>
                        <span className='text-primary-100 cursor-pointer' onClick={editAction}>Edit</span> | <span className='text-danger cursor-pointer' onClick={deleteAction}>Delete</span>
                    </div>
                </OptionDiv>
            ))
        }
    </ListDiv>
  )
}

const OptionDiv = styled.div`
    ${p => p.islast ? '' : tw`border-b`};
`;

const ListDiv = styled.div`
    background-color: ${props => props.theme.bgColor};
    ${p => p.ismedium ? tw`w-full md:w-sm` : tw`w-full` };
    ${p => p.hasright ? tw`md:ml-sm` : ''};
`;

export default PromptOptionList