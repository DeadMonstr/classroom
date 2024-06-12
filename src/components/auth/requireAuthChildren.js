import React from 'react';
import {useAuth} from "hooks/useAuth";


const RequireAuthChildren = ({allowedRules,children}) => {

    const {role} = useAuth()



    return (
        allowedRules.includes(role)
            ? children
            : null
    );

}



export default RequireAuthChildren
