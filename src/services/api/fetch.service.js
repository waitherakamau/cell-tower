import axios                from 'axios';
import https                from 'https';
import moment               from 'moment';
import Cookies 		        from 'universal-cookie';

import conf 	            from '@services/api/';
import encryptedData        from '@services/helpers/encrypt-decrypt';
import decrytPayload        from '@services/helpers/auth-decrypt';

let customTimeout = 180000 // 3 minutes

const fetch = async ( method, url, data, headers, skipAuth ) => {
	// Defaults
	let response     = {}
	let responseData = {}
	let success      = false
	let statusCode   = 408  //timeout http code
	let postData     = data
	let urlPath      = url
	let headerConfig = headers || { }
    
	//Fetch cookies
	let JwtCookie = new Cookies().get('jwt_token')
	let xsrfCookie = new Cookies().get('XSRF-TOKEN')

    //Add Auth header
	if(JwtCookie){
		headerConfig['Authorization'] = `Bearer ${JwtCookie}`
	}
	if(xsrfCookie){
		headerConfig['XSRF-TOKEN'] = xsrfCookie
	}

    //Create URL
	if(!url.startsWith('http')){
		urlPath = `${conf.protocol}://${conf.host}:${conf.port}/${url}`
	}
	if(!conf.port){
		urlPath = `${conf.protocol}://${conf.host}/${url}`
	}

    //Encrypt data
	if(!skipAuth){
		postData = { 
            timestamp: moment().format(),
            payload: encryptedData(postData)
        }
	}
	
	// Axios Instance
    let instance = axios.create()

    if ( urlPath.startsWith('https') ){
        instance = axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
    }
	
	instance.defaults.timeout = customTimeout	
	//instance.defaults.withCredentials = true		

	// Timeout when not connected to the internet
	//create interceptor for 401 token expiry
	//const source = axios.CancelToken.source()

	// Attempt Request
	try {

		switch ( method ) {
			case "get":
				try {
					response = await instance.get(urlPath, postData, { headers: headerConfig } )
				} catch (error) {
					response = error.response
				}
				break

			case "post":
				try {
					response = await instance.post(urlPath, postData, { headers: headerConfig })
				} catch (error) {
					response = error.response
				}
				break
		}

		statusCode   = response.status
		responseData = response.data

		if(statusCode === 200){
			success = true

			if(!skipAuth){
				responseData = decrytPayload(responseData.message)
			}
		}
		//console.log({ data, res: response.data, responseData})

		return { success, statusCode, responseData }
	}
	catch (e) {
		return { success: false, statusCode, error:`API Fetch Error - ${e.message}`, responseData }
	}
}

export default fetch