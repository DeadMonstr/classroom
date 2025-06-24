import React, {useEffect, useRef, useState} from "react";
import styles from "./style.module.sass";
import {BackUrlForDoc} from "constants/global";

const ExcAudio = React.memo(({onChangeCompletedComponent,onSetCompletedComponent,component,onDeleteComponent}) => {

	const [audioComponent,setAudioComponent] = useState({})

	useEffect(() => {
		setAudioComponent(component)
	},[component])

	return audioComponent.completed ?
		<ViewExc
			audioComponent={audioComponent}
			setAudioComponent={setAudioComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
		/> :
		<CreateExc
			audioComponent={audioComponent}
			setAudioComponent={setAudioComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
		/>

})

const ViewExc = React.memo(({audioComponent,setAudioComponent,onChangeCompletedComponent}) => {

	return (
		<div className={styles.viewImage}>
			{
				onChangeCompletedComponent ?
					<div onClick={() => onChangeCompletedComponent(audioComponent.index)} className={styles.popup}>
						<i className="fa-sharp fa-solid fa-pen-to-square" />
					</div> : null
			}

			{
				audioComponent.audio ?
					<audio
						controls
						src={
							typeof audioComponent.audio === "string" ?
								`${BackUrlForDoc}${audioComponent.audio}` :
								URL.createObjectURL(audioComponent.audio)
						}
					/>
					: null
			}
		</div>
	)
})




const CreateExc = ({audioComponent,setAudioComponent,onSetCompletedComponent,onDeleteComponent}) => {
	const [audio,setAudio] = useState(null)

	useEffect(() => {
		if (audioComponent) {
			setAudio(audioComponent?.audio)
		}

	},[audioComponent])


	const onSubmit = () => {
		const data = {
			audio
		}
		onSetCompletedComponent(data)
	}


	return (
		<div className={styles.createImage}>
			<div className={styles.subHeader}>
				<i
					onClick={() => onDeleteComponent(audioComponent.index)}
					className={`fa-solid fa-trash ${styles.trash}`}
				/>
			</div>

			<div className={styles.createImage__header}>
				<input
					onChange={e => setAudio(e.target.files[0])}
					type="file"
				/>

				{audio ?  <audio
					controls
					src={
						typeof audio === "string" ?
							`${BackUrlForDoc}${audio}` :
							URL.createObjectURL(audio)
					}
				/>: <h1>Audio ni tanlang</h1>}

			</div>
			<div className={styles.createImage__container}>
				<div onClick={onSubmit} className={styles.btn}>
					Tasdiqlash
				</div>
			</div>
		</div>
	)
}


export default ExcAudio