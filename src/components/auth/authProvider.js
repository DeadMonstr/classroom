import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "slices/userSlice";
import { useAuth } from "hooks/useAuth";
import Loader from "components/ui/loaderPage/LoaderPage";
import { PlatformUrl } from "constants/global";
import {useNavigate} from "react-router";


const AuthProvider = ({children}) => {
	const {refresh_token,token,fetchUserDataStatus} = useAuth()

	const dispatch = useDispatch()
	const navigate = useNavigate()


	useEffect(()=> {
		if (refresh_token && token) {
			dispatch(fetchMe(refresh_token))
		} else {
			navigate("/login")
		}
	},[])


	if (fetchUserDataStatus === "loading" || fetchUserDataStatus === "idle") {
		return <Loader/>
	} else if (fetchUserDataStatus === "success") {
		return children
	} else {
		navigate(`/login`)
	}


}

export default AuthProvider