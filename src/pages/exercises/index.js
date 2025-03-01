import React, {useCallback, useEffect, useMemo, useState} from 'react';

import styles from "./style.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import {Link} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Table from "components/ui/table";
import Confirm from "components/ui/confirm";
import {setAlertOptions} from "slices/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {
	fetchExercisesData,
	fetchExercisesTypeData, onDeleteExc,
	setSearch,
	setTypes
} from "slices/exercisesSlice";
import {fetchSubjectLevelsData} from "slices/subjectSlice";
import {fetchSubjectsData} from "slices/subjectsSlice";


const Exercises = () => {


	const [confirm,setConfirm] = useState(false)
	const [willDeleteId,setWillDeleteId] = useState(null)



	const {subjects} = useSelector(state => state.subjects)
	const {excs,types,type,subject,level,search} = useSelector(state => state.exercises)
	const {levels} = useSelector(state => state.subject)


	const [selectedType,setSelectedType] = useState(null)
	const [selectedSubject, setSelectedSubject] = useState(null)
	const [selectedLevel, setSelectedLevel] = useState(null)



	const {request} = useHttp()


	useEffect(() => {
		dispatch(fetchExercisesData())
		dispatch(fetchExercisesTypeData())
		dispatch(fetchSubjectsData())
	},[])

	useEffect(() => {

		setSelectedType(type)
		setSelectedSubject(subject)
		setSelectedLevel(level)

	},[])


	useEffect(() => {
		if (selectedSubject && selectedSubject !== "all") {
			dispatch(fetchSubjectLevelsData(selectedSubject))
		}
	}, [selectedSubject])



	const multiPropsFilter = useMemo(() => {

		const filters = {
			subject: selectedSubject,
			type: selectedType,
			level: selectedLevel,
		}
		const filterKeys = Object.keys(filters)


		return excs.filter(exc => {
			return filterKeys.every(item => {
				if (filters[item] === "all" || !filters[item]) return true

				return exc[item].id === +filters[item]
			})
		});
	},[selectedType, excs, selectedSubject, selectedLevel])


	const searchedUsers = useMemo(() => {
		const filteredHeroes = multiPropsFilter.slice()
		return filteredHeroes.filter(item =>
			item.name?.toLowerCase().includes(search?.toLowerCase())
		)
	},[multiPropsFilter,search])

	const onDelete = (id) => {
		setConfirm(true)
		setWillDeleteId(id)
	}

	const dispatch = useDispatch()

	const onConfirmDelete = () => {
		request(`${BackUrl}exercise_profile/${willDeleteId}`,"DELETE",null,headers())
			.then(res => {
				const alert = {
					active : true,
					message: res.msg,
					type: res.status
				}
				dispatch(setAlertOptions({alert}))
				dispatch(onDeleteExc(willDeleteId))
				setConfirm(false)
			})
	}

	const onChangeTypes = (status,data) => {
		if (status === "type") {
			setSelectedType(data)
		}
		else if (status === "subject") {
			setSelectedSubject(data)
		}
		else if (status === "level") {
			setSelectedLevel(data)
		}
		dispatch(setTypes({status,data}))
	}


	const onSetSearch = (e) => {
		dispatch(setSearch(e))
	}


	return (
		<div className={styles.exercises}>
			<h1 className={styles.mainTitle}>Mashqlar:</h1>
			<div className={styles.header}>
				<div>
					<Input title={"Qidiruv"} type={"text"} onChange={onSetSearch} />
					<Select
						all={true}
						value={selectedType}
						options={types}
						title={"Mashq turi"}
						onChange={e => onChangeTypes("type",e)}
					/>
					{subjects.length > 0 ? <Select
						onChange={e => onChangeTypes("subject",e)}
						title={"Fan"}
						name={"subject"}
						options={subjects}
						value={selectedSubject}
						all={true}
					/> : null}

					{levels.length > 0 ? <Select
						onChange={e => onChangeTypes("level",e)}
						title={"Mashq darajasi"}
						name={"level-exc"}
						options={levels}
						value={selectedLevel}
						all={true}
					/> : null}
				</div>
				<div>
					<Link to={"/createExercisesTypes"} className={styles.btn}>
						Mashq turi qo'shish
					</Link>
					<Link to={"/createExercises"} className={styles.btn}>
						Mashq qo'shish
					</Link>
				</div>
			</div>
			<div className={styles.container}>
				<ExcTable onDelete={onDelete} data={searchedUsers}/>
			</div>

			<Confirm active={confirm} setActive={() => setConfirm(false)} onSubmit={onConfirmDelete}>
				O'chirishni hohlaysizmi
			</Confirm>
		</div>
	);
};


const ExcTable = ({data,onDelete}) => {

	const renderData = useCallback(() => {
		return data.map((item,index) => {
			return (
				<tr>
					<td>{index+1}</td>
					<td>{item.name}</td>
					<td>{item.type.name}</td>
					<td>{item.subject.name}</td>
					<td>{item.level.name}</td>
					<td className={styles.icon}>
						<Link to={`/changeExercises/${item.id}`}>
							<i className="fa-solid fa-pen-to-square" />
						</Link>
						<i onClick={() => onDelete(item.id)} style={{color: "red"}} className="fa-solid fa-trash" />
					</td>
				</tr>
			)
		})
	},[data])


    return (
	    <Table>
		    <thead>
			    <tr>
				    <th>N/o</th>
				    <th>Nomi</th>
				    <th>Turi</th>
				    <th>Fan</th>
				    <th>Darajasi</th>

				    <th></th>
			    </tr>
		    </thead>
		    <tbody>
		        {renderData()}
		    </tbody>
	    </Table>
    )
}

export default Exercises;
