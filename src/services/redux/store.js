/**=============================
 * 
 *  IMPORTS
 * 
 =============================*/
//import redux 
import { compose, applyMiddleware, createStore  } from 'redux'

//import services
import initial from './state';
import reducers from'./reducers'; 

//import middleware
import thunk from 'redux-thunk'

//redux persist
import { persistStore, persistReducer } from 'redux-persist'
import storageSession  from 'redux-persist/lib/storage/session'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { encryptTransform } from 'redux-persist-transform-encrypt'

/**=============================
 * 
 *  REDUX PERSIST
 * 
 =============================*/
const encryptor = encryptTransform({
	secretKey: process.env.REDUXKEY,
	onError: function(error) {
	  // Handle the error
	}
})

const persistConfig = {
	key            : 'root',
	storage        : storageSession ,	
	stateReconciler: autoMergeLevel2,
	transforms     : [encryptor]
}

//wrap our reducer with the persist reducer and its configs
const pReducer = persistReducer ( persistConfig, reducers )


/**=============================
 * 
 *  CONFIGURE STORE
 * 
 =============================*/

//configure our store 
const initStore =  ( initialState = initial ) => {
	/**
	 * For production apps use >>> let composeEnhancers = compose;
	 */

	let composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	let store            = createStore ( pReducer, initialState, composeEnhancers (
		applyMiddleware ( 
			thunk 
		)
	))
	let persistor = persistStore(store)

	return { store, persistor }
}

export default initStore