import React, { useEffect, useState } from 'react';


import styles from "./style.module.sass"
import Back from "components/ui/back";
import Table from "components/ui/table";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useHttp } from "hooks/http.hook";
import { PlatformUrlApi } from "constants/global";
import Select from "components/ui/form/select";

const AttendanceStudent = () => {
	const [attendance,setAttendance] = useState([
		{
			group: "Asliddin A1",
			days: [
				"yes","yes","yes","no"
			]
		}
	])
	const [months,setMonths] = useState([])
	const [years,setYears] = useState([])
	const [days,setDays] = useState([])

	const [year,setYear] = useState("")
	const [month,setMonth] = useState("")


	const {data:{platform_id,location_id}} = useSelector(state => state.user)
	const {request} = useHttp()

	useEffect(() => {
		const oldToken = sessionStorage.getItem("oldToken")
		const headers = {
			"Authorization" : "Bearer " + oldToken,
		}

		request(`${PlatformUrlApi}combined_attendances/${platform_id}`,"GET",null,headers)
			.then(res => {
				setDays(res.data.dates)
				setAttendance(res.data.attendances)
			})

		request(`${PlatformUrlApi}student_group_dates2/${platform_id}`,"GET",null,headers)
			.then(res => {
				setYears(res.data.years)
				setMonths(res.data.months)
				setYear(res.data.current_year)
			})
	},[platform_id])



	const renderAttendance = () => {
		return attendance.map((item,index) => {
			return (
				<tr onClick={() => onClick(item.group_id)}>
					<td>{index+1}</td>
					<td>{item.name}</td>
					{
						item?.dates?.map(day => {
							if (day.status) {
								return <td className={styles.yes}><i className="fa-solid fa-check " /></td>
							} else if (!day.status) {
								return <td className={styles.no}><i className="fa-solid fa-xmark" /></td>
							} else if (day.status === "") {
								return <td></td>
							}
						})
					}
				</tr>
			)
		})
	}

	const navigate = useNavigate()

	const onClick = (id) => {
		navigate(`../studentAttendanceHistory/${platform_id}/${id}/${month}/${year}`)
	}


	return (
		<div className={styles.attendance}>

			<Back/>
			<div className={styles.header}>
				<h1>Davomat</h1>
				{
					years?.length > 1 ?
						<Select options={years} onChange={setYear} /> : null
				}
				{
					months?.length > 0 && year ?
						<Select title={"Oy"} options={months?.filter(item => item.year === year)[0].months} onChange={setMonth}/>
						: null
				}


			</div>

			<div className={styles.container}>
				<Table>
					<thead>
						<tr >
							<th>No</th>
							<th>Guruh nomi</th>
							{
								days.map(item => {
									return <th>{item}</th>
								})
							}
						</tr>
					</thead>
					<tbody>
					{renderAttendance()}
					</tbody>
				</Table>
			</div>


		</div>
	);
};

export default AttendanceStudent;