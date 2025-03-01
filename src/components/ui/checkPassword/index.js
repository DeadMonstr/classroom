import React, { useState } from 'react';


import styles from "./style.module.sass"

import Modal from "components/ui/modal";
import Input from "components/ui/form/input";
import Button from "components/ui/button";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { useDispatch } from "react-redux";
import { setCheckedPassword } from "slices/userSlice";
import { useNavigate } from "react-router";
import Loader from "components/ui/loaderPage/LoaderPage";


const CheckPassword = ({active,setActive}) => {

	const [password,setPassword] = useState("")
	const [loading,setLoading] = useState(false)

	const {request} = useHttp()


	const dispatch = useDispatch()

	const onSubmit = () => {
		setLoading(true)
		request(`${BackUrl}check_password`,"POST",JSON.stringify({password}),headers())
			.then(res => {
				setLoading(false)
				if (res.password) {
					dispatch(setCheckedPassword(true))
				}
			})
	}

	const navigate = useNavigate()

	const back = () => {
		navigate(-1)
	}
	return (
		<>
			<Modal active={active} setActive={setActive ? setActive : back} title={"Foydalanuvchini tekshirish"}>
				<Input type={"password"} title={"Parol"} onChange={setPassword}/>
				<br/>
				<Button onClick={onSubmit} type={"submit"} >Tasdiqlash</Button>
			</Modal>

			{
				loading ? <Loader/> : null
			}
		</>


	);
};

export default CheckPassword;