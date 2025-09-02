import React from 'react';

import styles from "./styles.module.sass"
import {useNavigate} from "react-router";
import { ROLES } from "constants/global";
import RequireAuth from "components/auth/requireAuth";
import RequireAuthChildren from "components/auth/requireAuthChildren";
import {useAuth} from "hooks/useAuth";
import {useSelector} from "react-redux";

const links = [
	{
		title: "Daraja belgilash",
		icon: "fa-square-check",
		href: "accessLevel",
		role: [ROLES.Teacher],
		system: "turon",
		restrictions: [ ["teacher", "id"] ]
	},
	{
		title: "Baholash",
		icon: "fa-calendar-check",
		href: "makeAttendance",
		system: "gennis",
		role: [ROLES.Teacher]
	},
	{
		title: "Darsliklar",
		icon: "fa-table",
		href: "finishedLessons",
		system: "gennis",
		role: [ROLES.Teacher]
	},
	{
		title: "Dars vaqtlari",
		icon: "fa-clock",
		href: "lessonsTime",
		system: "gennis",
		role: [ROLES.Student,ROLES.Teacher]
	},
	{
		title: "Davomat",
		icon: "fa-calendar-days",
		href: "attendanceTable",
		system: "gennis",
		role: [ROLES.Teacher,ROLES.Student]
	},
	{
		title: "Darslik Reja",
		icon: "fa-list",
		href: "lessonPlan",
		system: "gennis",
		role: [ROLES.Teacher,ROLES.Student]
	},
	{
		title: "Observed Dates",
		icon: "fa-list-check",
		href: "observedTeacherLessons",
		system: "gennis",
		role: [ROLES.Teacher]
	},
	{
		title: "Test",
		icon: "fa-spell-check",
		href: "test",
		system: "gennis",
		role: [ROLES.Teacher]
	},
]



const Addition = () => {
	const renderLinks = () => {
		return links.map(item => {

			return (
				<RequireAuthChildren allowedRules={item.role} allowedSystem={item.system}>
					<div className={styles.addition__item} onClick={() => onNavigate(item.href)}>
						<div className={styles.icon}>
							<i className={`fa-solid ${item.icon}`} />
						</div>
						<div className={styles.info}>{item.title}</div>
					</div>
				</RequireAuthChildren>
			)
		})
	}




	const navigate = useNavigate()

	const onNavigate = (href) => {
		navigate(`../../${href}`)
	}

	return (
		<div className={styles.addition}>
			{renderLinks()}
		</div>
	);
};

export default Addition;