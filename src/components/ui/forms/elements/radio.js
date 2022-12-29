import tw from 'twin.macro';
import styled from 'styled-components';

const RadioButton = ({ optionsList, inputId, value, dataKey, focusColor, style, updateState, formId, 	
	onBlur        = false,
	onBlurActions = false,
	formStatus    = {},
	txnData       = {} }) => {
	let onChange = ( val ) => {

		updateState ( inputId,formId, { hasError: false, input: val, message : "" } )

		onBlur && onBlurActions && onBlurActions [ onBlur ] && onBlurActions [ onBlur ]({ ...formStatus, input: val, inputId,...txnData })
	}	

	return (
		<Container tw =  "flex flex-row items-center mb-3" data-key = { dataKey } key = { dataKey } hasRight = {style.mdRight}>
			{
				optionsList.map ( ( option, index ) => {
					return (
						<div 
							tw 	= "relative inline-block pr-3 mt-3 mr-5" 
							key 		= { option.value } 
							data-key 	= { option.value }								
							onClick  	= { () => onChange ( option.value )}
						>

							{/* radio input */}
							<RadioInput 
								type     = "radio" 
								id       = { option.value } 
								name     = { inputId } 
								value    = { option.value }
								checked  = { option.value === value ? true : false }
								onChange = { () => alert ( `Value is - ${ option.value }` )}
								focusColor = {focusColor}
								bgColor  ={style.bgColor}
							/>

							{/* radio label */}
							<Placeholder bgColor={style.bgColor} >{ option.label }</Placeholder>

						</div>
					)
				})
			}

		</Container>
	)
}

const Container = styled.div`
	${p => p.hasRight ? tw`md:ml-sm` : ''};
`;

const Placeholder = styled.label`
    ${tw`relative`};
    & :before {
        ${tw`relative inline-block w-5 h-5 mr-1 bg-transparent top-1 rounded-xl border-2 border-gray-100`};
			${props=> props.bgColor ? { borderColor: props.bgColor } : '' };
        content         : " ";
    }
`;

const RadioInput = styled.input`
    ${tw`hidden`};
    & :checked ~ ${Placeholder} {
        &:after{
            ${tw`absolute block w-3 h-3 left-1 rounded-xl bg-gray-100`};
            content      : " ";
			top: 4px;
			${props=> props.bgColor ? { backgroundColor: props.bgColor } : '' };
            /* background   : ${p => p.theme.primaryColor}; */
        }
    }
`;

export default RadioButton