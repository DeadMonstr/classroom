import React, { useEffect } from 'react';
import {Navigate, Outlet, Route, Routes} from "react-router-dom";

import styles from "./style.module.sass"
import img from "assets/back-school-witch-school-supplies.jpg"
import {NavLink} from "react-router-dom";
import GroupInformation from "./info";
import Curriculum from "./curriculum";
import Addition from "./addition";
import AccessLevel from "./accessLevel";
import MakeAttendance from "./makeAttendance";
import AttendanceTable from "./attendanceTable";
import LessonTime from "./lessonTime";
import FinishedLessons from "pages/groups/group/finishedLessons/FinishedLessons";

import Back from "components/ui/back";
import { useParams } from "react-router";
import { useHttp } from "hooks/http.hook";
import { BackUrl, ROLES } from "constants/global";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "slices/groupSlice";
import Loader from "components/ui/loaderPage/LoaderPage";
import RequireAuth from "components/auth/requireAuth";
import LessonPlan from "pages/groups/group/lessonPlan/LessonPlan";
import ObservedTeacherLessons from "pages/groups/group/observedLessons/observedTeacherLessons";
import OnlineLesson from "pages/groups/group/onlineLesson/OnlineLesson";
import GroupTest from "./groupTest/groupTest";



const Group = () => {

	const {id} = useParams()

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchGroup(id))
	},[id])



	return (
		<>

			<Routes>

				<Route element={<RequireAuth allowedRules={ROLES.Teacher}/>}>
					<Route path={"accessLevel"} element={<AccessLevel/>} />
					<Route path={"makeAttendance/*"} element={<MakeAttendance/>} />
				</Route>

				<Route path={"info/*"} element={<GroupIndex />} />
				<Route path={"attendanceTable"} element={<AttendanceTable backBtn={true}/>} />
				<Route path={"lessonsTime"} element={<LessonTime />} />
				<Route path={"finishedLessons/*"} element={<FinishedLessons />} />
				<Route path={"finishedLessons/*"} element={<FinishedLessons />} />
				<Route path={"observedTeacherLessons/*"} element={<ObservedTeacherLessons />} />
				<Route path={"test"} element={<GroupTest />} />
				{/*<Route path={"onlineLesson"} element={<OnlineLesson />} />*/}



				<Route path={"lessonPlan"} element={<LessonPlan backBtn={true}/>} />

				<Route
					path="*"
					element={<Navigate to="info/" replace/>}
				/>
			</Routes>

			<Outlet/>
		</>
	);
};


const GroupIndex = () => {

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
				<Back className={styles.newBack} to={"/groups"}/>
			</div>

			<div className={styles.navigation}>
				<NavLink
					className={({ isActive }) =>
						isActive ? `${styles.item} ${styles.active}` : `${styles.item}`
					}
					to={" "}
				>
					<svg width="42" height="52" viewBox="0 0 42 54" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clip-path="url(#clip0_673_161)">
							<path d="M38.3477 52.7514H3.34772C2.17111 52.7514 1.21729 51.7732 1.21729 50.5665V3.43351C1.21729 2.22678 2.17111 1.24854 3.34772 1.24854H27.2484C27.8314 1.24854 28.3889 1.49354 28.791 1.92643L39.8902 13.876C40.2675 14.2824 40.4782 14.822 40.4782 15.3831V50.5665C40.4782 51.7732 39.5243 52.7514 38.3477 52.7514Z" stroke="#4D4D4D" stroke-width="2"/>
							<path d="M9.73926 20.6064H32.261" stroke="#4D4D4D" stroke-width="2"/>
							<path d="M9.73926 26.5369H30.1306" stroke="#4D4D4D" stroke-width="2"/>
							<path d="M9.73779 32.4678H28.0012" stroke="#4D4D4D" stroke-width="2"/>
							<path d="M9.73926 38.3984H25.5653" stroke="#4D4D4D" stroke-width="2"/>
						</g>
						<defs>
							<clipPath id="clip0_673_161">
								<rect width="42" height="54" fill="white"/>
							</clipPath>
						</defs>
					</svg>
					<span>
						Ma'lumotlar
					</span>
				</NavLink>
				<NavLink
					className={({ isActive }) =>
						isActive ? `${styles.item} ${styles.active}` : `${styles.item}`
					}
					to={"curriculum"}
				>
					<svg width="48" height="52" viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M43 51H5C2.79086 51 1 49.2091 1 47V5C1 2.79086 2.79086 1 5 1H43C45.2091 1 47 2.79086 47 5V13.4149V47C47 49.2091 45.2091 51 43 51Z" stroke="#4D4D4D" stroke-width="2"/>
						<rect x="7.5" y="7.29834" width="33" height="10.0474" rx="1.5" stroke="#4D4D4D"/>
						<rect x="7.5" y="20.8953" width="33" height="10.0474" rx="1.5" stroke="#4D4D4D"/>
						<rect x="7.5" y="35.3418" width="33" height="9.19761" rx="1.5" stroke="#4D4D4D"/>
					</svg>
					<span>
						Mundarija
					</span>
				</NavLink>
				<NavLink
					className={({ isActive }) =>
						isActive ? `${styles.item} ${styles.active}` : `${styles.item}`
					}
					to={"addition"}
				>
					<svg width="38" height="52" viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 40.5789H34C35.6569 40.5789 37 39.2358 37 37.5789V11.6946V4C37 2.34315 35.6569 1 34 1H4C2.34315 1 1 2.34314 1 4V37.5789C1 39.2358 2.34315 40.5789 4 40.5789Z" stroke="#4D4D4D" stroke-width="2"/>
						<path d="M19.3643 11.5698L19.3643 29.4646" stroke="#4C4C4C" stroke-width="2"/>
						<line x1="27.9473" y1="20.8948" x2="10.0525" y2="20.8948" stroke="#4C4C4C" stroke-width="2"/>
					</svg>
					<span>
						Qo'shimcha
					</span>
				</NavLink>
				<NavLink
					className={({ isActive }) =>
						isActive ? `${styles.item} ${styles.active}` : `${styles.item}`
					}
					to={"../onlineLesson"}
				>
					<svg width="38" height="52" viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 40.5789H34C35.6569 40.5789 37 39.2358 37 37.5789V11.6946V4C37 2.34315 35.6569 1 34 1H4C2.34315 1 1 2.34314 1 4V37.5789C1 39.2358 2.34315 40.5789 4 40.5789Z" stroke="#4D4D4D" stroke-width="2"/>
						<path d="M19.3643 11.5698L19.3643 29.4646" stroke="#4C4C4C" stroke-width="2"/>
						<line x1="27.9473" y1="20.8948" x2="10.0525" y2="20.8948" stroke="#4C4C4C" stroke-width="2"/>
					</svg>
					<span>
						Online dars
					</span>
				</NavLink>
			</div>

			<div className={styles.container}>
				<Routes>
					<Route index element={<GroupInformation/>}/>
					<Route path={"curriculum"} element={<Curriculum/>}/>
					<Route path={"addition"} element={<Addition/>}/>
				</Routes>
			</div>


		</div>
	)
}


export default Group;