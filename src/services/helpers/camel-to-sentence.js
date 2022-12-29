const camelToSentence = ( text ) => {
	text            = text.replace('form-','')
	let result      = text.replace( /([A-Z])/g, " $1" )
	let finalResult = result.charAt(0).toUpperCase() + result.slice(1)
		
	return finalResult
}

export default camelToSentence