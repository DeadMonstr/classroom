import React, {useEffect, useState} from 'react';
import styles from "pages/subject/level/createChapters/createLesson/style.module.sass"
import Input from "components/ui/form/input";
import ReactPlayer from "react-player";
import {BackUrl, headers, headersImg} from "constants/global";
import {useHttp} from "hooks/http.hook";


const Video = ({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent,extra}) => {

	const [videoComponent,setVideoComponent] = useState({})

	useEffect(() => {
		setVideoComponent(component)
	},[component])

	return component.completed ?
		<ViewVideo type={type} component={videoComponent} onChangeCompletedComponent={onChangeCompletedComponent} extra={extra}/>
		:
		<CreateVideo
			component={videoComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
			extra={extra}
		/>
};



const CreateVideo = ({component,onSetCompletedComponent,onDeleteComponent,extra}) => {

	const [videoLink,setVideoLink] = useState("")

	useEffect(() => {

		if (component) {
			setVideoLink(component?.video)
		}

	},[component])


	const {request} = useHttp()

	const onSubmit = () => {
		const data = {
			video: videoLink
		}

		let method = component?.id ? "PUT" : "POST"


		request(`${BackUrl}lesson/block/video/${component?.id ? component.id + "/" : ""}`,method,JSON.stringify({ ...component,video_link: videoLink,...extra}),headers())
			.then(res => {
				onSetCompletedComponent(data,res.id)
			})


	}



	const onDelete = () => {


		if (component?.id) {

			request(`${BackUrl}lesson/block/video/${component?.id}/`, "DELETE", null, headers())
				.then(res => {
					onDeleteComponent(component.id)
				})
		} else {
			onDeleteComponent(component.id)
		}
	}

	return (
		<div className={styles.component__create}>
			<div className={`${styles.header} ${styles.j_sp_bt}`}>
				<h1>Video kiriting</h1>

				<div>
					<i
						onClick={onDelete}
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
		setVideoComponent(component.video)
	},[component])


	return (
		<div className={styles.component__view}>


			<div className={styles.video}>

				<div className={styles.video__item}>
					{
						type !== 'view' ?
							<div onClick={() => onChangeCompletedComponent(component.id)} className={styles.popup}>
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



