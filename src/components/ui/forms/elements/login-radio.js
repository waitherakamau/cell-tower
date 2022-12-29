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
							/>

							{/* radio label */}
							<Placeholder>{ option.label }</Placeholder>

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
        ${tw`relative inline-block w-5 h-5 mr-1 bg-transparent top-1 rounded-xl border-3 border-primary-100`};
        content         : " ";
    }
`;

const RadioInput = styled.input`
    ${tw`hidden`};
    & :checked ~ ${Placeholder} {
        &:after{
            ${tw`absolute block w-2 h-2 left-1.5 rounded-xl`};
            content      : " ";
			top: 3px;
            background   : ${p => p.theme.primaryColor};
        }
    }
`;

export default RadioButton