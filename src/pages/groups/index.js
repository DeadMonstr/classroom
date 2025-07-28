import React, {useEffect, useState} from 'react';
import {Link, Outlet, Route, Routes} from "react-router-dom";
import Group from "./group";
import {useHttp} from "hooks/http.hook";


import styles from "./styles.module.sass"
import BackImg from "assets/back-school-witch-school-supplies.jpg"
import { BackUrl, BackUrlForDoc, headers } from "constants/global";


const Groups = () => {
	return (
		<>
			<Routes>
				<Route path={"/"} element={<GroupsIndex/>} />
				<Route path={":id/*"} element={<Group/>} />
			</Routes>


			<Outlet/>
		</>
	);
};


const GroupsIndex = () => {
	const [groups,setGroups] = useState([])

	const {request} = useHttp()

	useEffect(() => {
		request(`${BackUrl}group/get_groups`,"GET",null,headers())
			.then(res => {
				setGroups(res)
			})
	},[])


	const renderGroups = () => {
		return groups.map(item => {
			return (
				<Link to={`${item.id}/`}>
					<div className={styles.groups__item}>
						<img src={item.img ? `${BackUrlForDoc}${item.img}` : BackImg} alt=""/>
						<div className={styles.info}>
							<div className={styles.info__header}>
								<h1>{item.name}</h1>
								<h1>{item.studentsLen}</h1>
							</div>
							<h2>{item.teacher.name} {item.teacher.surname}</h2>
							<h3>{item.course.name}</h3>
						</div>
					</div>
				</Link>
			)
		})
	}

	return (
		<div className={styles.groups}>
			<div className={styles.header}>
				<h1>Guruhlar :</h1>
			</div>

			{renderGroups()}
		</div>
	)
}



export default Groups;