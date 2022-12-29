import React from "react";
import styled from "styled-components";
import tw from 'twin.macro';

const Tabs = ({ config }) => {
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div tw="flex flex-wrap">
        <div tw="w-full">
          <ul
            tw="flex flex-row flex-wrap pb-4 mb-0 list-none"
            role="tablist"
          >
                { 
                    config.tabs.map ( (tab,index) => (
                        
                        <li 
                            tw="flex-auto mt-2 mr-2 -mb-px text-center last:mr-0"
                            onClick={e => {
                                e.preventDefault();
                                setOpenTab(index + 1);
                            }}
                            activeTab = { openTab === index + 1 ? true : false }
                            key       = { index }
                            >
                        <StyledSpan
                            tw = "text-xs font-bold cursor-pointer capitalize px-5 py-3 block leading-normal tracking-normal active:outline-none focus:outline-none w-52"
                            activeTab = {openTab === index + 1 ? true : false}
                            onClick={e => {
                            e.preventDefault();
                            setOpenTab(index + 1);
                            }}
                            data-toggle="tab"
                            href = {'#' + tab.title}
                            role="tablist"
                        >
                            {tab.title}
                        </StyledSpan>
                        </li>
                    ))
                }

          </ul>



          <div tw="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg">
            <div tw="flex-auto px-4 py-5">
              <div className="tab-content tab-space">

                { 
                    config.tabs.map ( (tab, index ) => (
                        <TabDiv activeTab = {openTab === index + 1 ? true : false} key = { index } id = {'link' + (index + 1)}>
                            {tab.content}
                        </TabDiv>
					))
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TabDiv = styled.div`
  ${p => p.activeTab ? { display: "block", minHeight: '560px'} : tw`hidden`};
`;

const StyledSpan = styled.span`
  ${p => p.activeTab ? tw`border-b-3 border-secondary-100` : ''}
  color: #777777;
`;

export default Tabs;