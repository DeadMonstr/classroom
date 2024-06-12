import React, { useEffect, useState } from 'react';

import styles from "./style.module.sass"
import Back from "components/ui/back";
import Table from "components/ui/table";
import { useSelector } from "react-redux";
import { PlatformUrlApi } from "constants/global";
import { useHttp } from "hooks/http.hook";


const LessonTime = () => {

	const {data} = useSelector(state => state.group)

	const [times,setTimes] = useState([])
	const [days,setDays] = useState([])


	const {request} = useHttp()

	useEffect(() => {

		if (data?.platform_id) {
			const oldToken = sessionStorage.getItem("oldToken")

			const headers = {
				'Content-Type': 'application/json',
				"Authorization" : "Bearer " + oldToken,
			}


			request(`${PlatformUrlApi}group_time_table/${data.platform_id}`,"GET",null,headers)
				.then(res => {
					setTimes(res.data)
					setDays(res.days)
				})
		}


	},[data.platform_id])

	const renderLessonTime = () => {
		return times.map(item => {
			return(
				<tr>
					<td>
						{item.room}
					</td>

					{
						item.lesson.map(time => {
							if (time.from) {
								return (
									<td>{time.from}-{time.to}</td>
								)
							}
							return <td></td>
						})
					}
				</tr>
			)
		})


	}


	return (
		<div className={styles.lessonTime}>
			<Back/>
			<div className={styles.header}>
				<h1>Dars vaqtlari</h1>
			</div>

			<div className={styles.container}>
				<Table>
					<thead>
						<tr>
							<th>Hona</th>
							{
								days.map((item,index) => {
									return (
										<th key={index}>
											{item}
										</th>
									)
								})
							}
						</tr>
					</thead>
					<tbody>
					{renderLessonTime()}
					</tbody>
				</Table>
			</div>
		</div>
	);
};

export default LessonTime;