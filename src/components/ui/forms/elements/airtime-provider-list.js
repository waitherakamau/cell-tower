import tw from 'twin.macro';
import React 				from 'react';
import styled from 'styled-components';

export default class AitimeProviderList extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
			active: ''
		}
		this.setActive = this.setActive.bind (this)
	}
	onChange (val) {

		const { updateState, inputId, formId } = this.props

		updateState ( inputId,formId, { hasError: false, input: val, message : "" } )

		let name =  val.toLowerCase()
		this.setActive ( name )
	}
	setActive (active){
		this.setState({
			active
		})
	}

	componentDidMount(){
		const { optionsList } = this.props		

		optionsList.map ( ( option, index ) => {

			let name =  option.value.toLowerCase()

			if ( option.default ){
				this.setActive ( name )
			}
		})
	}
    render() {
        const { optionsList, inputId, value, dataKey, focusColor } = this.props
		let { active } = this.state
        let imageSrc = '/images/shared/safaricom.png'	
        
        return (
            <div tw = "flex flex-row items-center mb-3" data-key = { dataKey } key = { dataKey } >
                {
                    optionsList.map((option, index) => {
                        let name =  option.value.toLowerCase()

						switch ( name ) {
							case "safaricom":
								imageSrc = '/images/shared/safaricom.png'
								break;
							case "telkom":
								imageSrc = '/images/shared/telkom.png'
								break;
							case "airtel":
								imageSrc = '/images/shared/airtel.png'
								break;
                        }
                        return (
                            <Container
								key 		= { option.value } 
								data-key 	= { option.value }								
								onClick  	= { () => this.onChange ( option.value )}
								inputSize   = {index+1 !== optionsList.length ? true : false}
							>
                                <ImageWrapper>
                                    <Image tw = "w-full rounded overflow-hidden" src = { imageSrc } active = {active === name ? true : false} alt = {`${name}`} />
                                </ImageWrapper>

                                <label tw = "capitalize mt-3 text-gray-600" >{ option.label.toLowerCase() }</label>
                            </Container>
                        )
                    })
                }
            </div>
        )
    }
};

const Container = styled.div`
	${tw`flex flex-col items-center`};
	${props => props.inputSize ? tw`mr-7` : tw`mr-0`}
`;

const Image = styled.img`
	filter: ${props => props.active ? 'grayscale(0%)' :  'grayscale(100%)'};

`;

const ImageWrapper = styled.div`
    ${tw`w-24 cursor-pointer h-11`};
    & :hover ~ ${Image} {
        filter: grayscale(0%);
    }
`;
