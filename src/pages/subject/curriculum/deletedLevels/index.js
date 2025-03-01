import React, { useCallback, useEffect, useRef, useState } from 'react';

import RequireAuthChildren from "components/auth/requireAuthChildren";
import { BackUrl, headers, ROLES } from "constants/global";
import { Link } from "react-router-dom";
import { useHttp } from "hooks/http.hook";
import { useDispatch } from "react-redux";
import { setAlertOptions } from "slices/layoutSlice";
import { changeLevel } from "slices/subjectSlice";
import Modal from "components/ui/modal";
import Confirm from "components/ui/confirm";


import styles from "./style.module.sass";
import { useParams } from "react-router";

const DeletedLevels = () => {
	const {id} = useParams()
	const [levels,setLevels] = useState([])

	const {request} = useHttp()




	useEffect(() => {
		request(`${BackUrl}deleted_levels/${id}`,"GET",null,headers())
			.then(res => {
				console.log(res)
				setLevels(res.data)
			})
	},[id])

	const onDelete = (id) => {
	  setLevels(levels => levels.filter(item => item.id !== id))
	}

	return (
		<div className={styles.deletedLevels}>

			<div className={styles.header}>
				<h1>O'chirilgan Darajalar :</h1>
			</div>


			<Levels levels={levels} onDelete={onDelete}/>
		</div>
	);
};

const Levels = ({levels,onDelete}) => {

	const [activeModal,setActiveModal] = useState(false)
	const [activeConfirm,setActiveConfirm] = useState(false)
	const [willChangeItemId,setWillChangeItemId] = useState("")

	const renderLevels = useCallback( () => {
		return levels.map((item,index) => {
			return (
				<Level
					key={index}
					setWillChangeItemId={setWillChangeItemId}

					setActiveConfirm={setActiveConfirm}
					item={{...item,index,arrLength: levels.length}}
				/>
			)
		})

	},[levels])

	const {request} = useHttp()
	const dispatch = useDispatch()


	const onSubmitConfirm = () => {
		request(`${BackUrl}edit_level/${willChangeItemId}`, "DELETE",headers())
			.then(res => {
				const alert = {
					active : true,
					message: res.msg,
					type: "success"
				}
				dispatch(setAlertOptions({alert}))
				onDelete(willChangeItemId)
			})

		setActiveConfirm(false)
	}



	return (
		<div className={styles.levels}>

			<div className={styles.container}>
				{renderLevels()}
			</div>


			{/*<Modal setActive={() => setActiveModal(false)} active={activeModal}>*/}
			{/*	<CreateEditLevel onSubmit={onSubmit} changeData={levels.filter(item => item.id === willChangeItemId)[0]}/>*/}
			{/*</Modal>*/}
			<Confirm setActive={() => setActiveConfirm(false)} active={activeConfirm} onSubmit={onSubmitConfirm}>
				Qaytarishni hohlaysizmi
			</Confirm>

		</div>
	)
}




const Level = ({item,isNumeric = false,setActiveConfirm,setWillChangeItemId}) => {
	const [activeInnerModal,setActiveInnerModal] = useState(false)

	const styleBasicLine =
		item.index === 0 && isNumeric ?
			{height: `calc(100%)`, top: `4rem`}
			: item.index === item.arrLength - 1 && isNumeric ?
				{height: `7rem`, top: "-3rem"} : null


	const ref = useRef()

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target))  {
				setActiveInnerModal(false)
			}
		}

		document.addEventListener("click",handleClickOutside)
		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	},[activeInnerModal])

	return (
		<div className={styles.levels__item} ref={ref}>
			{
				isNumeric && item.arrLength !== 1 ?
					<div className={styles.numeric}>
						<div className={styles.basic_line} style={styleBasicLine}/>
						<div className={styles.number}>{item.index+1}</div>
						<div className={styles.second_line} />
					</div> :  null
			}

			<RequireAuthChildren allowedRules={[ROLES.Methodist]}>
				<div className={styles.header}>
					<div className={styles.changeBtn} >
						<div
							className={styles.icon}
							onClick={() => {
								setActiveInnerModal(!activeInnerModal)
								setWillChangeItemId(item.id)
							}}
						>
							{
								activeInnerModal ?
									<i className="fa-solid fa-xmark"></i>
									:
									<i className="fa-solid fa-ellipsis-vertical" />

							}

						</div>


						{
							activeInnerModal ?
								<div className={styles.innerModal} >
									<div className={styles.item} onClick={() => {
										setActiveConfirm(true)
										setActiveInnerModal(false)
									}}>
										<span>
											Qaytarmoq
										</span>
										<i className="fa-solid fa-rotate-left"></i>
									</div>
								</div> : null
						}
					</div>
				</div>
			</RequireAuthChildren>


			<Link to={`../level/${item.id}/`} className={styles.info}>
				{
					item.isBlocked ?
						<div className={styles.isBlocked}>
							<i className="fa-solid fa-lock" />
						</div> : null
				}


				<div className={styles.subHeader}>
					<div>{item.name}</div>
					{/*<div>{item.percentage ? item.percentage : 0}%</div>*/}
				</div>

				<p>
					{item.desc.length > 200 ? `${item.desc.substring(0,200)}...` : item.desc}
				</p>
			</Link>
		</div>

	)
}

export default DeletedLevels;