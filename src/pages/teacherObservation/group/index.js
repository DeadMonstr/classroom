import React, { useEffect } from 'react';
import {Navigate, Outlet, Route, Routes} from "react-router-dom";

import styles from "./style.module.sass"
import img from "assets/back-school-witch-school-supplies.jpg"

import Addition from "./addition";

import LessonTime from "pages/groups/group/lessonTime";
import Back from "components/ui/back";
import { useParams } from "react-router";
import { useHttp } from "hooks/http.hook";
import { BackUrl, ROLES } from "constants/global";
import { useDispatch, useSelector } from "react-redux";
import {fetchGroup, fetchGroupObserver} from "slices/groupSlice";
import Loader from "components/ui/loaderPage/LoaderPage";
import RequireAuth from "components/auth/requireAuth";
import LessonPlan from "pages/groups/group/lessonPlan/LessonPlan";
import ObservedTeacherLessons from "pages/groups/group/observedLessons/observedTeacherLessons";

import ObserveTeacherLesson from "pages/teacherObservation/group/observeTeacherLesson/ObserveTeacherLesson";
import {setAlertOptions} from "slices/layoutSlice";



const GroupObserver = () => {

	const {id} = useParams()

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchGroupObserver(id))
			.then(res => {
				console.log(res)

				if (!res.payload.status) {
					const alert = {
						active : true,
						message: "Bu guruh ma'lumotlari yoq",
						type: "error"
					}
					dispatch(setAlertOptions({alert}))

				}

			})
	},[id])



	return (
		<>

			<Routes>
				<Route path={"info/*"} element={<GroupObserverIndex />} />


				<Route path={"lessonsTime"} element={<LessonTime />} />
				<Route path={"lessonPlan"} element={<LessonPlan backBtn={true} />} />
				<Route path={"observeTeacherLesson/*"} element={<ObserveTeacherLesson />} />
				<Route path={"observedTeacherLessons/*"} element={<ObservedTeacherLessons />} />

				<Route
					path="*"
					element={<Navigate to="info/" replace/>}
				/>
			</Routes>

			<Outlet/>
		</>
	);
};


const GroupObserverIndex = () => {

	const {data,fetchGroupDataStatus} = useSelector(state => state.group)

	const {name,teacher} = data

	if (fetchGroupDataStatus === "loading") {
		return <Loader/>
	}



	return (
		<div className={styles.group}>
			<div className={styles.header}>
				<img src={img} alt="BackImg"/>
				<div className={styles.info}>
					<h1>{name}</h1>
					<h1>{teacher?.name} {teacher?.surname}</h1>
				</div>
			</div>
			<div className={styles.subHeader}>
				<Back className={styles.newBack} to={"/teacherObservation"}/>
			</div>

			<div className={styles.container}>
				<Addition/>
			</div>


		</div>
	)
}


export default GroupObserver;