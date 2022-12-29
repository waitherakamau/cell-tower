
/**-------------------------------------------
 * 
 * 		Zr Table Component
 * 
 * -------------------------------------------
 * 
 * 	Selectable row
 * 	Show Row Detail ( set cut-off Column )
 * 	Search whole table ( Suitable algorithm ?)
 * 	Search by column Name
 * 	Pagination
 *  Sort by Column
 * 	Advanced Actions ( export to CSV )
 * 
 */
 import React from 'react';
import styled from 'styled-components';
 import 'twin.macro';
 
 export default class Table extends React.Component {
     constructor(props) {
         super(props)
     }
     render() {
         const { 
             config
         } = this.props
 
         let data      = config.data
         
         return (
            <Div tw="w-full px-4 pb-4 rounded-md">
                <div tw="flex justify-between w-full pt-6 ">
                    <h1 tw="ml-3 text-base font-medium tracking-wide uppercase"> Ministatement</h1>
                    <svg tw = "text-current" width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.4">
                    <circle cx="2.19796" cy="1.80139" r="1.38611" fill="#222222"/>
                    <circle cx="11.9013" cy="1.80115" r="1.38611" fill="#222222"/>
                    <circle cx="7.04991" cy="1.80115" r="1.38611" fill="#222222"/>
                    </g>
                    </svg>
            
                </div>
            {/* <div tw="flex justify-end w-full px-2 mt-2">
                    <div tw="relative z-auto inline-block w-full sm:w-64 ">
                    <Search type="text" name="ministatementdate" tw="block w-full px-4 py-1 pl-8 text-sm leading-snug bg-gray-100 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring placeholder-primary-100 placeholder-opacity-60" placeholder="Search" />
            
                    <div tw="absolute inset-y-0 left-0 flex items-center px-2 pl-3 pointer-events-none">
            
                        <svg tw="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999">
                        <path d="M508.874 478.708L360.142 329.976c28.21-34.827 45.191-79.103 45.191-127.309C405.333 90.917 314.416 0 202.666 0S0 90.917 0 202.667s90.917 202.667 202.667 202.667c48.206 0 92.482-16.982 127.309-45.191l148.732 148.732c4.167 4.165 10.919 4.165 15.086 0l15.081-15.082c4.165-4.166 4.165-10.92-.001-15.085zM202.667 362.667c-88.229 0-160-71.771-160-160s71.771-160 160-160 160 71.771 160 160-71.771 160-160 160z" />
                        </svg>
                    </div>
                    </div>
                </div> */}
                <div tw="mt-6 overflow-x-auto">
            
                <table tw="w-full border-collapse table-auto">
                    <thead>
                    <Header tw="px-4 text-sm font-medium text-left rounded-lg cursor-default">
                    {
                                            config.columns.map((entry, index) => {
                                                return <th tw="py-2" key={index}>
                                                    {entry}
                                                </th>
                                            })
                                }
                    </Header>
                    </thead>
                    <tbody tw="text-sm font-normal">
                        {
                                    data.map((entry, index) => {
                                        return <TableRow tw="py-10 border-b border-gray-200 cursor-default" key={index}>
                                            {
                                            entry.map((item, itemIndex) => {
                                                return <td tw = "py-4" key={index}>{item}</td>
                                            })
                                            }
                                        </TableRow>
                                    })
                                }

                                
                    </tbody>
                    
                </table>
                {
                                    data.length < 1 && (
                                        <div tw = 'flex flex-row items-center justify-center w-full p-5 overflow-hidden font-bold text-center'>
                                            <p tw = "px-12 py-3 mt-10 text-xs tracking-wide border rounded text-secondary-100 border-secondary-100">There are no records to display</p>
                                        </div>
                                    )
                                }
                </div>

                {/* <div id="pagination" tw="flex items-center justify-center w-full pt-4 border-t border-gray-100">
                    
                    <svg tw="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7072C13.6834 17.0977 14.3166 17.0977 14.7071 16.7072C15.0977 16.3167 15.0977 15.6835 14.7071 15.293L11.4142 12L14.7071 8.70712C15.0977 8.31659 15.0977 7.68343 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z" fill="#2C2C2C"/>
                    </g>
                    </svg>
                    
                    <p tw="mx-2 text-sm leading-relaxed cursor-pointer text-primary-100 hover:text-primary-100">1</p>
                    <p tw="m-0 mx-2 text-sm leading-relaxed cursor-pointer hover:text-primary-100">2</p>
                    <p tw="m-0 mx-2 text-sm leading-relaxed cursor-pointer hover:text-primary-100"> 3 </p>
                    <p tw="m-0 mx-2 text-sm leading-relaxed cursor-pointer hover:text-primary-100"> 4 </p>
                    <svg tw="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.2929C10.3166 6.9024 9.6834 6.9024 9.2929 7.2929C8.9024 7.6834 8.9024 8.3166 9.2929 8.7071L12.5858 12L9.2929 15.2929C8.9024 15.6834 8.9024 16.3166 9.2929 16.7071C9.6834 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12Z" fill="#18A0FB"/>
                    </svg>
        
                </div> */}
     </Div>
         )
     }
 }

 const Header = styled.tr`
    background-color: ${props => props.theme.tableHeader};
 `;
 
 const Search = styled.input`
  background-color: ${props => props.theme.themeColor};
 `;

 const Div = styled.div`
    background-color: ${props => props.theme.lightColor};
 `;

 const TableRow = styled.tr`
    & :hover {
        background-color: ${props => props.theme.tableEven};
    }
 `;