import React, { useState } 		from 'react'
import Head    					from 'next/head';
import IdleTimer                from 'react-idle-timer';
import Cookies 		            from 'universal-cookie';
import Router                   from 'next/router';
import { ToastContainer }       from 'react-toastify';
import { connect }              from 'react-redux';
import styled                   from 'styled-components';
import 'twin.macro'


import { Actions }  from '@services';
import Navbar       from '@components/layout/elements/navbar'
import Footer       from '@components/layout/elements/footer'
import Sidebar      from '@components/layout/elements/sidenav'
import urls         from '@services/api/api.paths';
import fetch        from '@services/api/fetch.service';

const cookies = new Cookies();

const MainLayout = (props) => {
	let {
		children,
		subtitle,
		titlebarheader = 'Dashboard'
	} = props;

	const [ sidebarOpen, setSidebarOpen ] = useState(false)

	const verifyUserSessionId = async () => {

	}

	const handleOnIdle = async (event) => {
        //Remove session id and re-route
		//await verifyUserSessionId()
		//Router.push('/')
	}

	const setSidebar = (value) => {
        setSidebarOpen(value)
    }
    
    const signout = async () => {
		await verifyUserSessionId()
	}

	return (
		<>
			<Head>
                <title>Hello tractor cell-tower{subtitle ? ` | ${subtitle}` : ''}</title>
				<meta name = "lang"  content = "en-US"/>
				<meta lang = "en-US"/>
				<meta charset="utf-8"/>
                <meta name = "keywords" content = "Hello Tractor, cell tower Dash board" />
				<meta name = "viewport" content = "width=device-width, initial-scale=1.0"/>
				<meta name = "author" content = "Effence Kamau, Hello Tractor"/>
				<meta name = "description" content = "Hello tractor cell tower dashboard"/>

				<link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'  />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet"/>
			</Head>

			<IdleTimer
					// ref      = { ref => { idleTimer = ref }}
					timeout  = { 900000 }
					onIdle   = { handleOnIdle}
					debounce = { 250}
				/>

			<Container tw='relative w-full h-screen overflow-hidden'>
				<div className = 'flex w-full h-full'>
					<div></div>

					<div className='flex-1 h-full'>
						<Navbar 
							sidebarOpen = {sidebarOpen}
							signout={signout} 
							titlebarheader={titlebarheader} 
							openSidebar={()=> setSidebar(true)}
							customerName = 'Maru Moses'
						/>

						<div className='w-full h-full pt-10 pb-24 overflow-y-auto'>
							{ children }
						</div>
					</div>
				</div>
				
			</Container>

			<ToastContainer />
		</>
	)
};

const Container = styled.div`
	background-color: #F7F7F7;
`;

const mapStateToProps = state => {
	return {
		userData    : state.userData
	}
}
const mapDispatchToProps = dispatch => {
	return {
		updateUserData : params => dispatch(Actions.updateUserData(params))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)