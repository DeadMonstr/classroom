import React, { useEffect, useState } from 'react';
import Back from "components/ui/back";

import styles from "./styles.module.sass"
import Input from "components/ui/form/input";
import Button from "components/ui/button";
import Form from "components/ui/form";
import { useForm } from "react-hook-form";
import { useHttp } from "hooks/http.hook";
import {BackUrl, headers, headersOldToken, headersOldTokenImg, PlatformUrl, PlatformUrlApi} from "constants/global";
import { useDispatch, useSelector } from "react-redux";
import { changeUserData } from "slices/userSlice";
import { json } from "react-router";
import { useAuth } from "hooks/useAuth";
import CheckPassword from "components/ui/checkPassword";
import Textarea from "components/ui/form/textarea";
import ImgInput from "components/ui/form/imgInput";


const ChangeProfile = () => {
	const {isCheckedPassword} = useAuth()

	console.log(isCheckedPassword)
	if (!isCheckedPassword) {
		return <CheckPassword active={true} />
	}

	return (
		<div className={styles.changeProfile}>
			<Back/>
			<div className={styles.header}>
				<h1>Ma'lumotlarni o'zgartirish</h1>
			</div>
			<div className={styles.container}>

				<Username/>
				<Password/>
				<SocialLinks/>

			</div>
		</div>
	);
};


const Username = () => {

	const {register,handleSubmit,formState:{errors},watch,setError,clearErrors} = useForm()
	const {data:{platform_id,username,id}} = useSelector(state => state.user)
	const watchUsername = watch("username")


	const {request} = useHttp()
	const dispatch = useDispatch()



	useEffect(() => {

		if (username !== watchUsername && watchUsername !== undefined && watchUsername !== "") {
			const oldToken = sessionStorage.getItem("oldToken")
			const headersPlatform = {
				"Authorization" : "Bearer " + oldToken,
				'Content-Type': 'application/json'
			}
			request(`${PlatformUrlApi}check_username`,"POST",JSON.stringify(watchUsername),headersPlatform)
				.then(res => {
					if (res.found) {
						setError('username', { type: 'custom', message: 'Username band' })
					} else {
						clearErrors("username")
					}
				})
		} else {
			clearErrors("username")
		}


	},[ username, watchUsername])



	const onSubmit = (data) => {
		const newData = {
			...data,
			type: "info"
		}

		const oldToken = sessionStorage.getItem("oldToken")
		const headersPlatform = {
			"Authorization" : "Bearer " + oldToken,
			'Content-Type': 'application/json'
		}



		request(`${PlatformUrlApi}change_student_info/${platform_id}`,"POST",JSON.stringify(newData),headersPlatform)
		request(`${BackUrl}change_pas_user/${id}`,"POST",JSON.stringify(newData),headers())
			.then(res => {
				dispatch(changeUserData({value: res.data.username,name: "username"}))
			})
	}



	return(
		<Form
			id={"form-username"}
			extraClassname={`${styles.box} ${styles.username}`}
			typeSubmit={"outside"}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Input
				extraValues={{
					minLength: {
						value: 3,
						message: "Username 3 tadan kam bo'lmasligi kerak"
					},
				}}
				value={username}
				errors={errors}
				register={register}
				name={"username"}
				title={"Username"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
			/>

			<Button form={"form-username"} type={"submit"} >Tasdiqlash</Button>
		</Form>
	)
}

const Password = () => {

	const {register,handleSubmit,formState:{errors},setError,clearErrors,watch} = useForm({
		defaultValues: {
			password: "",
			passwordConfirm: ""
		}
	})


	const [isDisabled,setIsDisabled] = useState(true)

	const {data:{platform_id,id}} = useSelector(state => state.user)

	const password = watch("password")
	const passwordConfirm = watch("passwordConfirm")



	const {request} = useHttp()
	const dispatch = useDispatch()
	const onSubmit = (data) => {
		const newData = {
			...data,
			type: "password"
		}

		const oldToken = sessionStorage.getItem("oldToken")
		const headersPlatform = {
			"Authorization" : "Bearer " + oldToken,
			'Content-Type': 'application/json'
		}

		request(`${PlatformUrlApi}change_student_info/${platform_id}`,"POST",JSON.stringify(newData),headersPlatform)
		request(`${BackUrl}change_pas_user/${id}`,"POST",JSON.stringify(newData),headers())
			.then(res => {
				dispatch(changeUserData({value: res.data.img,name: "img"}))
			})
	}

	useEffect(() =>{
		if (password.length > 0 && passwordConfirm.length > 0 && password !== passwordConfirm) {
			setError("password", {
				type: "manual",
				message: "Parollar bir biriga o'xshash emas",
			})
			setIsDisabled(true)
		} else if (password.length > 0 && passwordConfirm.length > 0 && password === passwordConfirm) {
			clearErrors("password")
			setIsDisabled(false)
		}
	},[password, passwordConfirm, setError])


	return (
		<Form
			id={"form-password"}
			extraClassname={`${styles.box} ${styles.username}`}
			typeSubmit={"outside"}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Input
				extraValues={{
					minLength: {
						value: 8,
						message: "Parol 8 tadan kam bo'lmasligi kerak"
					},
				}}
				type={"password"}
				errors={errors}
				register={register}
				name={"password"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
				title={"Parol"}

			/>
			<Input
				type={"password"}
				errors={errors}
				register={register}
				name={"passwordConfirm"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
				title={"Parolni tasdiqlang"}
			/>
			<Button disabled={isDisabled} form={"form-password"} type={"submit"} >Tasdiqlash</Button>
		</Form>
	)
}



const SocialLinks = () => {

	const {data:{telegram,instagram,text,facebook,certificate}} = useSelector(state => state.user)

	const {register,handleSubmit,formState:{errors},setError,clearErrors,watch} = useForm({
		defaultValues: {
			telegram: telegram,
			instagram: instagram,
			facebook: facebook,
			text: text
		}
	})

	const [img,setImg] = useState()



	const {request} = useHttp()
	const dispatch = useDispatch()
	const onSubmit = (data) => {
		const newData = {
			...data,

		}


		const formData = new FormData()

		console.log(newData)
		formData.append("res", JSON.stringify(newData))
		formData.append("img", img)


		request(`${PlatformUrlApi}change_teacher_data`,"POST",formData,headersOldTokenImg())
			.then(res => {
				console.log(res)
			})
	}



	return (
		<Form
			id={"form-socialLinks"}
			extraClassname={`${styles.box} ${styles.username}`}
			typeSubmit={"outside"}
			onSubmit={handleSubmit(onSubmit)}
		>
			<ImgInput databaseImg={`${PlatformUrl}${certificate}`} url img={img} setImg={setImg} title={"Sertifikat kiriting"} />
			<Textarea
				type={"text"}
				errors={errors}
				register={register}
				name={"text"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
				title={"O'zingiz haqida ma'lumot"}
			/>
			<Input
				type={"text"}
				errors={errors}
				register={register}
				name={"telegram"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
				title={"Telegram Link"}
			/>
			<Input
				type={"text"}
				errors={errors}
				register={register}
				name={"instagram"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
				title={"Instagram Link"}
			/>
			<Input
				type={"text"}
				errors={errors}
				register={register}
				name={"facebook"}
				style={{
					marginBottom : "1rem"
				}}
				required={true}
				title={"Facebook Link"}
			/>
			<Button form={"form-socialLinks"} type={"submit"} >Tasdiqlash</Button>
		</Form>
	)
}

export default ChangeProfile;