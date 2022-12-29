"use strict"

export default (payload) => {
	
	let message = ''
	
	// Handle payload by type
	switch (payload.type) {
		case 'full-statement':{
			if ( payload.leg === 'transact' && payload.success ){
				message += `Your statement has been generated successfully. Kindly check your email`
			}
		}break;

		case 'zuku-tv-bill-payment': {
			if ( payload.leg === 'transact' && payload.success ){
				message = `I payed my Zuku TV subscription instantly`
			}
			if ( payload.leg === 'charges' && payload.success ){
				message = `
					Hey ${payload.firstName},<br/>
					You have requested to pay Zuku TV subscription amount: ${payload.currency} ${payload.amount} KES <br/>
					The smart card number to be topped up is ${payload.account} <br/>
					Is this correct?
				`
			}
			
		}break;

		default:
			break;
	}

	return message
}