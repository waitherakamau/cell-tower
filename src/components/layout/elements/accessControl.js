import React from 'react'

const AccessControl = ({
    userPermissions = [],
    allowedPermissions = ['authorize:transaction'],
    children,
    renderNoAccess
}) => {
    //check permissions
    let checker = (arr, target) => target.length > 0 && target.every(v => arr.includes(v))
    let permitted = checker(allowedPermissions, userPermissions)

    if(permitted){
        return children
    }
    renderNoAccess()
    return null
}

export default AccessControl
