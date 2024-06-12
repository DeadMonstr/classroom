import React, {useEffect, useState} from "react";
import styles from "./style.module.sass";

const ExcVideo = React.memo(({onChangeCompletedComponent,onSetCompletedComponent,component,onDeleteComponent}) => {

	const [videoComponent,setVideoComponent] = useState({})

	useEffect(() => {
		setVideoComponent(component)
	},[component])

	return component.completed ?
		<ViewExc
			videoComponent={videoComponent}
			setVideoComponent={setVideoComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
		/> :
		<CreateExc
			videoComponent={videoComponent}
			setVideoComponent={setVideoComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
		/>

})

const ViewExc = React.memo(({videoComponent,setVideoComponent,onChangeCompletedComponent}) => {

	return (
		<div className={styles.viewImage}>
			<div onClick={() => onChangeCompletedComponent(videoComponent.index)} className={styles.popup}>
				<i className="fa-sharp fa-solid fa-pen-to-square" />
			</div>
			<video controls src={videoComponent.video ? URL.createObjectURL(videoComponent.video) : null} />
		</div>
	)
})




const CreateExc = ({videoComponent,setVideoComponent,onSetCompletedComponent,onDeleteComponent}) => {
	const [video,setVideo] = useState(null)

	useEffect(() => {
		if (videoComponent) {
			setVideo(videoComponent?.video)
		}

	},[videoComponent])


	const onSubmit = () => {
		const data = {
			video
		}
		onSetCompletedComponent(data)
	}


	return (
		<div className={styles.createImage}>

			<div className={styles.subHeader}>
				<i
					onClick={() => onDeleteComponent(videoComponent.index)}
					className={`fa-solid fa-trash ${styles.trash}`}
				/>
			</div>
			<div className={styles.createImage__header}>
				<input
					onChange={e => setVideo(e.target.files[0])}
					type="file"
				/>

				{video ?  <video controls src={URL.createObjectURL(video)} />: <h1>Video ni tanlang</h1>}

			</div>
			<div className={styles.createImage__container}>
				<div onClick={onSubmit} className={styles.btn}>
					Tasdiqlash
				</div>
			</div>
		</div>
	)
}


export default ExcVideo