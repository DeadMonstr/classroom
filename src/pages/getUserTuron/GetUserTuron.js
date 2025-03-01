import React, {useEffect} from 'react';
import { useNavigate, useParams } from "react-router";
import { useDispatch} from "react-redux";
import { setUserData } from "slices/userSlice";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import Loader from "components/ui/loaderPage/LoaderPage";


const GetUserTuron = () => {
	const {token,refreshToken,username} = useParams()


	const dispatch = useDispatch()
	const {request} = useHttp()

	const navigate = useNavigate()

	useEffect(() => {

		sessionStorage.setItem("oldToken", token)
		sessionStorage.setItem("oldRefreshToken", refreshToken)



		request(`${BackUrl}turon_user/${username}`,"GET",null,headers())
			.then(res => {
				localStorage.setItem("typePlatform", "turon")

				dispatch(setUserData({data: {
					...res.info,
					access_token: res.access_token,
					refresh_token: res.refresh_token,
				}}))


				navigate("/home")
			})


	},[token])

	return (
		<Loader/>
	);
};

export default GetUserTuron;