import React, {useEffect, useRef, useState} from "react";
import styles from "./style.module.sass";
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import {useHttp} from "hooks/http.hook";
import Button from "components/ui/button";

const ExcImg = React.memo(({onChangeCompletedComponent,onSetCompletedComponent,component,onDeleteComponent,extra}) => {

	const [imgComponent,setImgComponent] = useState({})

	useEffect(() => {
		setImgComponent(component)
	},[component])

	return imgComponent?.completed ?
		<ViewExc
			imgComponent={imgComponent}
			setImgComponent={setImgComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
			extra={extra}
		/> :
		<CreateExc
			imgComponent={imgComponent}
			setImgComponent={setImgComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
			extra={extra}
		/>
})

const ViewExc = React.memo(({imgComponent,setImgComponent,onChangeCompletedComponent}) => {
	return (
		<div className={styles.viewImage}>
			{
				onChangeCompletedComponent ?
					<div onClick={() => onChangeCompletedComponent(imgComponent.id)} className={styles.popup}>
						<i className="fa-sharp fa-solid fa-pen-to-square" />
					</div> : null
			}
			<img src={typeof imgComponent?.img === "string" ? `${BackUrlForDoc}${imgComponent?.img}` : URL.createObjectURL(imgComponent?.img)} alt=""/>
		</div>
	)
})


const CreateExc = ({imgComponent,setImgComponent,onSetCompletedComponent,onDeleteComponent,extra}) => {

	const [img,setImg] = useState(null)
	const [loading,setLoading] = useState(false)

	const imageRef = useRef()

	useEffect(() => {
		if (imgComponent) {
			setImg(imgComponent?.img)
		}
	},[imgComponent])


	const {request} = useHttp()

	const onAdd = () => {

		const data = {
			img
		}

		const formData = new FormData()

		formData.append("img",img)
		formData.append("info",JSON.stringify({...imgComponent,...extra}))

		let method = imgComponent?.id ? "PUT" : "POST"


		setLoading(true)
		request(`${BackUrl}exercise/block/image/${imgComponent?.id}/`,method,formData,headersImg())
			.then(res => {
				setLoading(false)
				onSetCompletedComponent(data,res.id)
			})
	}


	const onDelete = () => {


		if (imgComponent?.id) {
			setLoading(true)

			request(`${BackUrl}exercise/block/image/${imgComponent.id}/`, "DELETE", null, headers())
				.then(res => {
					setLoading(false)

					onDeleteComponent(imgComponent.id)
				})
		} else {
			onDeleteComponent(imgComponent.id)
		}
	}


	const onGetImage = () => {
		imageRef.current.click()
	}


	return (
		<div className={styles.createImage}>

			<div className={styles.subHeader}>
				<i
					onClick={onDelete}
					className={`fa-solid fa-trash ${styles.trash}`}
				/>
			</div>

			<div className={styles.createImage__header}>
				<div className={styles.image} onClick={onGetImage}>
					{img ? <img src={typeof img === "string" ? `${BackUrlForDoc}${img}` : URL.createObjectURL(img)} alt="" /> : <h1>Rasm tanlang</h1>}
				</div>
				<input
					onChange={e => setImg(e.target.files[0])}
					className={styles.imgInput} type="file"
					ref={imageRef}
				/>
			</div>
			<div className={styles.createImage__container}>
				<Button type={"submit"} disabled={loading} onClick={onAdd} >
					Tasdiqlash {loading && <i className="fa-solid fa-spinner" />}
				</Button>
			</div>
		</div>
	)
}


export default ExcImg