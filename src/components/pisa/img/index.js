import React, {useEffect, useRef, useState} from 'react';
import styles from "pages/subject/level/createChapters/createLesson/style.module.sass"
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import {useHttp} from "hooks/http.hook";




const Img = ({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent,extra}) => {
	const [imgComponent,setImgComponent] = useState({})
	useEffect(() => {
		setImgComponent(component)
	},[component])


	return component.completed ?
		<ViewImg type={type} component={imgComponent} onChangeCompletedComponent={onChangeCompletedComponent}/>
		:
		<CreateImg
			extra={extra}
			component={imgComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
		/>
};



const CreateImg = ({component,onSetCompletedComponent,onDeleteComponent,extra}) => {

	const [img,setImg] = useState(null)

	useEffect(() => {
		if (component) {
			setImg(component?.img)
		}

	},[component])

	const {request} = useHttp()

	const onAdd = () => {

		const data = {
			img
		}

		const formData = new FormData()

		formData.append("img",img)
		formData.append("info",JSON.stringify({...component,...extra}))

		let method = component?.id ? "PUT" : "POST"

		request(`${BackUrl}pisa/block/infos/${component?.id}`,method,formData,headersImg())
			.then(res => {
				onSetCompletedComponent(data,res.id)
			})
	}

	const onDelete = () => {


		if (component?.id) {

			request(`${BackUrl}pisa/block/infos/${component?.id}`, "DELETE", null, headers())
				.then(res => {
					onDeleteComponent(component.index)
				})
		} else {
			onDeleteComponent(component.index)
		}
	}



	const ref = useRef()

	const handleClick = () => {
		ref.current.click()
	}



	return (
		<div className={styles.component__create}>
			<div className={`${styles.header} ${styles.j_sp_bt}`}>
				<h1>Rasm kiriting</h1>
				<div>
					<i
						onClick={onDelete}
						className={`fa-solid fa-trash ${styles.trash}`}
					/>
				</div>
			</div>

			<div className={styles.video__container}>
				<input onChange={e => setImg(e.target.files[0])} ref={ref} type="file" className={styles.input}/>


				<div onClick={handleClick} className={styles.insert}>
					{
						img ?
							<img src={typeof img === "string" ? `${BackUrlForDoc}${img}` : URL.createObjectURL(img)} alt=""/>
							:
							<h1>Rasm kiriting</h1>

					}
				</div>
			</div>

			<div
				onClick={onAdd}
				className={styles.submitBtn}
			>
				Tasdiqlash
			</div>

		</div>
	)
}

const ViewImg = ({component,onChangeCompletedComponent,type}) => {
	const [img,setImg] = useState(null)


	useEffect(() => {
		setImg(component.img)
	},[component])



	return (
		<div className={styles.component__view}>


			<div className={styles.img}>

				<div className={styles.img__item}>
					{
						type !== "view" ?
							<div onClick={() => onChangeCompletedComponent(component.index)} className={styles.popup}>
								<i className="fa-sharp fa-solid fa-pen-to-square" />
							</div> : null
					}


					{
						img ? <img src={typeof img === "string" ? `${BackUrlForDoc}${img}` : URL.createObjectURL(img)} alt=""/> : null
					}

				</div>
			</div>
		</div>
	)
}

export default Img;



