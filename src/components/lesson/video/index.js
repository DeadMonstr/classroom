import React, {useEffect, useState} from 'react';
import styles from "pages/subject/level/createChapters/createLesson/style.module.sass"
import Input from "components/ui/form/input";
import ReactPlayer from "react-player";


const Video = ({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent}) => {

	const [videoComponent,setVideoComponent] = useState({})

	useEffect(() => {
		setVideoComponent(component)
	},[component])

	return component.completed ?
		<ViewVideo type={type} component={videoComponent} onChangeCompletedComponent={onChangeCompletedComponent}/>
		:
		<CreateVideo
			component={videoComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
		/>
};



const CreateVideo = ({component,onSetCompletedComponent,onDeleteComponent}) => {

	const [videoLink,setVideoLink] = useState("")

	useEffect(() => {

		if (component) {
			console.log(component)
			setVideoLink(component?.videoLink)
		}

	},[component])

	const onSubmit = () => {
		const data = {
			videoLink
		}
		onSetCompletedComponent(data)
	}


	return (
		<div className={styles.component__create}>
			<div className={`${styles.header} ${styles.j_sp_bt}`}>
				<h1>Video kiriting</h1>

				<div>
					<i
						onClick={() => onDeleteComponent(component.index)}
						className={`fa-solid fa-trash ${styles.trash}`}
					/>
				</div>
			</div>


			<div className={styles.video__container}>
				<Input title={"havola(ссылка) ni kiriting"} value={videoLink} onChange={e => setVideoLink(e)} type={"text"} />
			</div>


			<div
				onClick={onSubmit}
				className={styles.submitBtn}
			>
				Tasdiqlash
			</div>

		</div>
	)
}

const ViewVideo = ({component,onChangeCompletedComponent,type}) => {
	const [videoComponent,setVideoComponent] = useState()

	useEffect(() => {
		setVideoComponent(component.videoLink)
	},[component])


	return (
		<div className={styles.component__view}>


			<div className={styles.video}>

				<div className={styles.video__item}>
					{
						type !== 'view' ?
							<div onClick={() => onChangeCompletedComponent(component.index)} className={styles.popup}>
								<i className="fa-sharp fa-solid fa-pen-to-square" />
							</div> : null
					}

					<ReactPlayer
						width='100%'
						height='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1

								}
							}
						}}
						controls={true}
						url={videoComponent}
					/>
				</div>
			</div>
		</div>
	)
}

export default Video;



