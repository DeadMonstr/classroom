import React from 'react';

import styles from "./styles.module.sass"
import {useNavigate} from "react-router";


const links = [
	{
		title: "Dars vaqtlari",
		icon: "fa-clock",
		href: "lessonsTime"

	},
	{
		title: "Darslik Reja",
		icon: "fa-list",
		href: "lessonPlan"
	},
	{
		title: "Observe",
		icon: "fa-user-check",
		href: "observeTeacherLesson"
	},
	{
		title: "Observed Dates",
		icon: "fa-square-check",
		href: "observedTeacherLessons"
	},
]



const Addition = () => {
	const renderLinks = () => {
		return links.map(item => {

			return (
				<div className={styles.addition__item} onClick={() => onNavigate(item.href)}>
					<div className={styles.icon}>
						<i className={`fa-solid ${item.icon}`} />
					</div>
					<div className={styles.info}>{item.title}</div>
				</div>
			)
		})
	}

	const navigate = useNavigate()

	const onNavigate = (href) => {
		navigate(`../${href}`)
	}

	return (
		<div className={styles.addition}>
			{renderLinks()}
		</div>
	);
};

export default Addition;