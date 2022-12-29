import React, { Component } from 'react';
import { Spin }                 from 'antd';
import { LoadingOutlined }      from '@ant-design/icons';
import styled from 'styled-components';
import tw from 'twin.macro';

export default class Panel extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
			isLoading : false
        }
		this.simulateNetworkRequest = this.simulateNetworkRequest.bind(this)
    }
    async simulateNetworkRequest (){

		await this.setState({
			isLoading: !this.state.isLoading
		})
	}
    render() {
        const { 
			title, 
			children,
			showLoading = false
		} = this.props
        
        const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ffffff" }} spin />

        return (
            <div tw = "w-full h-full shadow">
                {/* loading */}
                { 
                    showLoading && <div tw = "relative w-full h-full z-2 bg-gray-100 flex items-center justify-center">
                        <Spin indicator={antIcon} size= "small"/>
                    </div> 
                }

                {/* panelheader */}
				<Header tw = "w-full py-2 flex items-center justify-center text-sm font-bold tracking-wide text-center border-b-4 cursor-default text-primary-100 border-primary-100">
					<span tw = "leading-none text-primary-100 text-lg">{title}</span>
				</Header>
                {/* panel body */}
                <Container>						
                    {children}
                </Container>
            </div>
        )
    }
}

const Container = styled.div`
	background: ${props => props.theme.bgColor};
`;

const Header = styled.div`
    border-bottom: solid;
	${props => props.theme.mode === 'light' ? tw`text-primary-100 bg-info` : tw`text-primary-200 bg-darkInfo`};
`;