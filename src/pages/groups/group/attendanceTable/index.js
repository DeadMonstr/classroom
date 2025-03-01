import React, { useEffect, useState } from 'react';

import styles from "./styles.module.sass"
import Select from "components/ui/form/select";
import Table from "components/ui/table";
import { useHttp } from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Back from "components/ui/back";
import { useSelector } from "react-redux";
import Loader from "components/ui/loader/Loader";
import {useAuth} from "hooks/useAuth";
import RenderPageWithType from "components/renderPageWithType/RenderPageWithType";


const AttendanceTable = ({backBtn}) => {

	const {data} = useSelector(state => state.group)


	const {system_name} = useAuth()

	const [month,setMonth] = useState(null)
	const [year,setYear] = useState(null)

	const [months,setMonths] = useState([])
	const [years,setYears] = useState([])
	const [loading,setLoading] = useState(true)

	const [attendances,setAttendances] = useState([])
	const [dates,setDates] = useState([])

	const {request} = useHttp()


	useEffect(() => {
		if (data?.id) {


			setLoading(true)

			request(`${BackUrl}group_dates2/${data.id}`,"GET",null,headers())
				.then(res => {
					setLoading(false)
					setMonths(res.data.months)
					setYears(res.data.years)
					setYear(res.data.current_year)

					const currentYear   = res.data.months.filter(item => item.year === res.data.current_year)[0]



					if (currentYear?.months?.includes(res.data.current_month)) {
						setMonth(res.data.current_month)
					} else if (currentYear) {
						setMonth(currentYear.months[0])
					}
				})
		}
	},[data.platform_id])

	useEffect(() => {
		if (data?.id && month && year && system_name) {

			const newData = {
				month,
				year
			}

			setLoading(true)

			request(`${BackUrl}attendances/${data.id}`,"POST",JSON.stringify(newData),headers())
				.then(res => {
					setLoading(false)
					if (system_name === "gennis") {
						setAttendances(res.data.attendance_filter.attendances)
						setDates(res.data.attendance_filter.dates)

					} else {
						setAttendances(res.students.students)
						setDates(res.students.days)
					}

				})
		}
	},[data?.id,year,month,system_name])



	const checkTrueFalse = (data) => {
		if (data) {
			return data?.map(item => {
				if (item.status === true) {
					return (
						<td className={styles.check}>
							<i className="fas fa-check"></i>
						</td>
					)
				}
				if (item.status === false) {
					return (
						<td className={styles.times}>
							<i className="fas fa-times"></i>
							<div className="popup">
								{item.reason}
							</div>
						</td>
					)
				}
				if (item.status === "") {
					return  (
						<td className="date true"> </td>
					)
				}
			})
		}
	}


	const renderStudents = () => {
		return attendances.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.student_name}</td>
					<td>{item.student_surname}</td>
					{checkTrueFalse(item.dates)}
				</tr>
			)
		})
	}
	const renderStudentsTuron = () => {
		return attendances.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.name}</td>
					<td>{item.surname}</td>
					{checkTrueFalse(item.days)}
				</tr>
			)
		})
	}


	return (
		<div className={styles.attendanceTable}>
			{backBtn ? <Back/> : null}

			<div className={styles.header}>
				<h1>Davomat</h1>

				{
					years?.length > 1 ?
						<Select title={"Yil"} value={year} options={years} onChange={(e) => {
							setYear(e)
							setMonth(null)
						}} /> : null
				}
				{
					months?.length > 0 ?
						<Select title={"Oy"} value={month} options={months?.filter(item => item.year === year)[0]?.months} onChange={setMonth}/>
					: null
				}
			</div>

			<div className={styles.container}>
				{
					loading ?
						<Loader/>
						:
						<Table>
							<thead>
								<tr>
									<th>No</th>
									<th>Ism</th>
									<th>Familya</th>
									{
										dates.map(item =>{
											return (
												<th>{item}</th>
											)
										})
									}
								</tr>
							</thead>
							<tbody>
							<RenderPageWithType gennis={renderStudents()} turon={renderStudentsTuron()}/>


							</tbody>
						</Table>
				}
			</div>
		</div>
	);
};



const x = () => {
  
}

export default AttendanceTable;