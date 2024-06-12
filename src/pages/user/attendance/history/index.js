


import styles from "./styles.module.sass"
import React, { useCallback, useEffect, useState } from "react";
import Back from "components/ui/back";
import Table from "components/ui/table";
import { useParams } from "react-router";
import { useHttp } from "hooks/http.hook";
import { BackUrl, PlatformUrlApi } from "constants/global";
import Select from "components/ui/form/select";



const AttendanceStudentHistory = () => {

	const [history,setHistory] = useState([])
	const [option,setOption] = useState("")

	const {studentId,groupId,month,year} = useParams()

	const {request} = useHttp()

	useEffect(() => {
		const oldToken = sessionStorage.getItem("oldToken")
		const headers = {
			"Authorization" : "Bearer " + oldToken,
		}
		request(`${PlatformUrlApi}student_attendances/${studentId}/${groupId}/${year}-${month}`,"GET",null,headers)
			.then(res => {
				console.log(res)
				setHistory(res.data)
			})
		
	},[groupId, month, studentId, year])




	const options = [
		{
			name: "Kelgan",
			value: "present"
		},
		{
			name: "Kelmagan",
			value: "absent"
		}
	]
	
	const renderTable = useCallback(() => {
		if (option === "present") {
			return <Present data={history.present}/>
		} else {
			return <Absent data={history.absent}/>
		}
	},[history, option])


	return (
		<div className={styles.attendance}>

			<Back/>
			<div className={styles.header}>
				<h1>1 oy lik davomat</h1>
				<Select options={options} onChange={setOption} value={option}/>
			</div>


			<div className={styles.container}>
				{renderTable()}
			</div>


		</div>
	)
}

const Present = ({data = []}) => {

	const renderAttendance = () => {
		if (data.length > 0) {
			return data.map((item,index) => {
				return (
					<tr>
						<td>{index+1}</td>
						<td>{item.date}</td>
						{data[0]?.activeness ? <td>{item.activeness}</td>: null }
						{data[0]?.dictionary ? <td>{item.dictionary}</td> : null}
						{data[0]?.homework ? <td>{item.homework}</td> : null}
						<td>{item.averageBall}</td>
						<td className={styles.yes}><i className="fa-solid fa-check "  /></td>
					</tr>
				)
			})
		}

	}

	const renderExcTypes = () => {
		if (data.length > 0) {
			return <>
				{data[0].activeness ? <th>Darsda qatnashishi</th>: null }
				{data[0].dictionary ? <th>Lug'at</th> : null}
				{data[0].homework ? <th>Uy ishi</th> : null}
			</>
		}
	}

	return (
		<Table>
			<thead>
			<tr>
				<th>No</th>
				<th>Kun</th>
				{renderExcTypes()}
				<th>O'rtacha baho</th>
				<th>Turi</th>
			</tr>
			</thead>
			<tbody>
			{renderAttendance()}
			</tbody>
		</Table>
	)
}


const Absent = ({data = []}) => {

	const renderAttendance = () => {
		if (data.length > 0) {
			return data.map((item,index) => {
				return (
					<tr>
						<td>{index+1}</td>
						<td>{item.date}</td>
						<td className={styles.no}><i className="fas fa-times"></i></td>
					</tr>
				)
			})
		}

	}



	return (
		<Table>
			<thead>
			<tr>
				<th>No</th>
				<th>Kun</th>
				<th>Turi</th>
			</tr>
			</thead>
			<tbody>
			{renderAttendance()}
			</tbody>
		</Table>
	)
}

export default AttendanceStudentHistory;