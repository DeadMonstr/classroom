import React, { useEffect, useState } from 'react';

import styles from "./styles.module.sass"
import Select from "components/ui/form/select";
import Table from "components/ui/table";
import { useHttp } from "hooks/http.hook";
import { BackUrl, PlatformUrlApi } from "constants/global";
import Back from "components/ui/back";
import { useSelector } from "react-redux";
import Loader from "components/ui/loader/Loader";


const AttendanceTable = ({backBtn}) => {

	const {data} = useSelector(state => state.group)

	const [month,setMonth] = useState(null)
	const [year,setYear] = useState(null)

	const [months,setMonths] = useState([])
	const [years,setYears] = useState([])
	const [loading,setLoading] = useState(true)

	const [attendances,setAttendances] = useState([])
	const [dates,setDates] = useState([])



	const {request} = useHttp()

	useEffect(() => {


		if (data?.platform_id) {
			const oldToken = sessionStorage.getItem("oldToken")

			const headers = {
				'Content-Type': 'application/json',
				"Authorization" : "Bearer " + oldToken,
			}

			setLoading(true)


			request(`${PlatformUrlApi}group_dates2/${data.platform_id}`,"GET",null,headers)
				.then(res => {
					setLoading(false)
					setMonths(res.data.months)
					setYears(res.data.years)
					setYear(res.data.current_year)
					setMonth(res.data.current_month)
				})
		}
	},[data.platform_id])

	useEffect(() => {

		if (data?.platform_id && month && year) {
			const oldToken = sessionStorage.getItem("oldToken")

			const headers = {
				'Content-Type': 'application/json',
				"Authorization" : "Bearer " + oldToken,
			}
			const newData = {
				month,
				year
			}

			setLoading(true)


			request(`${PlatformUrlApi}attendances/${data.platform_id}`,"POST",JSON.stringify( newData),headers)
				.then(res => {
					setLoading(false)

					setAttendances(res.data.attendance_filter.attendances)
					setDates(res.data.attendance_filter.dates)
				})
		}

	},[data.platform_id,year,month])



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
						<td className="date true"></td>
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



	return (
		<div className={styles.attendanceTable}>
			{backBtn ? <Back/> : null}

			<div className={styles.header}>
				<h1>Davomat</h1>

				{
					years?.length > 1 ?
						<Select title={"Yil"} value={year} options={years} onChange={setYear} /> : null
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
							{renderStudents()}
							</tbody>
						</Table>
				}

			</div>
		</div>
	);
};

export default AttendanceTable;