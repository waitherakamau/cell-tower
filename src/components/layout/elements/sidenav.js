import React, { useEffect, useState } 	from 'react'
import Router 							from 'next/router';
import Link 							from 'next/link';
import styled 							from 'styled-components';
import tw 								from 'twin.macro';
import { MdPlayArrow } 					from 'react-icons/md'
import { RiArrowDownSFill } 			from 'react-icons/ri'
// import { AiOutlineHome } 				from 'react-icons/ai'
import { connect } 						from 'react-redux'

import { Actions } 			from '@services';
import { GenerateLinks } 	from '@services/helpers/get-sidenav-links'

const Sidenav = (props) => {
  let {
    sidebarOpen,
    setSidebar = () => null,
    activeSideMenu,
    activeSideMiniMenu,
    updateActiveSideMenu,
    updateActiveSideMiniMenu,
    sidenav = 'default',
    allowedMenus
  } = props

  let config = GenerateLinks(sidenav, allowedMenus)
	
  // const [ sidebarOpen, setSidebar ] = useState(false)
  const [ menuOpen, setOpenmenu ] = useState("Dashboard")
  const [ submenuOpen, setSubmenu ] = useState('')
  const [ minimenuOpen, setMinimenu ] = useState('')

  useEffect(() => {
    setMinimenu(activeSideMiniMenu)
  }, [])
  

  const setOpenMenus = (menu) => {
      setOpenmenu(menu) 
      updateActiveSideMenu(menu)
      setSubmenu( menuOpen !== menu ? true : !submenuOpen)
  };
  const setOpenSubMenu = (menu) => {
      updateActiveSideMiniMenu(menu)
      setMinimenu(minimenuOpen === menu ? '' : menu)
  };

  let NavLinks = Object.keys(config)
	return (
		<>
      <BackDropDiv sidebaropen = {sidebarOpen} onClick={()=> setSidebar(false)}
      tw="fixed z-20 inset-0 left-64 bg-black opacity-50 transition-opacity lg:hidden"></BackDropDiv>


      <DashboardContainer sidebaropen = {sidebarOpen}>
        <nav tw="flex flex-col pt-2 pb-12 px-4">
          <SidebarLogo src = "/images/sidebar_logo.png" tw="sticky top-0 mt-4 mb-8" alt='faululogo' />

          {
            NavLinks.map((link, index) => {
              let isActive = Router.asPath.includes(config[link]['path'])
              let openSub = submenuOpen || isActive && submenuOpen === ''
      
              if(!config[link]['children']){
                return (
                  <ActiveLink key = {index} 
                    activelink = {isActive}>
      
                    <Link href = {config[link]['path']} tw = 'w-full'>
                      <span tw = 'w-full flex items-center'>
                        <img src = {`/images/icons/${isActive ? `${config[link]['icon']}-active` : config[link]['icon']}.svg`} tw = 'w-5 h-5' alt={config[link]['icon']} />
						{/* <AiOutlineHome tw='font-bold text-xl' /> */}
                        <span tw="ml-3 font-medium text-xs"> {config[link]['text']} </span>
                      </span>
                    </Link>
        
                    {/* {
                      !isActive && (<MdPlayArrow tw='text-xs mr-2' />)
                    } */}
      
                  </ActiveLink>
                )
              }else{
                return (
                  <RootMenuWrapper key = {index} >
                    <ActiveLink tw = 'hover:(bg-primary-100 text-gray-100)'
                    activelink = {isActive} onClick={() => setOpenMenus(config[link]['text'])} >
                      <div tw = 'flex'>
                        <img src = {`/images/sidenav/${config[link]['icon']}.png`} tw = 'w-5 h-5' alt={config[link]['icon']} />
                        <span tw="ml-2 font-medium text-xs"> {config[link]['text']} </span>
                      </div>
                      {
                        !isActive && !openSub && (<MdPlayArrow tw='text-xs mr-2' />)
                      }
                      {
                        !isActive && openSub && menuOpen !== config[link]['text'] && (<MdPlayArrow tw='text-xs mr-2' />)
                      }
                      {
                        !isActive && openSub && menuOpen === config[link]['text'] && (<RiArrowDownSFill tw='text-base mr-2' />)
                      }
                    </ActiveLink>

                    {
                      activeSideMenu === config[link]['text'] &&
                        <RootMenuWrapper tw = 'pl-10'>
                          {
                            openSub && config[link]['children'].map((child, cIndex) => {
                              let isactiveSubMenu = Router.pathname.includes(child['path'])
                              if(child['children']){
                                return (
                                  <React.Fragment key = {'child-parent-' + cIndex}>
                                    <div>
                                      <MiniDiv activelink = {isactiveSubMenu} className="flex flex-col mt-3 tracking-wider cursor-default"
                                      role="menuitem"
                                      >
                                          <div className='flex w-full opacity-95 items-center justify-between py-2 pr-1 font-medium hover:text-gray-700 hover:(pl-1 mr-1 font-semibold text-gray-50 bg-primary-100) rounded' onClick={()=> setOpenSubMenu( child['text'])} >
                                            <span tw="ml-5"> {child['text']} </span>
                                            {minimenuOpen !== child['text'] && <MdPlayArrow  />}
                                            {minimenuOpen === child['text'] && <RiArrowDownSFill tw='text-base' />}
                                          </div>
                                          {
                                           minimenuOpen === child['text'] && child['children'].map((miniChild, miniCIndex) => {
                                              isactiveSubMenu = Router.pathname.includes(miniChild['path'])
                                              return (
                                                <div key = {'minichild' + miniChild['text']}  >
                                                  <Link href = {miniChild['path']}>
                                                    <ActiveMiniMenu activelink = {isactiveSubMenu} className="flex opacity-95 items-center mt-1 mx-5 py-2 tracking-wider font-medium hover:text-gray-700 hover:(pl-1 mr-1 font-semibold bg-primary-100 text-gray-50 transform scale-100) rounded"
                                                    role="menuitem"
                                                    >
                                                      <span tw="ml-5"> {miniChild['text']} </span>
                                                    </ActiveMiniMenu>
                                                  </Link>
                                                </div>
                                            )})
                                          }
                                      </MiniDiv>
                                    </div>
                                  </React.Fragment>
                                )
                              }
                              return (
                                <React.Fragment key = {cIndex}>
                                <Link href = {child['path']} passHref>
                                  <ActiveSubMenu activelink = {isactiveSubMenu} tw="flex items-center mt-3 py-2 tracking-wider font-medium hover:(pl-3 mr-5 font-semibold bg-primary-100 opacity-90 text-gray-50 transform scale-100 duration-700) rounded"
                                  role="menuitem"
                                  >
                                      <span tw="ml-5"> {child['text']} </span>
                                  </ActiveSubMenu>
                                </Link>
                                </React.Fragment>
                              )
                            })
                          }
                        </RootMenuWrapper>
                  }
                </RootMenuWrapper>)
              }
            })
          }
        </nav>
      </DashboardContainer>

		</>
	)
}

const SidebarLogo = styled.img`
	height: 80px;
	width: 170px;
`;

const ActiveSubMenu = styled.a`
  	${p => p.activelink ? tw`mr-5 text-primary-100` : ''}
`;

const ActiveMiniMenu = styled.a`
  	${p => p.activelink ? tw`mr-7 text-primary-100` : tw`text-gray-700`};
`;

const MiniDiv = styled.div`
  	${p => p.activelink ? tw`mr-5 text-primary-100` : tw`text-gray-700`}
`;

const RootMenuWrapper = styled.div`
  	${tw`transform transition-all duration-1000 ease-in-out delay-500`}
	//transition: all 800ms ease;
`;

const BackDropDiv = styled.div`
    ${p => p.sidebaropen ? tw`block` : tw`hidden`}
`;

const DashboardContainer = styled.div`
  	${p => p.sidebaropen ? tw`shadow-sm fixed inset-y-0 left-0 h-full overflow-y-auto transition duration-300 ease-out transform translate-x-0 w-64 z-30 lg:(translate-x-0 w-72 static inset-0 z-0)` : tw`shadow-sm fixed inset-y-0 left-0 h-full overflow-y-auto transition duration-300 ease-in transform -translate-x-full w-72 lg:(translate-x-0 static inset-0)`};
  	background: #E6E7E8;
	  transition: all 800ms ease;
`;

const ActiveLink = styled.div`
    ${p => p.activelink ? tw`flex items-center w-full py-2 pl-5 mb-4 overflow-hidden text-sm tracking-wide text-white cursor-pointer rounded-lg` : tw`flex items-center justify-between w-full py-2 pl-5 mb-4 overflow-hidden text-sm tracking-wide text-gray-800 bg-transparent cursor-pointer rounded-lg`};
	${props => props.activelink && { backgroundImage: 'linear-gradient(90deg, #662D91 0%, #4C226D 100%)' }};
	& :hover{
		${tw`text-gray-100 transform scale-100 duration-500`};
		background-image: linear-gradient(90deg, #662D91 0%, #4C226D 100%);
	}

    ${props => props.theme.mode === 'dark' && props.activelink ? tw`text-gray-100!` : ''}
    ${props => props.theme.mode === 'dark' && !props.activelink ? tw`text-gray-400` : ''}
`;

const mapStateToProps = state => {
    return { 
      activeSideMenu : state.activeSideMenu,
      activeSideMiniMenu : state.activeSideMiniMenu
    }
}
const mapDispatchToProps = dispatch => {
	return {
		updateActiveSideMenu : params => dispatch(Actions.updateActiveSideMenu(params)),
		updateActiveSideMiniMenu : params => dispatch(Actions.updateActiveSideMiniMenu(params))
	}
}
export default connect (mapStateToProps, mapDispatchToProps) (Sidenav)