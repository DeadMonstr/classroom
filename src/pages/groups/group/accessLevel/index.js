import React, { useEffect, useMemo, useState } from 'react';

import styles from "./styles.module.sass"



import Table from "components/ui/table";
import Checkbox from "components/ui/form/checkbox";
import Select from "components/ui/form/select";
import Back from "components/ui/back";
import Button from "components/ui/button";
import { useHttp } from "hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import { BackUrl, headers } from "constants/global";
import { setAlertOptions } from "slices/layoutSlice";

const lev = [
	{
		name: "Beginner",
		selected: true
	},
	{
		name: "Elementary",
		selected: false
	},
]

const AccessLevel = () => {

	const [selectedLevel,setSelectedLevel] = useState()
	const [selectedSubject,setSelectedSubject] = useState()
	const [users,setUsers]= useState([])
	const [selectedSubjectLevel,setSubjectLevel]= useState([])



	const {subjectLevels,data} = useSelector(state => state.group)


	const system_name = localStorage.getItem("system_type")

	// const users = [
	// 	{
	// 		id: 1,
	// 		name: "Ulug'bek",
	// 		surname: "Fatxullayev",
	// 	},
	// 	{
	// 		id: 2,
	// 		name: "Ulug'bek",
	// 		surname: "Fatxullayev",
	// 	},
	// 	{
	// 		id: 3,
	// 		name: "Ulug'bek",
	// 		surname: "Fatxullayev",
	// 	},
	// 	{
	// 		id: 4,
	// 		name: "Ulug'bekaasdas sdas da asda sd",
	// 		surname: "Fatxullayev asd asd",
	// 	},
	// 	{
	// 		id: 5,
	// 		name: "Ulug'bek",
	// 		surname: "Fatxullayev",
	// 	},
	// ]


	const {request} = useHttp()
	useEffect(() => {
		if (data?.id && selectedLevel) {
			request(`${BackUrl}group/check_level/${data.id}/${selectedLevel}` , "GET" , null ,  headers() )
				.then(res => {
					console.log(res,"students")
					setUsers(res.students)
				})
		}
	},[data, selectedLevel])

	useEffect(() => {
		if (data?.id && selectedSubject) {
			request(`${BackUrl}level/info/${selectedSubject}/` , "GET" , null ,  headers() )
				.then(res => {
					console.log(res,"students")
					setSubjectLevel(res.data)
				})
		}
	},[data, selectedSubject])


	const onChangeChecked = (id) => {
		setUsers(users => users.map(item => {
			if (item.id === id) {
				return {...item,level: !item.level}
			}
			return item
		}))
	}
	const onCheckedEvery = (checked) => {
		setUsers(users => users.map(item => {
			return {...item,level: checked}
		}))
	}

	const renderUsers = () => {
		return users?.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.name}</td>
					<td>{item.surname}</td>
					<td>
						<Checkbox checked={item.level} onChange={() => onChangeChecked(item.id)}/>
					</td>
				</tr>
			)
		})
	}




	const dispatch = useDispatch()

	const onSubmit = () => {
		request(`${BackUrl}group/check_level/${data.id}/${selectedLevel}`,"POST",JSON.stringify({users: users}),headers())
			.then(res => {
				const alert = {
					active : true,
					message: res.msg,
					type: res.status
				}
				dispatch(setAlertOptions({alert}))
			})
	}


	return (
		<div className={styles.access}>
			<Back/>
			<div className={styles.header}>
				<h1>Daraja ruhsat</h1>
				<div style={{display: "flex"}}>
					{system_name === "turon" && <Select title={"darajalar"} options={data?.subjects} onChange={setSelectedSubject}/>}

					{system_name === "turon" ? selectedSubjectLevel.length ?  <Select title={"darajalar"} options={selectedSubjectLevel} onChange={setSelectedLevel}/> : "" :<Select title={"darajalar"} options={subjectLevels} onChange={setSelectedLevel}/>}
				</div>
			</div>
			<div className={styles.container}>
				<Table>
					<thead>
					<tr>
						<th>No</th>
						<th>Ism</th>
						<th>Familya</th>
						<th>
							<Checkbox onChange={onCheckedEvery} />
						</th>
					</tr>

					</thead>
					<tbody>
					{renderUsers()}
					</tbody>
				</Table>



			</div>

			<div className={styles.footer}>
				<Button onClick={onSubmit} type={"submit"}>Tasdiqlash</Button>
			</div>


		</div>
	);
};

export default AccessLevel;