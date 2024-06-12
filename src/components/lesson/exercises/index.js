import React, {useEffect, useMemo, useState} from 'react';
import Modal from "components/ui/modal";
import styles from "components/lesson/exercises/style.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import classNames from "classnames";
import Button from "components/ui/button";
import Loader from "components/ui/loaderPage/LoaderPage";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

import {ExcContext} from "helpers/contexts"

import Text from "components/exercises/text"
import ExcImg from "components/exercises/img";
import ExcAudio from "components/exercises/audio";
import Question from "components/exercises/question";
import Snippet from "components/exercises/snippet";
import TextEditor from "components/exercises/textEditor/TextEditor";


const Exercises =
	({
		 component,
		 exercises,
		 type,
		 onSetCompletedComponent,
		 onChangeCompletedComponent,
		 onDeleteComponent,
		 levelId,
		 subjectId,
		 lessonId
	}) => {

	const [excComponent,setExcComponent] = useState({})

	useEffect(() => {
		if (component) {
			setExcComponent(component)
		}
	},[component])


	return excComponent.completed  ?
		<ViewExc
			lessonId={lessonId}
			type={type}
			onDeleteComponent={onDeleteComponent}
			component={excComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
		/>
		: Object.keys(excComponent).length > 0 ?
			<CreateExc
				oldExercises={exercises}
				subjectId={subjectId}
				levelId={levelId}
				component={excComponent}
				onSetCompletedComponent={onSetCompletedComponent}
				onDeleteComponent={onDeleteComponent}
			/> : null
};



const CreateExc = ({onDeleteComponent,onSetCompletedComponent,component,levelId,subjectId,oldExercises}) => {

	const [search,setSearch] = useState("")
	const [types,setTypes] = useState([])
	const [selectedType,setSelectedType] = useState(null)
	const [loading,setLoading] = useState(false)
	const [exercises,setExercises] = useState([])

	const {request} = useHttp()

	useEffect(() => {

		if (subjectId && levelId) {
			request(`${BackUrl}filter_exercise/${subjectId}/${levelId}`,"GET",null,headers())
				.then(res => {
					console.log(res, "Filter")
					setExercises(res.data.filter(item => {
						if (!oldExercises.length > 0) return item
						return oldExercises.every(oldExc => oldExc?.exc?.id !== item.id)
					}))
				})
		}

	},[subjectId,levelId])



	useEffect(() => {
		request(`${BackUrl}info_exercise_type`,"GET")
			.then(res => {
				setTypes(res.data)
			})
	},[])

	const multiPropsFilter = useMemo(() => {
		return exercises.filter(exc => {
			if (!selectedType) return true
			return exc.type.id === +selectedType
		});
	},[selectedType,exercises])


	const searchedUsers = useMemo(() => {
		const filteredHeroes = multiPropsFilter.slice()
		return filteredHeroes.filter(item =>
			item.name?.toLowerCase().includes(search?.toLowerCase())
		)
	},[multiPropsFilter,search])



	const onSubmit = async () => {
		setLoading(true)

		const activedExc = exercises.filter(item => item.active)[0]

		await request(`${BackUrl}exercise_profile/${activedExc.id}`,"GET",null,headers())
			.then(res => {

				onSetCompletedComponent({exc: {...res.data},id: res.data.id})
			})


		await setLoading(false)
	}


	const onActive = (id) => {
		setExercises(items => items.map(item => {
			if (item.id === id) {
				return {...item,active: !item.active}
			}
			return {...item,active:false}
		}))
	}


	if (loading) {
		return <Loader/>
	}


	return (
		<Modal active={true} setActive={() => onDeleteComponent(component?.index)}>
			<div className={styles.exc}>
				<h1>Mashqlar</h1>
				<div className={styles.header}>
					<Input title={"Qidiruv"} onChange={e => setSearch(e)} />
					<Select title={"Turi"} options={types} onChange={setSelectedType} value={selectedType} />
				</div>

				<div className={styles.container}>
					{
						searchedUsers.map(item => {
							return (
								<div
									className={classNames(styles.exc__item, {
										[`${styles.active}`]: item.active
									})}
									key={item.id}
									onClick={() => onActive(item.id)}
								>
									{item.name}
								</div>
							)
						})
					}
				</div>
				{
					exercises.some(item => item.active) ?
						<div className={styles.footer}>
							<Button
								type={"submit"}
								onClick={onSubmit}
							>Tasdiqlash</Button>
						</div> : null
				}
			</div>
		</Modal>


	)
}


const ViewExc = ({component,onDeleteComponent,type,lessonId,onChange}) => {



	const [exc,setExc] = useState()
	const [excComponents,setExcComponents] = useState([])
	const [answers,setAnswers] = useState([])
	const [disabled,setDisabled] = useState(false)
	const [disabledExc,setDisabledExc] = useState(false)


	const [didExc,setDidExc] = useState([])





	useEffect(() => {

		setExc(component)
		setDidExc(component.didExc)

		setExcComponents(component.exc.block.map((item,index) => {
			const type = item.type
			const innerType = item.innerType
			const text = item.desc
			const img = item.img
			const clone = item.clone
			const audio = item.audio

			if (item.isAnswered || type === "check") {
				setDisabled(true)
				setDisabledExc(true)
			}



			if (type === "text") {

				let words

				if (item.isAnswered) {
					const old = item?.words_clone
					words = old.map(word => {
						const filtered = item.answers.filter(ans => ans.order === word.index)[0]
						if (word.type === "matchWord" ) {
							return {
								...word,
								status: filtered.status,
								item: filtered.value
							}
						}
						return {
							...word,
							status: filtered.status,
							value: filtered.value
						}

					})

				} else {
					words = item?.words_clone
				}




				return {
					type,
					innerType,
					text,
					index,
					img,
					// clone,
					// ...clone,
					words,
					audio,
					completed: true,
					block_id: item.id
				}
			}

			if (type === "question") {

				const answers = item.answers;
				const wordsImg = item.words_img;
				const options = clone?.variants?.options;
				const words = clone.words;
				let newOptions = [];
				let newWords = [];

				for (let i = 0; i < options?.length; i++) {
					if (options[i].innerType === "img") {

						const ans = answers.filter(ans => ans.order === options[i].index && ans.type_img === "variant_img")
						newOptions.push({
							...options[i],
							img: typeof options[i].img === "object" ? ans[0].img  : options[i].img
						})
					}
					else {

						newOptions.push(options[i])
					}
				}


				if (clone.variants.type === "select") {
					const ans = answers[0]

					if (ans.status) {
						newOptions = newOptions.map(opt => {
							if (opt.index === ans.order) {
								return {
									...opt,
									isAnswer: true,
									checked: ans.value
								}
							}
							return opt
						})
					} else if (!ans.status && ans.status !== undefined) {
						newOptions = newOptions.map(opt => {
							if (opt.isTrue) {
								return {
									...opt,
									isAnswer: true
								}
							}
							return {
								...opt,
								isAnswer: false,
								checked: ans.order === opt.index? ans.value : false
							}
						})
					}


				}



				if (words && innerType === "imageInText") {

					for (let i = 0; i < words.length; i++) {
						if (words[i].active) {
							const img = wordsImg.filter(ans => ans.order === words[i].id && ans.type === "word")
							newWords.push({
								...words[i],
								img: typeof words[i].img === "object" ? img[0].img :  words[i].img
							})
						}
						else {
							newWords.push(words[i])
						}
					}
				}

				return {
					type,
					innerType,
					text,
					index,
					completed: true,
					words: newWords,
					image: innerType !== "text" ? img: null,
					variants: {
						...item.clone.variants,
						options: newOptions,
					},
					clone,
					block_id: item.id
				}
			}

			return {
				type,
				innerType,
				text,
				index,
				img,
				clone,
				...clone,
				audio,
				completed: true,
				block_id: item.id
			}
		}))
	},[component])




	const onSetAnswers = (index,changedAnswer) => {

		const isInAnswers = answers.some(item => item.index === index)

		if (isInAnswers) {
			setAnswers(answers => answers.map((item) => {
				if (item.index === index) {
					return changedAnswer
				}
				return item
			}))
		} else {
			setAnswers(answers => [...answers,changedAnswer])
		}
	}

	useEffect(() => {
		if (answers.length > 0 && !disabledExc) {
			setDisabled(!answers.every(item => item.everyFilled))
		}
	},[answers])



	const renderBlocks = () => {
		return excComponents.map(item => {

			if (item.type === "textEditor") {
				return <TextEditor component={item} />
			}
			if (item.type === "text") {
				return <Text component={item} setAnswers={onSetAnswers}/>
			}
			if (item.type === "question") {
				return <Question  component={item} setAnswers={onSetAnswers}/>
			}
			if (item.type === "image") {
				return <ExcImg component={item} />
			}
			if (item.type === "audio") {
				return <ExcAudio component={item} />
			}
			if (item.type === "snippet") {
				return <Snippet component={item} />
			}
		})
	}

	const {request} = useHttp()



	const setComponentBlock = (item,index) => {
		const type = item.type
		const innerType = item.innerType
		const text = item.desc
		const img = item.img
		const clone = item.clone
		const audio = item.audio


		if (item.isAnswered) {
			setDisabled(true)
			setDisabledExc(true)
		}

		if (type === "text") {
			let words

			if (item.isAnswered) {
				const old = item?.words_clone
				words = old.map(word => {
					const filtered = item.answers.filter(ans => ans.order === word.index)[0]

					if (word.type === "matchWord" ) {
						return {
							...word,
							status: filtered.status,
							item: filtered.value
						}
					}
					return {
						...word,
						status: filtered.status,
						value: filtered.value
					}

				})

			} else {
				words = item?.words_clone
			}




			return {
				type,
				innerType,
				text,
				index,
				img,
				// clone,
				// ...clone,
				words,
				audio,
				completed: true,
				block_id: item.id
			}
		}

		if (type === "question") {

			const answers = item.answers;
			const wordsImg = item.words_img;
			const options = clone.variants.options;
			const words = clone.words;
			let newOptions = [];
			let newWords = [];




			for (let i = 0; i < options.length; i++) {
				if (options[i].innerType === "img") {

					const ans = answers.filter(ans => ans.order === options[i].index && ans.type_img === "variant_img")
					newOptions.push({
						...options[i],
						img: typeof options[i].img === "object" ? ans[0].img  : options[i].img
					})
				}
				else {

					newOptions.push(options[i])
				}
			}



			if (clone.variants.type === "select") {
				const ans = answers[0]

				if (ans.status) {
					newOptions = newOptions.map(opt => {
						if (opt.index === ans.order) {
							return {
								...opt,
								isAnswer: true,
								checked: ans.value
							}
						}
						return opt
					})
				} else if (!ans.status && ans.status !== undefined) {
					newOptions = newOptions.map(opt => {
						if (opt.isTrue) {
							return {
								...opt,
								isAnswer: true
							}
						}
						return {
							...opt,
							isAnswer: false,
							checked: ans.order === opt.index? ans.value : false
						}
					})
				}



				// const ans = answers.filter(ans => ans.order === options[i].index)[0]
				// newOptions.push({
				// 	...options[i],
				// 	img: typeof options[i].img === "object" ? ans[0].img  : options[i].img,
				// 	status: ans
				// })
			}


			if (words && innerType === "imageInText") {
				for (let i = 0; i < words.length; i++) {
					if (words[i].active) {
						const img = wordsImg.filter(ans => ans.order === words[i].id && ans.type === "word")
						newWords.push({
							...words[i],
							img: typeof words[i].img === "object" ? img[0].img :  words[i].img
						})
					}
					else {
						newWords.push(words[i])
					}
				}
			}

			return {
				type,
				innerType,
				text,
				index,
				completed: true,
				words: newWords,
				image: innerType !== "text" ? img: null,
				variants: {
					...item.clone.variants,
					options: newOptions,
				},
				clone,
				block_id: item.id
			}
		}

		return {
			type,
			innerType,
			text,
			index,
			img,
			clone,
			...clone,
			audio,
			completed: true,
			block_id: item.id
		}
	}


	const onSubmit = () => {
		setDisabled(true)
		setDisabledExc(true)

		const data = {
			block: answers,
			lessonId,
			excId: component.id
		}
		if (!disabled && !disabledExc) {
			request(`${BackUrl}complete_exercise`,"POST",JSON.stringify(data),headers())
				.then(res => {
					setExcComponents(excComponents.map((item,index) => {
						const filtered = res.block.filter(comp => comp.id === item.block_id)[0]
						if (filtered) {
							return setComponentBlock(filtered, index)
						}
						return item
					}))


				})
		}
	}



	return (
		<div className={styles.exc__view}>

			<div className={styles.container}>
				{
					type !== "view" && type !== "check"  ?
						<div className={styles.edit} onClick={() => onDeleteComponent(component?.index)}>
							<i className="fa-solid fa-trash"></i>
						</div> : null
				}
				<ExcContext.Provider value={{disabledExc,isView: type === "view"}}>
					{renderBlocks()}
				</ExcContext.Provider>
			</div>

			{
				type === "view" && !disabled  ?
					<Button type={"submit"} disabled={disabled} onClick={onSubmit}>
						Tasdiqlash
					</Button> : null
			}

		</div>
	)
}

export default Exercises;