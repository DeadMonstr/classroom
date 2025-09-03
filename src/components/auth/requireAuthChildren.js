import React from 'react';
import {useAuth} from "hooks/useAuth";


const RequireAuthChildren = ({allowedRules,children , allowedSystem}) => {

    const {role} = useAuth()

    const system = localStorage.getItem("system_type")
    console.log(allowedSystem , "allowedSystem")



    return (
        allowedRules.includes(role) || allowedSystem === system
            ? children
            : null
    );

}



export default RequireAuthChildren
