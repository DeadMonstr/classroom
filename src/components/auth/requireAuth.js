import React,{useEffect} from 'react';
import { Outlet, Navigate, useLocation } from "react-router-dom"
import {useAuth} from "hooks/useAuth";
import { useNavigate } from "react-router";




const RequireAuth = ({allowedRules}) => {

    const {role} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()





    if (allowedRules.includes(role)) {
        return <Outlet/>
    } else {
        return <Navigate to="/home" replace state={{ from: location }} />
    }

}



export default RequireAuth
