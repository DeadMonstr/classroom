import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "./style.module.sass"
import Modal from "components/ui/modal";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import Button from "../../../components/ui/button";
import {Link} from "react-router-dom";


const CreateLevel = ({newLevels = []}) => {

	const [levels,setLevels] = useState([])
	const [activeAddLevel,setActiveAddLevel] = useState(false)
	const [changingItem,setChangingItem] = useState(null)


	useEffect(() => {
		if (newLevels.length > 0) {
			setLevels(newLevels)
		}
	},[newLevels])


	const onAddLevel = () => {
		setActiveAddLevel(true)
	}

	const addLevel = (data) => {
		setActiveAddLevel(false)
		if (data.type === "create") {
			setLevels(levels => [...levels,data])
		}
		else {
			setChangingItem(null)
			setLevels(levels => levels.map((item,i) => {
				if (i === data.index) {
					return {...item,...data}
				}
				return item
			}))
		}
	}


	const innerModalRefs = useRef([])


	const onOpenModal = (index) => {

		for (let i = 0; i < innerModalRefs.length; i++) {
			innerModalRefs.current[index].style.opacity = 0
			innerModalRefs.current[index].style.visibility = "hidden"
		}
		innerModalRefs.current[index].style.opacity = 1
		innerModalRefs.current[index].style.visibility = "visible"

	}


	useEffect(() => {
		document.addEventListener("click",handleClickOutside,true)
	},[])


	const handleClickOutside = (e) => {
		innerModalRefs.current.map(item => {
			if (item?.style?.opacity === "1") {
				if (!item.contains(e.target)) {
					item.style.opacity = "0"
					item.style.visibility = "hidden"
				}
			}
		})
	}
	
	
	const handleLinkModal = (index,type) => {
		if (type === "change") {
			setChangingItem({...levels.filter((item,i) => i ===index)[0],index})
			setActiveAddLevel(true)
		} else  {
			const filteredLinks = levels.filter((item,i) => i !== index)
			setLevels(filteredLinks)
		}


	}

	const renderLevels = useCallback(() => {
		return levels.map((item,index) => {
			return (
				<Link to={`/createLevelLesson/${index}`}>
					<div className={styles.levels__item}>
						<div className={styles.header}>
							<h1>
								{item.title}
							</h1>

							<div className={styles.icon} onClick={() => onOpenModal(index)}>
								<i className="fa-solid fa-ellipsis-vertical"></i>
							</div>

							<div
								className={styles.innerModal}
								ref={(element) => {innerModalRefs.current[index] = element}}
							>
								<div onClick={() => handleLinkModal(index,"change")} className={styles.item}>
									<span className={styles.icon}><i className="fa-solid fa-pen"></i></span>
									<span className={styles.text}>O'zgartirish</span>
								</div>
								<div onClick={() => handleLinkModal(index,"del")} className={`${styles.item} ${styles.del}`}>
									<span className={styles.icon}><i className="fa-solid fa-trash"></i></span>
									<span className={styles.text}>O'chirish</span>
								</div>
							</div>
						</div>
						<div className={styles.container}>
							<p>
								{item.desc}
							</p>
						</div>
					</div>
				</Link>
			)
		})
	},[levels])



	return (
		<div className={styles.createLesson}>
			<div className={styles.header}>
				<h1>Darajalar :</h1>
			</div>


			<div className={styles.levels}>

				<div className={styles.levels__add} onClick={onAddLevel}>
					<i className="fa-solid fa-plus" />
				</div>
				{renderLevels()}
			</div>

			<Modal active={activeAddLevel} setActive={() => setActiveAddLevel(false)}>
				<AddLevel changingItem={changingItem} addLevel={addLevel}/>
			</Modal>
		</div>
	);
};


const AddLevel = ({addLevel,changingItem}) => {


	const [title,setTitle] = useState("")
	const [desc,setDesc] = useState("")
	const [changedIndex,setChangedIndex] = useState(null)



	useEffect(() => {
		if (changingItem) {
			setDesc(changingItem.desc)
			setTitle(changingItem.title)
			setChangedIndex(changingItem.index)
		}
	},[changingItem])


	const onSubmit = useCallback(() => {

		const data = {
			title,
			desc,
			type: changedIndex !== null ? "change" : "create",
			index: changedIndex !== null ? changedIndex : null
		}



		addLevel(data)

		setDesc("")
		setTitle("")
		setChangedIndex(null)
	},[addLevel, changedIndex, desc, title])



	return (
		<div className={styles.addLevel}>
			<div className={styles.header}>
				<h1>Daraja qo'shish</h1>
			</div>

			<div className={styles.container}>
				<Input defaultValue={title} onChange={setTitle} title={"Nomi"}/>
				<Textarea onChange={setDesc} defaultValue={desc} style={{width: `100%`}} title={"Ma'lumot"}/>
			</div>

			<Button type={"submit"} onClick={onSubmit}>Tasdiqlash</Button>
		</div>
	)
}




export default CreateLevel;