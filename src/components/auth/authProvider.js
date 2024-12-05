import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "slices/userSlice";
import { useAuth } from "hooks/useAuth";
import Loader from "components/ui/loaderPage/LoaderPage";
import { PlatformUrl } from "constants/global";


const AuthProvider = ({children}) => {
	const {refresh_token,token,fetchUserDataStatus} = useAuth()

	const dispatch = useDispatch()


	useEffect(()=> {
		if (refresh_token && token) {
			dispatch(fetchMe(refresh_token))
		} else {

			// window.location.replace(`http://localhost:3001/login`)

			window.location.replace(`${PlatformUrl}login`)
		}
	},[])


	if (fetchUserDataStatus === "loading" || fetchUserDataStatus === "idle") {
		return <Loader/>
	} else if (fetchUserDataStatus === "success") {
		return children
	} else {
		// window.location.replace(`http://localhost:3001/login`)
		window.location.replace(`${PlatformUrl}login`)
	}


}

export default AuthProvider