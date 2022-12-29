import tw from 'twin.macro';
import React 				from 'react';
import styled from 'styled-components'

export default class AirtimeAmountList extends React.Component {
    constructor (props) {
		super (props)
		this.state = {
			active: ''
		}
		this.setActive = this.setActive.bind(this)
	}
	onChange (val) {
		const { updateState, inputId, formId } = this.props

		updateState(inputId, formId, { hasError: false, input: val, message : "" })

		let name =  val.toLowerCase()
		this.setActive (name)
	}
	setActive (active){
		this.setState({
			active
		})
	}
	componentDidMount(){
		const { optionsList } = this.props		

		optionsList.map ((option, index) => {

			let name =  option.value.toLowerCase()

			if ( option.default ){
				this.setActive (name)
			}
		})
	}
    render() {
        const { optionsList, inputId, value, dataKey, focusColor } = this.props
		let { active } = this.state
        return (
            <div tw = "flex flex-row items-center mb-3" data-key = {dataKey} key = {dataKey}>
                {
                    optionsList.map((option, index) => {
                        let name =  option.value.toLowerCase();
                        return (
                            <div tw = "flex items-center mr-4 cursor-pointer" 
                                key 		= { option.value } 
								data-key 	= { option.value }								
								onClick  	= { () => this.onChange (option.value)}
                            >
                                <Div active = {`${ active === name ? true : false }`} >
                                    { option.label.toLowerCase() }
                                </Div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

const Div = styled.div`
    ${tw`flex items-center justify-center w-20 h-12`};
    border     : 2px solid ${props =>  props.active ? 'orange' : props.theme.primaryColor};
    background : ${props => props.active ? 'orange' : ''};
	color      : ${props => props.active ? 'white' : ''};
`;