import { connect }          from 'react-redux';
import Link                 from 'next/link';
import Router, { withRouter }       from 'next/router';
import styled               from 'styled-components';
import tw                   from 'twin.macro';
import { Icon }             from 'rsuite';
import * as commaNumber from 'comma-number'

import Links from '@config/data/links';
import Avatar from '@components/layout/elements/avatar';
import Button from '@components/ui/general/button';
import Select from '@components/ui/forms/elements/select';
import { Actions } from '@services';

class SubHeader extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            links: [],
            greeting: "Good Morning"
        }
        this.generateLinks       = this.generateLinks.bind(this)
        this.updateActiveAccount = this.updateActiveAccount.bind(this)
    }
    async componentDidMount () {

        var self = this
        //set Greeting
        setInterval( async () => {
            let nDate = new Date();
            let hours = nDate.getHours();
    
            //00- 12, 12-18, 18-23
            let greeting = hours < 12 ? `Good Morning` : hours < 18 ? `Good afternoon` : `Good Evening`;
    
            await self.setState({
                greeting
            })
        }, 60000)

        const { router : { pathname } } = this.props

        let shortcuts = Links.shortcuts

        let links = shortcuts.map(link => {
            link.active = false
            let linkPath = link.path
            if(pathname.includes(linkPath.split('/')[1])){
                link.active = true
            }

            if(link.child && link.child.includes(pathname)){
                link.active = true
            }

            if(link.path === pathname){
                link.active = true
            }

            return link
        })

        await this.setState({
            links
        })
    }
    updateActiveAccount (inputId, formId, activeAcc) {
        // { textInput: input, input: input }

        if(activeAcc && activeAcc.input && activeAcc.input.length > 0){

            let { dispatch }     = this.props
            dispatch ( Actions.setActiveAccount ({ 
                account: activeAcc.input
            }))
        }

    }
    generateLinks () {
        let { links } = this.state;

        return links.map((link, index) => (
            <HeaderDiv isFirst = {index === 0 ? true : false} key = { index } isActive = {link.active}>
                <HeaderLink tw = 'px-1 text-sm tracking-wide flex flex-row items-center text-center' isActive = {link.active}>
                    <Link href = { link.path } ><a>{ link.title }</a></Link>
                    <Icon icon= { 'circle' } style = {{ color: "inherit", fontSize: 7, marginLeft: 10 }}/>
                </HeaderLink>
            </HeaderDiv>
        ))
    }
    render() {
        let { userData: { accountInfo, personalInfo: { name }, securityInfo : { last_login } }, activeData, accountData, signOut = () => null } = this.props;
        let { greeting } = this.state;

		let selectedAccount     = activeData.activeAccount.account
        let balanceArray = { ActualBal: "0.00", AvailableBal: "0.00" }
		try {
			balanceArray = accountData[activeData.activeAccount.account].balance || {}
		}
		catch ( e ) {

		}
		let activeAccountInfo = accountInfo.find(e => e && e.accountNumber === activeData.activeAccount.account) || {}
        let accList = accountInfo.map((acc, index) => {
            return {
                id: index + 1,
                name: acc.accountNumber
            }
        })

        let names = name.split(' ').filter(e => e && e)
        let initials = 'MM'
        if(names.length > 1){
            initials = `${names[0].charAt(0)}${names[1].charAt(0)}`
        }else{
            initials = `${names[0].charAt(0)}${names[0].charAt(1)}`
        }
        return (
            <div tw = "w-full">
                <div tw = "hidden md:flex flex-row h-12 w-full items-center justify-center bg-primary-100" >
                    { this.generateLinks()}
                </div>

                <div tw = "flex flex-row flex-wrap items-center">
                    <Container tw = "flex flex-row justify-between w-full px-4 pt-2 pb-1 border-b border-gray-200 rounded-sm md:(border-r border-gray-200 w-1/3 h-32)">

                        <Avatar xl initials = {initials} />

                        <div tw = "flex flex-col pl-1 leading-10 md:pl-0">
                            <p tw = "text-opacity-20">{greeting},</p>
                            <h1 tw = "text-base font-bold">{names[0]}</h1>
                            <span tw = "font-serif">Last Login: {last_login}</span>
                        </div>

                        <button onClick = {signOut} tw = "flex items-center justify-center px-4 mt-2 text-sm text-center text-white capitalize rounded-md shadow-none outline-none cursor-pointer sm:px-5 h-11 active:outline-none hover:opacity-80 focus:outline-none bg-danger">&nbsp;SIGN OUT</button>
                    </Container>

                    <Container tw = "w-full px-4 pt-4 pb-2 border-b border-gray-200 rounded-sm md:(w-1/3 h-32 pt-3 border-r border-gray-200)">
                        <div tw = "flex flex-row items-start justify-between">
                            <p tw = "flex flex-col leading-relaxed tracking-wide">
                                <span tw = "text-sm font-semibold">Account Name</span>
                                <span tw = "text-base font-bold">{ activeAccountInfo.accountName }</span>
                            </p>
                            
                            <p tw = "flex flex-col m-0 leading-relaxed tracking-wide text-right">
                                <span tw = "text-sm font-semibold" >Account Number</span>
                                <span tw = "text-base font-light">{selectedAccount}</span>
                            </p>
                        </div>

                        <div tw = "flex flex-row items-center justify-between pt-5">
                            <p tw = "flex flex-col leading-loose tracking-wide">
                                <span tw = "text-sm text-secondary-300">Account Balance</span>
                                <span tw = "text-sm font-medium">{ activeAccountInfo.currency } { balanceArray.AvailableBal ? commaNumber(balanceArray.AvailableBal) : "---,---.--"}</span>
                            </p>

                            <div>
                                <Button outlined primary callback = {() => Router.push('/my-products/my-accounts') }>Full Acc Details</Button>
                            </div>
                        </div>
                    </Container>

                    <Container tw = "flex flex-row justify-between w-full px-4 pt-4 pb-2 border-b border-gray-200 rounded-sm md:(w-1/3 h-32 items-center)">
                        {/* <div tw = "block pr-3 text-right border-r border-gray-400 md:hidden">
                            <span tw = "text-sm font-medium tracking-wider" >Acc-Numb</span>
                            <span tw = "block text-xs font-light tracking-wide">{selectedAccount}</span>
                            
                            <div tw = "pt-3">
                                <Button outlined primary callback = {() => Router.push('/my-products/my-accounts') }>Full Acc Details</Button>
                            </div>
                        </div> */}

                        <div tw = "w-full pl-2">
                            <Select variant = 'outlined' 
                                style = {{}} 
                                optionsList = {accList} 
                                value = {selectedAccount}
                                updateState = {this.updateActiveAccount}
                                updateText = {this.updateActiveAccount}
                                inputId = "useraccounts" 
                                label = "My Accounts" 
                            />

                            <div tw = "flex flex-row items-center justify-between text-xs font-semibold text-primary-100">
                                <p onClick = {() => Router.push('/transfer-money/own-transfers')} tw = "flex items-center cursor-pointer">Quick transfer <span><Icon icon= { 'chevron-right' } style = {{ color: "inherit" }}/></span></p>

                                <p onClick = {() => Router.push('/my-products/my-accounts/statement')} tw = "flex items-center m-0 cursor-pointer">View statements <span><Icon icon= { 'chevron-right' } style = {{ color: "inherit" }}/></span></p>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        )
    }
};

const HeaderLink = styled.div`
    ${props => props.isActive ? tw`bg-white text-primary-100` : tw`text-white`};
`;


const Container = styled.div`
    background: ${p => p.theme.bgColor};
`;

const HeaderDiv = styled.div`
    ${tw`flex flex-row h-full font-semibold capitalize cursor-pointer`};
    ${p => p.isFirst ? '' : tw`pl-7`}
`;

const mapStateToProps = (state) => ({
    userData : state.userData,
    activeData : state.activeData,
    accountData : state.accountData
})


export default connect(mapStateToProps)(withRouter(SubHeader))
