import React, { useEffect, useState } from 'react';
import styles from "./style.module.sass";
import Back from "components/ui/back";
import Table from "components/ui/table";
import { useHttp } from "hooks/http.hook";
import {headers, headersOldToken, PlatformUrlApi} from "constants/global";
import { useSelector } from "react-redux";

const UserLessonTime = () => {
	const [times,setTimes] = useState([])
	const [days,setDays] = useState([])


	const {data:{platform_id,location_id,platform_location}} = useSelector(state => state.user)
	const {request} = useHttp()

	useEffect(() => {
		console.log(platform_location,"loc")
		request(`${PlatformUrlApi}user_time_table/${platform_id}/${platform_location}`,"GET",null,headersOldToken())
			.then(res => {
				setTimes(res.data)
				setDays(res.days)
			})
	},[location_id, platform_id])





	const renderAttendance = () => {
		return times.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.name}</td>
					{
						item.lesson.map(ls => {
							return <td>{ls.from}-{ls.to}</td>
						})
					}
				</tr>
			)
		})
	}


	return (
		<div className={styles.time}>

			<Back/>
			<div className={styles.header}>
				<h1>Dars vaqtlari</h1>
			</div>


			<div className={styles.container}>
				<Table>
					<thead>
					<tr >
						<th>No</th>
						<th>Nomi</th>
						{
							days.map(day => {
								return <th>{day}</th>
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

export default UserLessonTime;