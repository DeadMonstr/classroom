import React, { useEffect, useState } from 'react';
import styles from "./style.module.sass";
import Back from "components/ui/back";
import Table from "components/ui/table";
import { useHttp } from "hooks/http.hook";
import {BackUrl, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import { useSelector } from "react-redux";
import Select from "components/ui/form/select";
import brightnessColor from "helpers/brightnessColor";
import {useAuth} from "hooks/useAuth";
import RenderPageWithType from "components/renderPageWithType/RenderPageWithType";

const UserLessonTime = () => {
	const [times,setTimes] = useState([])
	const [days,setDays] = useState([])
	const [locations,setLocations] = useState([])
	const [location,setLocation] = useState()


	const {system_name} = useAuth()

	const {data:{platform_id,location_id,platform_location}} = useSelector(state => state.user)

	const {request} = useHttp()


	useEffect(() => {
		if (system_name === "gennis") {
			request(`${BackUrl}teacher_locations`,"GET",null,headers())
				.then(res => {
					setLocations(res.locations)
				})
		}

	},[system_name])






	return (
		<div className={styles.time}>

			<Back/>
			<div className={styles.header}>
				<h1>Dars vaqtlari</h1>

				{system_name === "gennis" ? <Select options={locations} onChange={setLocation}/> : null}

			</div>


			<div className={styles.container}>
				<RenderPageWithType
					turon={<TuronTable/>}
					gennis={<GennisTable />}
				/>
			</div>


		</div>
	);
};



const GennisTable = ({data,location}) => {


	const [times, setTimes] = useState([])
	const [days, setDays] = useState([])


	const {request} = useHttp()





	useEffect(() => {
		if (location)
			request(`${BackUrl}user_time_table/${location}`,"GET",null,headers())
				.then(res => {
					setTimes(res.data)
					setDays(res.days)
				})
	},[location])


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
	)
}


const TuronTable = ({data}) => {


	const [times, setTimes] = useState([])
	const [days, setDays] = useState([])


	const {request} = useHttp()

	useEffect(() => {
		request(`${BackUrl}user_time_table/`,"GET",null,headers())
			.then(res => {
				setTimes(res.times)
				setDays(res.days)
			})
	},[])



	const renderAttendance = () => {
		return days.map(item => {
			return (
				<tr>
					<td>
						{item.day}
					</td>

					{
						item?.lessons?.map(lesson => {
							if (lesson?.room) {
								return (
									<td>
										<div className={styles.lessonTuron} style={{backgroundColor: lesson?.teacher_color, color: brightnessColor(lesson?.teacher_color)}}>
											<span>{lesson.teacher}</span>
											<span>{lesson.subject}</span>
											<span>{lesson.room}</span>
										</div>
									</td>
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
		<Table>
			<thead>
			<tr >
				<th>Kun</th>
				{
					times.map(day => {
						return <th>{day}</th>
					})
				}
			</tr>
			</thead>
			<tbody>
			{renderAttendance()}
			</tbody>
		</Table>
	)
}


export default UserLessonTime;