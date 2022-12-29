// we want to get the sidebar configs from data then a user just passes the params in the function
// we return a filtered and formatted config
// import Links from '@config/data/links'

import Links  from '@config/data/links';

const sharedLinks        = Links['sidenav']
const corporateLinks     = Links['corporateLinks']

export const GenerateLinks = ( type = 'default', include = ['*'] ) => {

    let generated = {  }

    switch ( type.toLowerCase() ) {
        case 'default':
            generated = { ...generated, ...sharedLinks }
            break;

        case 'corporate':
            generated = { ...generated, ...corporateLinks, ...sharedLinks }
            break;
    }

    //Sidebar Permissions
    if(include[0] !== '*'){
        let linkKeys = Object.keys(generated)
        let allMenus = {}
        
        for(let key of linkKeys){
            let link = generated[key]

            //No permissions configured
            if(!link.serviceId){
                allMenus[key] = generated[key]
            }
            //Is Included ID
            if(link.serviceId && typeof link.serviceId === 'string' && include.includes(link.serviceId)){
                allMenus[key] = generated[key]
            }
            //Is Included ID
            if(link.serviceId && Array.isArray(link.serviceId) && include.includes(...link.serviceId)){
                allMenus[key] = generated[key]
            }
            //Has Children
            if(link.children && allMenus[key]){
                allMenus[key]['children'] = link.children.map(child => {
                    if(!child.sId || child.sId && include.includes(child.sId)){
                        return child
                    }
                }).filter(e => e && e)
            }
        }
        generated = { ...allMenus }
    }

    return generated

}
