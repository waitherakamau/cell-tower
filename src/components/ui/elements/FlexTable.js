import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'twin.macro';
import * as XLSX from 'xlsx';
import { FiEdit, FiEye } from 'react-icons/fi'
import { Spin }                 from 'antd';
import { LoadingOutlined }      from '@ant-design/icons';

const BulkTable = (props) => {
    const { 
        hideFooter    ,
        loading       , 
        showHeader    ,
        config        : { columns, data }, 
        isReviewable  , 
        reviewTrigger = 'default',
        reviewText    = "Approve/Reject",
        onReview      = () => null,
        isEditable    , 
        isDeletable   ,
        isViewable	  ,
        deleteAction  = () => null,
        editAction  = () => null,
        viewAction  = () => null,
        onPrintClick  = () => null,
        fileName = "file",
        worksheetname = "fullstatement",
        cancelText = 'Decline',
        editText = 'Process'
    } = props
	const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ffa500" }} spin />

    let isActionable = isEditable ? true : isReviewable ? true : isDeletable ? true : isViewable

    const [tableData, setTableData] = useState([ ...data ])
    const [orderView, setOrderView] = useState('')
    const [orderColumnName, setOrderColumnName] = useState('')
    const [value, setValue] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchIndex, setSearchIndex] = useState(0);

    useEffect(() => {
        setTableData([ ...data ])
        useForceUpdate()
      return () => {}
    }, [data])
    //force Update hook for deleting entries
    let useForceUpdate = () => { // integer state
        return () => setValue(value => value + 1); // update the state to force render
    }
    //const forceUpdate = useForceUpdate();
    

    const sortRecords = (columnIndex, columnName) =>{
        let items = []
        let data = {}
        tableData.forEach((item, index) => {
            items.push(`${item[columnIndex]}${index}`)
            data[`${item[columnIndex]}${index}`] = index
        })
        
        items.sort()
        //items.reverse()
        let newArry = []
        for (let i in items){
            newArry[i] = tableData[data[items[i]]]
        }
      
        setTableData(newArry)
        setOrderView('sort')
        setOrderColumnName(columnName)
    }
    const reverseRecords = (columnIndex, columnName) =>{
        let items = []
        let data = {}
        tableData.forEach((item, index) => {
            items.push(`${item[columnIndex]}${index}`)
            data[`${item[columnIndex]}${index}`] = index
        })

        items.sort()
        items.reverse()
        let newArry = []
        for (let i in items){
            newArry[i] = tableData[data[items[i]]]
        }
      
        setTableData(newArry)
        setOrderView('reverse')
        setOrderColumnName(columnName)
    }

	let createAndDownloadPdf = () => {
	
		const input = document.getElementById('divToPrint');
		//input.classList.add("px-10")
        // if (input.requestFullscreen) {
        //     input.requestFullscreen();
        // } else if (input.webkitRequestFullscreen) { /* Safari */
        //     input.webkitRequestFullscreen();
        // } else if (input.msRequestFullscreen) { /* IE11 */
        //     input.msRequestFullscreen();
        // }
	
		// html2canvas(input)
		//   .then((canvas) => {
		// 	const imgData = canvas.toDataURL('image/png');
		// 	// const pdf = new jsPDF();
		// 	// pdf.addImage(imgData, 'JPEG', 1, 5);
		// 	// pdf.output('dataurlnewwindow');

        //     var imgWidth = 210; 
        //     var pageHeight = 295;  
        //     var imgHeight = canvas.height * imgWidth / canvas.width;
        //     var heightLeft = imgHeight;

        //     var doc = new jsPDF('p', 'mm');
        //     var position = 0;

        //     doc.addImage(imgData, 'JPEG', 0, 3, imgWidth, imgHeight);
        //     heightLeft -= pageHeight;

        //     while (heightLeft >= 0) {
        //         position += 5
        //         position = heightLeft - imgHeight;
        //         doc.addPage();
        //         doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        //         heightLeft -= pageHeight;
        //     }
		// 	doc.save(`${fileName}.pdf`);
		//   })
	}

    let exportToExcel = () => {
        //build excel data
        let excelData = []
        for(let item1 of data) {
            let json2Value = {}
            for (let index1 in item1){
                if( !['editrow', 'deleterow'].includes(item1[index1])){
                    json2Value[columns[index1]] = item1[index1]
                }   
            }
            excelData.push(json2Value)
        }
  
          const ws = XLSX.utils.json_to_sheet(excelData);
          const wb = XLSX.utils.book_new();
        //   wb.Props = {
        //     Title: "iKonnect Fullstatement",
        //     Subject: "full-statement",
        //     Author: "Moses Maru",
        //     CreatedDate: new Date()
        //   };
          XLSX.utils.book_append_sheet(wb, ws, worksheetname);
  
          XLSX.writeFile(wb, `${fileName}.xlsx`);
    }

    const handleEnter = (eventInput) => {
        let input = eventInput.target.value

        if(eventInput.keyCode === 13){
            let filterData = data

            filterData = filterData.filter(entry => entry && entry[searchIndex].toString().toLowerCase().includes(input.toLowerCase()))

            setTableData(filterData)
        }
    }

    const searchRecords = () => {

        if(searchInput){
            let filterData = data

            filterData = filterData.filter(entry => entry && entry[searchIndex].toString().toLowerCase().includes(searchInput.toLowerCase()))

            setTableData(filterData)
        }
    }

    const setSearchOption = (e) => {
        setSearchIndex(columns.indexOf(e.target.value))
    }

    return (
        <>
        <Container tw="w-full mb-6 rounded shadow-md">
            
            {
                data.length > 0 && showHeader && (
                    <div tw = "flex items-center justify-end pt-1 pb-2 px-2">
                            <div tw='font-semibold text-xs tracking-wider mr-7'>
                                <span>Search by:</span>
                                <select tw='ml-1 active:outline-none focus:outline-none py-2 rounded border' name="searchoptions" id="headers" onChange={setSearchOption}>
                                    {
                                        columns.map((entry, index) => (
                                            <option value = {entry} key = { index }>{entry}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div tw="flex items-center justify-between w-48 py-2 rounded-md pl-2 border mr-10">
                                <input value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} tw='font-semibold text-xs tracking-wider active:outline-none focus:outline-none' placeholder='search' onKeyUp={handleEnter} />

                                <FiEdit tw="m-0 mr-2 cursor-pointer" style = {{ color: 'gray' }} onClick={searchRecords} />
                            </div>

                            <button onClick = {() => exportToExcel()} tw = "cursor-pointer py-2 px-7 mr-3 text-white bg-secondary-100 rounded font-semibold text-xs tracking-wide focus:outline-none active:outline-none">Download as Excel</button>
                        
                            <button onClick = {() => createAndDownloadPdf()} tw = "cursor-pointer py-2 px-7 text-white bg-secondary-100 rounded font-semibold text-xs tracking-wide focus:outline-none active:outline-none">Download as PDF</button>
                    </div>
                )
            }
            <div tw="flex items-center justify-center font-sans">
                {/* <div tw="w-full lg:w-5/6">*/}
                    <DivTable tw="w-full h-full overflow-auto"> 
                        <table tw="relative w-full h-full table-auto min-w-max" id = "divToPrint">
                            <thead tw= "relative z-2">
                                <tr tw="sticky top-0 text-sm font-medium leading-normal capitalize rounded-lg cursor-default text-center">
                                    {
                                        columns.map((entry, index) => {
                                            return <Header tw="sticky top-0 py-3 pl-1 text-center" key = {index}>
                                                <div tw="flex justify-center items-center" >
                                                {entry}
                                                {/* <div tw ='flex flex-col ml-2 inline-block' >
                                                    <Icon icon='caret-up' tw="m-0" style = {{ color: orderView === 'sort' && orderColumnName === entry ? 'inherit' : 'gray', display: 'block' }} onClick={()=> sortRecords(index, entry)} />
                                                    <Icon icon='caret-down' tw="m-0" style = {{ color: orderView === 'reverse' && orderColumnName === entry ? 'inherit' : 'gray' }} onClick={()=> reverseRecords(index, entry)} />
                                                </div> */}
                                                </div>
                                            </Header>
                                        })
                                    }

                                    {
                                        isActionable && <Header tw="sticky top-0 py-3 pl-1 text-center">Actions</Header>
                                    }
                                    
                                </tr>
                            </thead>
                            <tbody tw="text-sm font-normal">

                                {
                                    tableData.map((entry, index) => {
                                        return <tr tw="border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100" key = {index} isEven = { index%2 === 0 }>
                                            {
                                                entry.map((item, itemIndex) => {

                                                    if(!['editrow', 'deleterow'].includes(item))
                                                    return <td tw = "py-3 px-1 text-center" key = {itemIndex}>{item}</td>
                                                })
                                            }


                                            {
                                                isActionable && (
                                                    <td tw="px-6 py-3 text-center">
                                                        <div tw="flex justify-center items-center">
                                                            { isViewable && <div tw="w-4 transform hover:text-secondary-100 hover:scale-110" onClick = { ()=> viewAction(index)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                </div>
                                                            }
                                                            { isEditable && entry.includes('editrow') && (
                                                                    <button tw = "flex items-center justify-center py-1 ml-2 text-sm font-bold capitalize border-2 rounded-md shadow-none outline-none cursor-pointer text-secondary-100 px-2 border-secondary-100 active:outline-none hover:opacity-80 focus:outline-none" onClick = { () => editAction ( index ) }>{editText}</button>
                                                                )
                                                            }
                                                            { isDeletable && entry.includes('deleterow') && ( 
                                                                    <button tw = "flex items-center justify-center py-1 ml-2 text-sm font-bold capitalize border-2 rounded-md shadow-none outline-none cursor-pointer text-red-500 px-2 border-red-500 active:outline-none hover:opacity-80 focus:outline-none" onClick = { () => deleteAction ( index ) }>{cancelText}</button>
                                                                )
                                                            }

                                                            {
                                                                isReviewable &&  reviewTrigger === 'button' && (
                                                                    <button tw = "flex items-center justify-center py-1 ml-2 text-sm font-bold capitalize border-2 rounded-md shadow-none outline-none cursor-pointer text-secondary-100 w-28 border-secondary-100 active:outline-none hover:opacity-80 focus:outline-none" onClick = { () => onReview ( index ) }>{reviewText}</button>
                                                                )
                                                            
                                                            }
                                                        </div>
                                                    </td>
                                                )
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>

                        {
                            data.length === 0 && <div tw = 'flex flex-row items-center justify-center w-full p-5 overflow-hidden font-bold text-center'>
                                { loading && <div><Spin indicator={antIcon} size= "large"/> <span tw='block text-xs tracking-wider font-medium leading-loose' >Fetching records...</span> </div>}
                                { !loading && <p tw = "px-12 py-3 mt-10 text-xs tracking-wide border rounded text-secondary-100 border-secondary-100">There are no records to display</p>}
                            </div>
                        }
                    </DivTable>
                 {/*</div> */}
            </div>
        </Container>
        </>
    )
}

const Container = styled.div`
    background-color: #ffffff;
    @font-face {
        font-family: "nunito";
        src        : url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap');
        font-style : normal;
    }
`;

const DivTable = styled.div`
    max-height: 480px;
`;

const Header = styled.th`
    background-color: #e2e4e9;
`;

const TableRow = styled.tr`
   & :hover {
       background-color: ${props => props.theme.tableEven};
   }
   background-color: ${props => props.isEven ? props.theme.tableEven : 'inherit'};
   ${p => p.theme.mode === 'light' ? '' : ''};
`;

export default BulkTable;
