import React from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

export default class SimpleList extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
        this.createList = this.createList.bind(this)
    }
    createList () {
        let { config = {} } = this.props
		let mapped   = []
        let keys     = Object.keys (config)
        
        if ( keys.length > 0 ) {

			for ( let index in keys ) {

				let key    = keys   [ index ]
				let value  = config [ key   ]
				
				mapped.push (
					<div tw = "flex flex-row p-3 even:bg-gray-300" key={key + value}>
						<div tw = 'text-left font-bold flex-2'>{ key   }</div>
						<div tw = 'flex-2 text-right'>{ value }</div>
					</div>
				)
			}
		}else {
			mapped = [
				<div tw = 'w-full flex items-center justify-center p-4' key='no-data'>
					<Paragraph>There are no records to display</Paragraph>
				</div>
			]
        }
        
		return mapped
    }
    render() {
		return  this.createList() 
	}
}

const Paragraph = styled.p`
    ${tw`text-primary-100 pt-4 pr-2 font-bold rounded w-2/4 text-center`};
    background: #ff990005;
	border: 1px solid #ffa50017;
`;