import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from "./styles.module.sass"
import { useParams } from "react-router";
import Select from "components/ui/form/select";
import Table from "components/ui/table";
import {Outlet,Routes,Route} from "react-router";
import userImg from "assets/user.png"


import classNames from "classnames";

import { Navigate, NavLink } from "react-router-dom";
import AttendanceTable from "../attendanceTable";
import Back from "components/ui/back";
import { isMobile } from "react-device-detect";
import {BackUrl, BackUrlForDoc, headers, PlatformUrlApi} from "constants/global";
import user from "pages/user";
import Button from "components/ui/button";
import { useHttp } from "hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import { setAlertOptions, setMultipleAlertOptions } from "slices/layoutSlice";
import Loader from "components/ui/loader/Loader";
import header from "components/layout/header";


const MakeAttendance = () => {


	return (
		<div className={styles.attendance}>
			<div className={styles.header}>
				<Back to={"../info/addition"}/>
			</div>

			<div className={styles.nav}>
				<NavLink
					className={({ isActive }) =>
						isActive ? `${styles.nav__item} ${styles.active}` : `${styles.nav__item}`
					}
					to={"index"}
				>
					<i className="fa-solid fa-calendar-check"></i>
					<span>Baholash</span>

				</NavLink>
				<NavLink
					to={"attendanceTable"}
					className={({ isActive }) =>
						isActive ? `${styles.nav__item} ${styles.active}` : `${styles.nav__item}`
					}
				>
					<i className="fa-solid fa-table"></i>
					<span>Davomat</span>
				</NavLink>
			</div>

			<div className={styles.container}>
				<Routes>
					<Route path={"index"} element={<MakeAttendanceIndex/>} />
					<Route path={"attendanceTable"} element={<AttendanceTable/>}/>

					<Route
						path="*"
						element={<Navigate to="index" replace/>}
					/>
				</Routes>
			</div>
		</div>
	)
}
const MakeAttendanceIndex = () => {

	const {data} = useSelector(state => state.group)

	const [day,setDay] = useState()
	const [month,setMonth] = useState()
	const [loading,setLoading] = useState(false)

	const [months,setMonths] = useState([])



	const [users,setUsers] = useState([])
	const {id} = useParams()

	const {request} = useHttp()


	useEffect(() => {
		if (data.id) {
			setLoading(true)

			request(`${BackUrl}attendance_classroom/${data.id}`,"GET",null,headers())
				.then(res => {
					setUsers(res.users)
					setLoading(false)
					if (res.date.length === 1) {
						setMonth(res.date[0].value)
					}
					setMonths(res.date)
				})
		}

	},[data])




	const onCheck = (type,id) => {
		setUsers(users => users.map(item => {
			if (item.id === id) {
				const checkScores = item.score.filter(item => !item.activeBall > 0)
				if (type === "yes") {
					if (checkScores.length > 0) {
						const newScores = item.score?.map(s => {
							if (s.name === checkScores[0].name) {
								return {...checkScores[0], isNotChecked: true}
							}
							return s
						})
						return {
							...item,
							score: newScores
						}
					}
					return {
						...item,
						type: type
					}
				} else {
					const defaultedScores = item.score.map(sc => ({...sc,isNotChecked:false,activeBall: 0}))

					return {
						...item,
						type: type,
						score: defaultedScores
					}
				}
			}
			return item
		}))
	}


	const setDefault = useCallback( (id) => {
		setUsers(users => users.map(item => {
			if (item.id === id && item.type !== "") {
				return {...item,type: ""}
			}
			return item
		}))
	},[])

	const setDefaultAllUsers = useCallback(() => {

		setUsers(users => users.map(item => {
			const newScores = item.score?.map(s => {
				return {...s,isNotChecked: false,activeBall: 0}
			})
			return {...item,type: "",score: newScores}
		}))
	},[])


	const onChangeScore = (id,score) => {
		setUsers(users => users.map(item => {
			if (item.id === id) {
				const newScores = item.score?.map(s => {
					if (s.name === score.name) {
						return {...score,isNotChecked: false}
					}
					return s
				})
				return {
					...item,
					type:"",
					score: newScores
				}
			}
			return item
		}))
	}

	const isGetScore = users.some(item => item.type !== "")
	const dispatch = useDispatch()
	const onSubmit = () => {



		const newData = {
			day,
			month,
			users: users.filter(item => item.type !== ""),
			group_id : data.platform_id
		}



		setLoading(true)

		request(`${BackUrl}make_attendance_classroom`,"POST",JSON.stringify({data:newData}),headers())
			.then(res => {
				setLoading(false)
				if (res?.errors?.length > 0) {
					const alerts = res.errors.map(item => {
						return {
							message: item.message,
							type: item.status,
							active: true,
						}
					})
					setDefaultAllUsers()

					dispatch(setMultipleAlertOptions({alerts}))
				} else {

					const alert = {
						active : true,
						message: res.message,
						type: res.status
					}
					setDefaultAllUsers()


					dispatch(setAlertOptions({alert}))
				}


			})

	}

	return (
		<div className={styles.makeAttendance}>

			<div className={styles.header}>
				<h1 className={styles.title}>
					Baholash
				</h1>


				<div className={styles.btns}>

					{
						months.length > 1 ?
							<Select
								title={"Oy"}
								options={months}
								onChange={(e) => {
									setMonth(e)
									setDefaultAllUsers()
								}}
							/> : null
					}

					{
						month ?
							<Select
								title={"Kun"}
								options={months.filter(item => item.value === month)[0].days}
								onChange={(e) => {
									setDay(e)
									setDefaultAllUsers()
								}}
							/> : null
					}
				</div>
			</div>

			{
				loading ?
					<Loader/>
					:
					<>
						<div className={styles.container}>
							{isMobile ?
								<MobileStudents
									onCheck={onCheck}
									setDefault={setDefault}
									users={users}
									onChangeScore={onChangeScore}
								/>
								:
								<PcStudents
									onCheck={onCheck}
									setDefault={setDefault}
									users={users}
									onChangeScore={onChangeScore}
								/>
							}

							{/*{renderStudents()}*/}
						</div>

						{
							isGetScore ?
								<div className={styles.footer}>
									<Button onClick={onSubmit} type={"submit"} >Tasdiqlash</Button>
								</div> : null
						}
					</>

			}




		</div>
	);
};


const Star = React.memo( ({item,onChange,id}) => {

	const [score,setScore] = useState({
		activeBall : 0,
		name: ""
	})
	const [activePopup,setActivePopup] = useState(false)
	const ref = useRef()

	useEffect(() => {
		setScore(item)
	},[item])



	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target))  {
				setActivePopup(false)
			}
		}

		document.addEventListener("click",handleClickOutside)
		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	},[activePopup])



	const onClick = (index) => {
		if (index === score.activeBall) {
			setScore(score => ({...score,activeBall: 0}))
			onChange(id,{...score,activeBall: 0})
		} else {
			setScore(score => ({...score,activeBall: index}))
			onChange(id,{...score,activeBall: index})
		}
	}
	const renderStars = () => {
		const stars = []
		for (let i = 1; i <= 5;i++){
			if (i <= score.activeBall) {
				stars.push(
					<i
						key={i}
						onClick={() => onClick(i)}
						className={classNames("fa-solid fa-star",{
							[`${styles.active}`]: true
						})}
					/>
				)
			}
			else {
				stars.push(
					<i
						key={i}
						onClick={() => onClick(i)}
						className="fa-solid fa-star"
					/>
				)
			}
		}
		return stars
	}



	if (isMobile) {
		return (
			<div
				className={classNames(styles.score,{
					[`${styles.error}`]: score.isNotChecked
				})}
			>
				<div className={styles.mobile}>
					<h1>{score.name}</h1>
					<div className={styles.stars}>
						{renderStars()}
					</div>
				</div>
			</div>
		)
	}
	return (
		<div
			className={classNames(styles.score,{
				[`${styles.error}`]: score.isNotChecked
			})}
			ref={ref}>
			<div
				className={styles.outside}
				onClick={() => setActivePopup(!activePopup)}
			>
				<span>{score.activeBall}</span>
				<i
					className={classNames("fa-solid fa-star",{
						[`${styles.active}`]: score.activeBall !== 0
					})}
				/>
			</div>
			<div className={classNames(styles.popup,{
				[`${styles.active}`] : activePopup
			})}>
				<h1>{score.name}</h1>
				<div className={styles.stars}>
					{renderStars()}
				</div>
			</div>
		</div>
	)

})


const MobileStudents = React.memo( ({users,onChangeScore,setDefault,onCheck}) => {
	const insideRefArray = useRef([])

	const onOpen = (index) => {
		for (let i = 0; i < insideRefArray.current.length; i++) {
			const elem = insideRefArray.current[i]
			elem.querySelector(".arrow").style.transform = "rotate(-90deg)"
			elem.querySelector(".accordion").style.height = 0
		}
		const elem = insideRefArray.current[index]

		if (elem.querySelector(".accordion").getBoundingClientRect().height === 0) {
			elem.querySelector(".arrow").style.transform = "rotate(0)"
			elem.querySelector(".accordion").style.height = elem.querySelector(".accordion").scrollHeight + "px"
		} else {
			elem.querySelector(".accordion").style.height = 0
		}

	}

	useEffect(() => {
		if (insideRefArray.current.length > 0) {
			for (let i= 0; i < insideRefArray.current.length; i++) {
				const elem = insideRefArray.current[i]
				if
				(
					elem?.querySelector(".accordion").getBoundingClientRect().height > 0 &&
					elem?.querySelector(".accordion").getBoundingClientRect().height !== elem.querySelector(".accordion").scrollHeight
				)
				{
					elem.querySelector(".accordion").style.height = elem.querySelector(".accordion").scrollHeight + "px"
				}
			}
		}
	},[users])

	useEffect(() => {
		for (let i= 0; i < users.length; i++) {

			if (users[i].type !== "") {
				const elem = insideRefArray.current[i]

				elem.querySelector(".accordion").style.height = 0

			}
		}
	},[users])


	const renderStudents = useCallback( () => {
		return users.map((user,index) => {
			return (
				<div className={styles.item} ref={(element) => insideRefArray.current[index] = element}>
					{
						user.type !== "" ?
							<div
								className={classNames(styles.type,{
									[`${styles.yes}`] : user.type === "yes"
								})}
								onClick={() => setDefault(user.id)}
							>
								<div className={styles.type__btn} >
									{
										user.type === "yes"
											?
											<i className="fa-solid fa-check"></i>
											:
											<i className="fa-solid fa-xmark"></i>
									}
								</div>
							</div>
							: null
					}


					<div className={styles.top} onClick={() => onOpen(index)}>
						<img src={user.img ? `${BackUrlForDoc}${user.img}` : userImg} alt=""/>
						<div className={styles.info}>
							<h1>{user.name}</h1>
							<h1>{user.surname}</h1>
						</div>



						<i className="fa-solid fa-caret-down arrow" style={{fontSize: "2rem"}}/>
					</div>

					<div

						className={classNames(styles.inside,"accordion")}
					>
						<div className={styles.scores}>
							{
								user.score.map((sc,index) => {
									return (
										<Star onChange={onChangeScore} id={user.id} key={index} item={sc} />
									)
								})
							}
						</div>

						<div className={styles.balance}>
							<h2 className={styles[user.money_type]}>{user.balance}</h2>
						</div>

						{
							user.type === "" && user.money_type !== "black" ?
								 <div className={styles.btns}>
									<div
										className={styles.btns__item}
										onClick={() => {
											onCheck("yes",user.id)

										}}
									>
										<i className="fa-solid fa-check"></i>
									</div>
									<div
										className={styles.btns__item}
										onClick={() => {
											// onOpen(index)
											onCheck("no", user.id)
										}}
									>
										<i className="fa-solid fa-xmark"></i>
									</div>
								</div> : null
						}
					</div>
				</div>
			)
		})
	},[onChangeScore, onCheck, setDefault, users])

	return (
		<div className={styles.students}>
			{renderStudents()}
		</div>
	)
})


const PcStudents = ({users,onChangeScore,setDefault,onCheck}) => {

	const renderStudents = () => {
		return users.map((user,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{user.name}</td>
					<td>{user.surname}</td>
					<td className={styles[user.money_type]}>{user.balance}</td>
					<td>
						<div className={styles.scores}>
							{user.score.map((item,index) => {
								return (
									<Star onChange={onChangeScore} id={user.id} key={index} item={item} />
								)
							})}
						</div>
					</td>
					<td>
						{
							user.money_type !== "black" ?
								<>
									{
										user.type !== ""  ?
											<div
												className={classNames(styles.type,{
													[`${styles.yes}`] : user.type === "yes"
												})}
												onClick={() => setDefault(user.id)}
											>
												<div className={styles.type__btn} >
													{
														user.type === "yes"
															?
															<i className="fa-solid fa-check"></i>
															:
															<i className="fa-solid fa-xmark"></i>
													}
												</div>
											</div>
											: <div className={styles.btns}>
												<div className={styles.btns__item} onClick={() => onCheck("yes",user.id)}>
													<i className="fa-solid fa-check"></i>
												</div>
												<div className={styles.btns__item}  onClick={() => onCheck("no",user.id)}>
													<i className="fa-solid fa-xmark"></i>
												</div>
											</div>
									}
								</> : null
						}

					</td>
				</tr>
			)
		})
	}

	return (
		<Table>
			<thead>
			<tr>
				<th>No</th>
				<th>Ism</th>
				<th>Familya</th>
				<th>Hisob</th>
				<th>Baho</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
				{renderStudents()}
			</tbody>
		</Table>
	)
}

export default MakeAttendance;