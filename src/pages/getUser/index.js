import React, {useEffect} from 'react';
import { useNavigate, useParams } from "react-router";
import { useDispatch} from "react-redux";
import { setUserData } from "slices/userSlice";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import Loader from "components/ui/loaderPage/LoaderPage";


const GetUser = () => {
	const {token,refreshToken} = useParams()


	const dispatch = useDispatch()
	const {request} = useHttp()

	const navigate = useNavigate()

	useEffect(() => {



		sessionStorage.setItem("oldToken",token)
		sessionStorage.setItem("oldRefreshToken",refreshToken)

		request(`${BackUrl}send_user/${token}`,"GET",null,headers())
			.then(res => {
				dispatch(setUserData({data: {
					...res.data.info,
					access_token: res.data.access_token,
					refresh_token: res.data.refresh_token,
				}}))


				navigate("/home")
			})


	},[token])

	return (
		<Loader/>
	);
};

export default GetUser;