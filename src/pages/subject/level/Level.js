import React, {lazy, useEffect, useState} from 'react';
import {Outlet, useParams, Route, Routes, Navigate, Link} from "react-router-dom";

import styles from "pages/subject/level/Level.module.sass"
import {setOptions} from "slices/layoutSlice";
import {useDispatch} from "react-redux";
import Lesson from "./chapters/lesson";
import {useHttp} from "hooks/http.hook";
import { BackUrl, headers, ROLES } from "constants/global";
import {useNavigate} from "react-router";
import { useAuth } from "hooks/useAuth";
import {isMobile} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

const CreateSubjectLevelLesson = lazy(() => import("./createChapters/createLesson"))
const ChangeSubjectLevelLesson = lazy(() => import("./createChapters/changeLesson"))
const CreateChapters = lazy(() => import("./createChapters/CreateChapters"))
const Chapters = lazy(() => import("pages/subject/level/chapters/Chapters"))

const Level = () => {

	const {levelId} = useParams()

	const {role} = useAuth()
	const [isOpenChapters,setIsOpenChapters] = useState(false)

	const [links,setLinks] = useState([
		{
			type: "simple",
			title: "Darsliklar yaratish",
			href: `createChapters/${levelId}`,
			role: [ROLES.Teacher,ROLES.Methodist],
		},
		{
			type: "simple",
			title: "Darsliklar",
			href: `lessons`,
			role: [ROLES.Teacher,ROLES.Methodist],
		}
	])


	const {request} = useHttp()

	// useEffect(() => {
	// 	if (role === ROLES.Student) {
	// 		navigate("lesson/0")
	// 	}
	// },[])



	// useEffect(() => {
	// 	request(`${BackUrl}lessons/${levelId}`,"GET",null,headers())
	// 		.then(res => {
	// 			setLinks( options => options.map(item => {
	//
	// 				if (item.href === "lesson") {
	// 					return {
	// 						...item,
	// 						links: res.data.map(item => {
	// 							return {
	// 								type: "simple",
	// 								title: item.name,
	// 								href: item.order,
	// 								checked: item.checked,
	// 								percentage: item.percentage
	// 							}
	// 						})
	// 					}
	// 				}
	// 				return item
	// 			}))
	// 		})
	// },[levelId])



	// const options = [
	// 	// {
	// 	// 	type: "multiple",
	// 	// 	title: "Darsliklar",
	// 	// 	href: "lesson",
	// 	// 	links: [
	// 	// 		{
	// 	// 			type: "simple",
	// 	// 			title: "1 dars",
	// 	// 			href: "hello"
	// 	// 		},
	// 	// 		{
	// 	// 			type: "simple",
	// 	// 			title: "2 dars",
	// 	// 			href: "asdasdas"
	// 	// 		},
	// 	// 		{
	// 	// 			type: "simple",
	// 	// 			title: "3 dars",
	// 	// 			href: "helasdlo"
	// 	// 		},
	// 	// 		{
	// 	// 			type: "simple",
	// 	// 			title: "4 dars",
	// 	// 			href: "helqwqweqweqweqwelo"
	// 	// 		},
	// 	// 	]
	// 	// },
	// 	// {
	// 	// 	type: "simple",
	// 	// 	title: "Darslik yaratish",
	// 	// 	href: `createLevelLesson/${levelId}`,
	// 	// },
	// 	{
	// 		type: "simple",
	// 		title: "Darsliklar",
	// 		href: `lessons/${levelId}`,
	// 	}
	// ]




	const dispatch = useDispatch()
	const navigate = useNavigate()


	useEffect(() =>{
		if (links.length > 0) {
			dispatch(setOptions({options: links,type:"lessons"}))
		}
	},[dispatch, links])


	const onToggleChapterOpen = () => {
		setIsOpenChapters(state => !state)
	}



	return (
		<div className={styles.level}>
			<div className={styles.header}>
				<div className={styles.backLink}>
					<Link to={`../`}>
						Darajalar
					</Link>
				</div>
				{
					isMobile &&
					<FontAwesomeIcon
						onClick={onToggleChapterOpen}
						className={styles.chaptersIcon}
						icon={faBars}
					/>
				}
			</div>

			<Routes>
				{/* <Route path={"lesson/:lessonId"} element={<Lesson/>}/> */}
				<Route path={"createLevelLesson/:lessonId"} element={<CreateSubjectLevelLesson/>}/>
				<Route path={"changeLevelLesson/:chapterId/:lessonId/*"} element={<ChangeSubjectLevelLesson/>}/>
				<Route path={"createChapters/*"} element={<CreateChapters/>}/>
				<Route path={"lessons/*"} element={<Chapters onToggleChapterOpen={onToggleChapterOpen} isOpenChapters={isOpenChapters}  />}/>
				<Route
					path="*"
					element={<Navigate to={`lessons`} replace/>}
				/>
			</Routes>

			{/*<Outlet/>*/}
		</div>

	);
};

export default Level;