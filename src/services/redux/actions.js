import * as constants from './constants';

const actions = {
	updateActiveSideMiniMenu      : ( payload ) => {
		return {
			type: constants.SET_ACTIVE_MINI_SIDEBAR,
			payload
		}
	},
	updateActiveSideMenu      : ( payload ) => {
		return {
			type: constants.SET_ACTIVE_SIDEBAR,
			payload
		}
	},
	setActiveAccount      : ( payload ) => {
		return {
			type: constants.SET_ACTIVE_ACCOUNT,
			payload
		}
	},
	updateUserData        : ( payload ) => {
		return {
			type : constants.UPDATE_USER_DATA,
			payload
		}
	},
	updateAccountData     : ( payload ) => {
		return {
			type : constants.UPDATE_ACCOUNT_DATA,
			payload
		}
	},
	updateTheme      : ( payload ) => {
		return {
			type: constants.USE_THEME,
			payload
		}
	},
	magnifyText      : ( payload ) => {
		return {
			type: constants.MAGNIFY_TEXT,
			payload
		}
	},
	changeNameInState     : ( payload ) => {
		return {
			type : constants.CHANGE_NAME,
			payload
		}	
	},
	updateChatSettings    : ( payload ) => {
		return {
			type : constants.UPDATE_CHAT_DATA,
			payload
		}	
	}
}

export default actions