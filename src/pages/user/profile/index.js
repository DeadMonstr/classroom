import React, { useEffect, useRef, useState } from 'react';
import Back from "components/ui/back";


import styles from "./style.module.sass"
import defaultUserImg from "assets/user.png"
import Button from "components/ui/button";
import Modal from "components/ui/modal";
import { useHttp } from "hooks/http.hook";
import { isMobile } from "react-device-detect";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	BackUrl,
	BackUrlForDoc,
	headersImg,
	LogoutUrl,
	LogoutUrlPisa,
	PlatformUrl,
	PlatformUrlApi,
	ROLES
} from "constants/global";
import {changeUserData, onExit} from "slices/userSlice";
import CheckPassword from "components/ui/checkPassword";
import RequireAuthChildren from "components/auth/requireAuthChildren";



const Profile = () => {

	const {data,isCheckedPassword} = useSelector(state => state.user)

	const [openInnerModal,setOpenInnerModal] = useState(false)
	const [active,setActive] = useState(false)


	const dispatch = useDispatch()

	const logout = () => {

		dispatch(onExit())

		window.location.replace(data.system_name === "pisa" ? LogoutUrlPisa : LogoutUrl)
	}

	const ref = useRef()

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target) && openInnerModal === true)  {
				setOpenInnerModal(false)
			}
		}
		document.addEventListener("click",handleClickOutside)
		return () => document.removeEventListener("click", handleClickOutside)
	},[openInnerModal])



	const {username,age,img,name,surname,balance,born_date,father_name,parent_phone,phone,role} = data


	console.log(ROLES)

	return (
		<div className={styles.profile}>
			<Back/>
			{ROLES.Parent !== role  && <div className={styles.header}>
				<div className={styles.username}>
					<i className="fa-solid fa-user"></i>
					<span>{username}</span>
				</div>

				{
					isMobile ?
						<div className={styles.optionsMobile} ref={ref}>
							<div className={styles.btn} onClick={() => setOpenInnerModal(!openInnerModal)}>
								<i className="fa-solid fa-gear"></i>
							</div>
							<div className={classNames(styles.innerModal,{
								[`${styles.active}`]: openInnerModal
							})}>
								<Link to={"../changeProfile"} className={styles.item}>
									<i className="fa-solid fa-pen-to-square"></i>
									<span>Ma'lumotlarni o'zgartirish</span>
								</Link>
								<Link to={"../userLessonTime"} className={styles.item}>
									<i className="fa-solid fa-user-clock"></i>
									<span>Dars vaqti</span>
								</Link>
								<Link to={"../teacherSalary"} className={styles.item}>
									<i className="fa-solid fa-dollar-sign"></i>
									<span>Balans tarixi</span>
								</Link>
								<Link to={"../teacherSalary"} className={styles.item}>
									<i className="fa-solid fa-graduation-cap"></i>
									<span>Bitiruvchilar sertifikatlari</span>
								</Link>
								<RequireAuthChildren allowedRules={[ROLES.Student]}>
									<Link to={"../studentAttendance"} className={styles.item}>
										<i className="fa-solid fa-calendar-days"></i>
										<span>Davomat</span>
									</Link>
									<Link to={"../balanceHistory"} className={styles.item}>
										<i className="fa-solid fa-dollar-sign"></i>
										<span>Balans tarixi</span>
									</Link>
								</RequireAuthChildren>

								{/*<div className={styles.item}>*/}
								{/*	<i className="fa-solid fa-user-clock"></i>*/}
								{/*	<span>Dars vaqti</span>*/}
								{/*</div>*/}

								{/*<div className={styles.item}>*/}
								{/*	<i className="fa-solid fa-calendar-days"></i>*/}
								{/*	<span>Davomat</span>*/}
								{/*</div>*/}
								{/*<div className={styles.item}>*/}
								{/*	<i className="fa-solid fa-dollar-sign"></i>*/}
								{/*	<span>Balans tarixi</span>*/}
								{/*</div>*/}
							</div>
						</div>
						:
						<div className={styles.options}>
							{/*<div className={styles.item}>*/}
							{/*	<i className="fa-solid fa-camera"></i>*/}
							{/*</div>*/}
							<RequireAuthChildren allowedRules={[ROLES.Teacher]}>
								<Link to={"../studentsCertificates"} className={styles.item}>
									<i className="fa-solid fa-graduation-cap"></i>
									<span>Bitiruvchilar sertifikatlari</span>
								</Link>
								<Link to={"../teacherSalary"} className={styles.item}>
									<i className="fa-solid fa-dollar-sign"></i>
									<span>Balans tarixi</span>
								</Link>
							</RequireAuthChildren>

							<Link to={"../userLessonTime"} className={styles.item}>
								<i className="fa-solid fa-user-clock"></i>
								<span>Dars vaqti</span>
							</Link>


							<RequireAuthChildren allowedRules={[ROLES.Student]}>
								<Link to={"../studentAttendance"} className={styles.item}>
									<i className="fa-solid fa-calendar-days"></i>
									<span>Davomat</span>
								</Link>
								<Link to={"../balanceHistory"} className={styles.item}>
									<i className="fa-solid fa-dollar-sign"></i>
									<span>Balans tarixi</span>
								</Link>
							</RequireAuthChildren>

							<Link to={"../changeProfile"} className={styles.item}>
								<i className="fa-solid fa-gear"></i>
								<span>Ma'lumotlarni o'zgartirish</span>
							</Link>
						</div>
				}

			</div>}
			<div className={styles.subHeader}>
				<div className={styles.user}>
					<div className={styles.img} onClick={() => setActive(true)}>
						<img src={img === null ? defaultUserImg : `${BackUrlForDoc}${img}` } alt="User image"/>
						<div className={styles.icon}>
							<i className="fa-solid fa-camera"></i>
						</div>
					</div>

					<div className={styles.info}>
						<span>{name}</span>
						<span>{surname}</span>
					</div>
				</div>

				<div className={styles.balance}>
					<i className="fa-solid fa-coins"></i>
					<span>{balance}</span>
				</div>
			</div>

			<div className={styles.container}>
				<div className={styles.wrapper}>
					<h1 className={styles.title}>Ma'lumotlar :</h1>

					<div className={styles.wrapper__box}>
						<div className={styles.information}>
							<div className={styles.item}>
								<span>Otasing ismi :</span>
								<span>{father_name}</span>
							</div>
							<div className={styles.item}>
								<span>Yosh :</span>
								<span>{age}</span>
							</div>
							<div className={styles.item}>
								<span>Tug'ulgan sana</span>
								<span>{born_date}</span>
							</div>
							<div className={styles.item}>
								<span>Telefon raqam</span>
								<span>{phone}</span>
							</div>
							{
								parent_phone ?
									<div className={styles.item}>
										<span>Ota-ona tel. raqam</span>
										<span>{parent_phone}</span>
									</div> : null
							}
						</div>
					</div>
				</div>
			</div>

			<div className={styles.footer}>
				<Button type={"danger"} onClick={logout}>
					<i className="fa-solid fa-arrow-right-from-bracket"></i>
					<span style={{marginLeft: "1rem"}}>
						Chiqish
					</span>
				</Button>
			</div>




			{
				isCheckedPassword ?
					<Modal active={active} setActive={setActive} title={"Rasm o'zgartirish"}>
						<ChangeImg userImg={img} setActive={setActive}/>
					</Modal>
					: <CheckPassword  active={active} setActive={setActive}/>
			}

		</div>
	);
};


const ChangeImg = ({userImg,setActive}) => {

	const [img,setImg] = useState(null)
	const ref = useRef()

	const {data} = useSelector(state => state.user)

	const {request} = useHttp()

	const dispatch = useDispatch()

	const onSubmit = () => {

		const formData = new FormData()
		formData.append("file",img)


		request(`${BackUrl}user/update_photo`,"POST",formData,headersImg())
			.then(res => {

				console.log(res)
			})


	}


	return (
		<div className={styles.changeImg}>
			<img
				src={img ? URL.createObjectURL(img) : userImg ? `${PlatformUrl}${userImg}`: defaultUserImg}
				alt="userImg"
				onClick={() => {
					ref.current.click()
				}}
			/>

			<input ref={ref} type="file" onChange={e => setImg(e.target.files[0])}/>

			<Button disabled={!img} type={"submit"}  onClick={onSubmit}>Tasdiqlash</Button>
		</div>
	)
}

export default Profile;