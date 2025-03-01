// import React, {useEffect, useRef, useState} from "react";
// import styles from "pages/subject/level/createChapters/createLesson/LoaderPage.module.sass";
// import Select from "components/ui/form/select";
// import classNames from "classnames";
//
//
// const Text = React.memo(({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent}) => {
//
// 	const [textComponent,setTextComponent] = useState({})
// 	useEffect(() => {
// 		setTextComponent(component)
// 	},[component])
//
//
// 	return component.completed ?
// 		<TextView
// 			type={type}
// 			component={textComponent}
// 			onChangeCompletedComponent={onChangeCompletedComponent}
// 		/>
// 		:
// 		<TextCreate
// 			component={textComponent}
// 			onSetCompletedComponent={onSetCompletedComponent}
// 			onDeleteComponent={onDeleteComponent}
// 		/>
//
//
// })
//
//
//
// const TextCreate = ({onSetCompletedComponent,component,onDeleteComponent,type}) => {
// 	const [text,setText] = useState("")
//
//
//
//
//
// 	return (
// 		<div className={styles.component__create}>
//
// 			<div className={`${styles.header} ${styles.j_sp_bt}`}>
// 				<h1>Matn kiriting</h1>
//
// 				<div>
// 					<i
// 						onClick={() => onDeleteComponent(component.index)}
// 						className={`fa-solid fa-trash ${styles.trash}`}
// 					/>
// 				</div>
// 			</div>
// 			<textarea
// 				value={text}
// 				required
// 				onChange={e => setText(e.target.value)}
// 			/>
// 			<div className={styles.header}>
// 				{
// 					innerModals.map((item,index) => {
// 						return (
// 							<Select
// 								title={item.title}
// 								options={item.options}
// 								value={textOptions?.[item.type]}
// 								onChange={(e) => {
// 									setTextOptions(items => ({...items,[item.type]: e}))
// 								}}
// 							/>
// 						)
// 					})
// 				}
// 			</div>
// 			<div
// 				className={styles.words}
// 				style={{
// 					fontSize: `${textOptions?.size}rem`,
// 					fontWeight: `${textOptions?.weight}`
// 				}}
// 			>
// 				<Words contextMenu={handleClick} words={words} type={"create"}/>
// 			</div>
//
// 			<div
// 				ref={refModal}
// 				className={classNames(styles.modal,{
// 					[`${styles.active}`] : modalOpts.active,
// 					[`${styles.right}`] : modalOpts.position === "right",
// 					[`${styles.left}`] : modalOpts.position === "left",
// 				})}
// 				style={{top: modalOpts?.y + "px", left: modalOpts?.x + "px"}}
// 			>
// 				{
// 					innerModals.map((item,index ) => {
// 						return (
// 							<div className={styles.item} key={index}>
// 								<span>{item.title}</span>
// 								<i className="fa-solid fa-caret-down" />
// 								<div className={styles.innerModal}>
// 									<Select
// 										value={defaultValuesModals[item.type]}
// 										options={item.options}
// 										onChange={(e) => onChangeInnerModalSelect(item.type,e)}
// 									/>
// 								</div>
// 							</div>
// 						)
// 					})
// 				}
// 			</div>
//
// 			<div
// 				onClick={onSubmit}
// 				className={styles.submitBtn}
// 			>
// 				Tasdiqlash
// 			</div>
//
// 		</div>
// 	)
// }
//
//
// const TextView = ({component,onChangeCompletedComponent,type}) => {
//
// 	const [textOpts,setTextOpts] = useState({})
// 	const [words,setWords] = useState([])
//
//
// 	useEffect(() => {
// 		if (component) {
// 			setTextOpts(component.textOptions)
// 			setWords(component.words)
// 		}
// 	},[component])
//
//
// 	const onChange = () => {
// 		console.log(component.index)
// 		onChangeCompletedComponent(component.index)
// 	}
//
// 	return (
// 		<div className={styles.component__view} >
// 			<div
// 				className={styles.text}
// 				style={{
// 					fontSize: `${textOpts?.size}rem`,
// 					fontWeight: `${textOpts?.weight}`
// 				}}
// 			>
// 				{
// 					type !== 'view' ?
// 						<div onClick={onChange} className={styles.popup}>
// 							<i className="fa-sharp fa-solid fa-pen-to-square" />
// 						</div> : null
// 				}
//
// 				<p>
//
// 					<Words words={words} type={"view"}/>
// 				</p>
// 			</div>
//
// 		</div>
// 	)
// }
//
//
// const Words = React.memo(({words,type,contextMenu}) => {
// 	let inValid = /\s/;
// 	let inValidDots = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
//
// 	return words?.map((item,index) => {
// 		if (type === "view") {
// 			if (item.active) {
// 				return (
// 					<input key={index} placeholder={item.word} type="text"/>
// 				)
// 			}
// 			if (item.word.includes("\n")) {
// 				return (
// 					<>
// 						<br/>
// 					</>
// 				)
// 			}
// 			if (inValid.test(item.word)) {
// 				return (
// 					<span key={index}>
// 						{item.word}
// 					</span>
// 				)
// 			}
// 			if (inValidDots.test(item.word)) {
// 				return (
// 					<span key={index}>
// 						{item.word}
// 				</span>
// 				)
// 			}
// 			return (
// 				<span
// 					className={styles.word}
// 					key={index}
// 					style={{
// 						fontSize: `${item.size}rem`,
// 						fontWeight: `${item.weight}`
// 					}}
// 				>
// 					{item.word}
// 				</span>
// 			)
//
// 		} else {
// 			if (item.active) {
// 				return (
// 					<input key={index} placeholder={item.word} type="text"/>
// 				)
// 			}
// 			if (item.word.includes("\n")) {
// 				return (
// 					<>
// 						<br/>
// 					</>
// 				)
// 			}
// 			if (inValid.test(item.word)) {
// 				return (
// 					<span key={index}>
// 						{item.word}
// 					</span>
// 				)
// 			}
// 			if (inValidDots.test(item.word)) {
// 				return (
// 					<span key={index}>
// 						{item.word}
// 				</span>
// 				)
// 			}
// 			return (
// 				<span
// 					className={styles.word}
// 					onContextMenu={(e) => contextMenu(e,index)}
// 					key={index}
// 					style={{
// 						fontSize: `${item.size}rem`,
// 						fontWeight: `${item.weight}`
// 					}}
// 				>
// 					{item.word}
// 				</span>
// 			)
// 		}
// 	})
// })
//
//
// export default Text