import React, { useCallback, useEffect, useState } from 'react';

import Back from "components/ui/back";
import Table from "components/ui/table";
import styles from "./style.module.sass";
import { useSelector } from "react-redux";
import { useHttp } from "hooks/http.hook";
import {BackUrl, headers, PlatformUrlApi} from "constants/global";
import Select from "components/ui/form/select";



const BalanceHistory = () => {

	const [data,setData] = useState([])
	const [option,setOption] = useState("")

	const {data:{location_id}} = useSelector(state => state.user)
	const {request} = useHttp()


	useEffect(() => {

		request(`${BackUrl}student_attendance_info`,"GET",null,headers())
			.then(res => {
				setData(res.data)
			})
	},[location_id])


	const options = [
		{
			name: "Qarzlar",
			value: "debts"
		},
		{
			name: "To'lovlar",
			value: "payments"
		},
		{
			name: "Chegirmalar",
			value: "discounts"
		},
		{
			name: "Kitob to'lovlari",
			value: "bookPayments"
		}
	]



	const renderTable = useCallback(() => {
		if (data) {
			if (option === "debts") {
				return <Debts data={data.debts}/>
			}
			else {
				return <DefaultTable data={data[option]}/>
			}

		}

	},[data, option])

	return (
		<div className={styles.history}>

			<Back/>
			<div className={styles.header}>
				<h1>
					{
						options.filter(item => item.value === option )[0]?.name
					}
				</h1>
				<Select options={options} onChange={setOption} value={option}/>
			</div>


			<div className={styles.container}>
				{renderTable()}
			</div>


		</div>
	);
};

const DefaultTable = ({data = []}) => {

	const renderItems = () => {
		return data.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.date}</td>
					<td>{item.payment}</td>
				</tr>
			)
		})
	}

	return (
		<Table>
			<thead>
			<tr>
				<th>No</th>
				<th>Sana</th>
				<th>Tolov</th>
			</tr>
			</thead>
			<tbody>
			{renderItems()}
			</tbody>
		</Table>
	)
}

const Debts = ({data = []}) => {

	const renderItems = () => {
		return data.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.group_name}</td>
					<td>{item.days}</td>
					<td>{item.absent}</td>
					<td>{item.present}</td>
					<td>{item.discount}</td>
					<td>{item.payment}</td>
					<td>{item.month}</td>
					<td>{item.remaining_debt}</td>
					<td>{item.total_debt}</td>
				</tr>
			)
		})
	}

	return (
		<Table>
			<thead>
			<tr>
				<th>No</th>
				<th>Fan</th>
				<th>Kunlar</th>
				<th>Kelmagan kunlar</th>
				<th>Kelgan kunlar</th>
				<th>Chegirma</th>
				<th>Tolov</th>
				<th>Oy</th>
				<th>Qolgan qarz</th>
				<th>Hamma qarz</th>
			</tr>
			</thead>
			<tbody>
				{renderItems()}
			</tbody>
		</Table>
	)
}


export default BalanceHistory;