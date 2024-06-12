import React, {useEffect, useRef, useState} from "react";
import styles from "./style.module.sass";
import {BackUrlForDoc} from "constants/global";

const ExcImg = React.memo(({onChangeCompletedComponent,onSetCompletedComponent,component,onDeleteComponent}) => {

	const [imgComponent,setImgComponent] = useState({})

	useEffect(() => {
		setImgComponent(component)
	},[component])

	return imgComponent?.completed ?
		<ViewExc
			imgComponent={imgComponent}
			setImgComponent={setImgComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
		/> :
		<CreateExc
			imgComponent={imgComponent}
			setImgComponent={setImgComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
		/>
})

const ViewExc = React.memo(({imgComponent,setImgComponent,onChangeCompletedComponent}) => {
	return (
		<div className={styles.viewImage}>
			{
				onChangeCompletedComponent ?
					<div onClick={() => onChangeCompletedComponent(imgComponent.index)} className={styles.popup}>
						<i className="fa-sharp fa-solid fa-pen-to-square" />
					</div> : null
			}
			<img src={typeof imgComponent?.img === "string" ? `${BackUrlForDoc}${imgComponent?.img}` : URL.createObjectURL(imgComponent?.img)} alt=""/>
		</div>
	)
})


const CreateExc = ({imgComponent,setImgComponent,onSetCompletedComponent,onDeleteComponent}) => {

	const [img,setImg] = useState(null)

	const imageRef = useRef()

	useEffect(() => {
		if (imgComponent) {
			setImg(imgComponent?.img)
		}
	},[imgComponent])



	const onSubmit = () => {
		const data = {
			img
		}
		onSetCompletedComponent(data)
	}

	const onGetImage = () => {
		imageRef.current.click()
	}


	return (
		<div className={styles.createImage}>

			<div className={styles.subHeader}>
				<i
					onClick={() => onDeleteComponent(imgComponent.index)}
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
				<div onClick={onSubmit} className={styles.btn}>
					Tasdiqlash
				</div>
			</div>
		</div>
	)
}


export default ExcImg