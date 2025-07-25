import React, {useEffect, useRef, useState} from "react";
import styles from "./style.module.sass";
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import {useHttp} from "hooks/http.hook";

const ExcAudio = React.memo(({onChangeCompletedComponent,onSetCompletedComponent,component,onDeleteComponent,extra}) => {

	const [audioComponent,setAudioComponent] = useState({})

	useEffect(() => {
		setAudioComponent(component)
	},[component])

	return audioComponent.completed ?
		<ViewExc
			audioComponent={audioComponent}
			setAudioComponent={setAudioComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
			extra={extra}
		/> :
		<CreateExc
			audioComponent={audioComponent}
			setAudioComponent={setAudioComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
			extra={extra}
		/>

})

const ViewExc = React.memo(({audioComponent,setAudioComponent,onChangeCompletedComponent,extra}) => {

	return (
		<div className={styles.viewImage}>
			{
				onChangeCompletedComponent ?
					<div onClick={() => onChangeCompletedComponent(audioComponent.id)} className={styles.popup}>
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




const CreateExc = ({audioComponent,setAudioComponent,onSetCompletedComponent,onDeleteComponent,extra}) => {
	const [audio,setAudio] = useState(null)

	useEffect(() => {
		if (audioComponent) {
			setAudio(audioComponent?.audio)
		}

	},[audioComponent])


	const {request} = useHttp()


	const onAdd = () => {

		const data = {
			audio
		}

		const formData = new FormData()

		formData.append("audio",audio)
		formData.append("info",JSON.stringify({...audioComponent,...extra}))

		let method = audioComponent?.id ? "PUT" : "POST"

		request(`${BackUrl}exercise/block/audio/${audioComponent?.id}/`,method,formData,headersImg())
			.then(res => {
				onSetCompletedComponent(data,res.id)
			})
	}


	const onDelete = () => {

		if (audioComponent?.id) {

			request(`${BackUrl}exercise/block/image/${audioComponent?.id}/`, "DELETE", null, headers())
				.then(res => {
					onDeleteComponent(audioComponent.id)
				})
		} else {
			onDeleteComponent(audioComponent.id)
		}
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
				<div onClick={onAdd} className={styles.btn}>
					Tasdiqlash
				</div>
			</div>
		</div>
	)
}


export default ExcAudio