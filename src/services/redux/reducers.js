import * as constants 					 from './constants';
import { combineReducers }               from 'redux'

let sidebarMenuReducer = (active = 'Dashboard', { type, payload }) => {
	switch ( type ) {
		case constants.SET_ACTIVE_SIDEBAR:
			return  payload
		default:
			return active

	}
}
let sideMiniMenuReducer = (active = 'Dashboard', { type, payload }) => {
	switch ( type ) {
		case constants.SET_ACTIVE_MINI_SIDEBAR:
			return  payload
		default:
			return active

	}
}
let titleReducer = (title = 'ikonnect', { type, payload }) => {
	switch ( type ) {
		case constants.CHANGE_NAME:
			return  payload
		default:
			return title

	}
}
let themeReducer = (theme = {}, {type, payload}) => {
	switch (type) {
        case constants.USE_THEME:
            return { ...theme, mode: payload}
        
        case constants.MAGNIFY_TEXT:
            return { ...theme, textZoom: payload}
            
        default:
            return theme
            
    }
}
let userDataReducer = (userData = {}, { type, payload }) => {
	switch (type) {
		case constants.UPDATE_USER_DATA:
			return  { ...userData, ...payload }
		default:
			return userData

	}
}
let activeDataReducer = (activeData = {}, { type, payload }) => {
	switch (type) {
		case constants.SET_ACTIVE_ACCOUNT:
			return  { activeAccount: payload }
		default:
			return activeData

	}
}
let accountDataReducer = (accountData = {}, { type, payload }) => {
	switch (type) {
		case constants.UPDATE_ACCOUNT_DATA:
			return  { ...accountData, ...payload }
		default:
			return accountData

	}
}
let chatReducer = (chatData = {}, { type, payload }) => {
	switch (type) {
		case constants.UPDATE_CHAT_DATA:
			return  { ...chatData, ...payload }
		default:
			return chatData

	}
}


const rootReducer = combineReducers({
	title                 : titleReducer,
	userData              : userDataReducer,
	activeData            : activeDataReducer,
	accountData           : accountDataReducer,
	chat                  : chatReducer,
    theme				  : themeReducer,
	activeSideMenu 		  : sidebarMenuReducer,
	activeSideMiniMenu 	  : sideMiniMenuReducer
}) 

export default rootReducer