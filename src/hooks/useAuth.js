import {useSelector} from "react-redux";


export function useAuth() {

    const token = sessionStorage.getItem("token")
    const refresh_token = sessionStorage.getItem("refresh_token")
    const selectedLocation = localStorage.getItem("selectedLocation")


    const {data,fetchUserDataStatus,isCheckedPassword} = useSelector(state => state.user)


    const {username,name,surname,id,role,location,platform_id, observer,system_name} = data


    const restrictionsMenu = {
        observer: observer,
    }

    return {
        isAuth: !!username,
        user:username,
        role,
        token,
        username,
        name,
        id,
        surname,
        fetchUserDataStatus,
        refresh_token,
        location,
        selectedLocation,
        isCheckedPassword,
        platform_id,
        restrictionsMenu,
        system_name
    }
}

