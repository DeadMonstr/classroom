import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {setOptions} from "../slices/layoutSlice";
import { ROLES } from "constants/global";

const useChangeMenuParams = (type, title) => {

	const options = {
		main: [
			// {
			// 	type: "simple",
			// 	title: "Bosh sahifa",
			// 	href: "/home",
			// 	role: []
			// },
			{
				type: "simple",
				title: "Mashqlar",
				href: "/exercises",
				role: [ROLES.Methodist]
			},
			{
				type: "simple",
				title: "Taqdimotlar",
				href: "/presentations",
				role: [ROLES.Methodist]
			},
			{
				type: "simple",
				title: "Guruhlar",
				href: "/groups",
				role: [ROLES.Teacher,ROLES.Student]
			},
			{
				type: "simple",
				title: "Kitoblar",
				href: "/books",
				role: [ROLES.Teacher,ROLES.Student]
			},
			{
				type: "simple",
				title: "Task Manager",
				href: "/taskManager",
				// role: [ROLES.Teacher]
			},
			{
				type: "simple",
				title: "Chat",
				href: "/chat",
				role: [ROLES.Teacher,ROLES.Student]
			},
			{
				type: "simple",
				title: "Teacher observation",
				href: "/teacherObservation",
				role: [ROLES.Teacher],
				restrictions: {
					observer: true
				}
			},
			{
				type: "simple",
				title: "Turon test",
				href: "/createTestTuron",
				role: [ROLES.Methodist],

			},


		],
		subject: [
			{
				type: "simple",
				title: "O'quv dasturi",
				href: "curriculum",
			},
			{
				type: "simple",
				title: "Savollar va Javoblar",
				href: "questions",
			},
		]
	}

	const [state,setState] = useState(options.main)


	useEffect(() => {
		const keys = Object.keys(options)
		keys.map(item => {
			if (item === type) {
				setState(options[item])
			}
		})
	},[type])


	return {options: state,title,type}

};

export default useChangeMenuParams;