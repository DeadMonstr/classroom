import React, {useEffect, useRef, useState} from "react";
import SyntaxHighlighter  from 'react-syntax-highlighter';

import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import styles from "pages/subject/level/createChapters/createLesson/style.module.sass";
import Select from "components/ui/form/select";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";


const Snippet = React.memo(({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent,extra}) => {

	const [textComponent,setTextComponent] = useState({})
	useEffect(() => {
		setTextComponent(component)
	},[component])
	return component.completed ?
		<SnippetView type={type} component={textComponent} onChangeCompletedComponent={onChangeCompletedComponent} extra={extra}/>
		:
		<SnippetCreate
			component={textComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
			extra={extra}
		/>
})



const SnippetCreate = ({onSetCompletedComponent,component,onDeleteComponent,type,extra}) => {
	const [text,setText] = useState("")
	const [innerType,setInnerType] = useState()

	useEffect(() => {
		if (component) {
			setText(component.text)
			setInnerType(component.innerType)

		}
	},[component])


	const {request} = useHttp()

	const onAdd = () => {


		let method = component?.id ? "PUT" : "POST"

		request(`${BackUrl}lesson/block/code/${component.id || ""}/` ,method,JSON.stringify({...component,text,innerType,...extra}),headers())
			.then(res => {
				onSetCompletedComponent({text,innerType},res.id)
			})
	}


	const onDelete = () => {
		if (component?.id) {

			request(`${BackUrl}lesson/block/code/${component?.id}/`, "DELETE", null, headers())
				.then(res => {
					onDeleteComponent(component.id)
				})
		} else {
			onDeleteComponent(component.id)
		}
	}





	const languages = [
		"python","javascript","html","css","sass","scss"
	]

	return (
		<div className={styles.component__create}>

			<div className={`${styles.header} ${styles.j_sp_bt}`}>
				<h1>Matn kiriting</h1>

				<div>
					<i
						onClick={onDelete}
						className={`fa-solid fa-trash ${styles.trash}`}
					/>
				</div>
			</div>
			<textarea
				value={text}
				required
				onChange={e => setText(e.target.value)}
			/>
			<div className={styles.header}>

				{/*{*/}
				{/*	innerModals.map((item,index) => {*/}
				{/*		return (*/}
				{/*			<Select*/}
				{/*				title={item.title}*/}
				{/*				options={item.options}*/}
				{/*				value={textOptions?.[item.type]}*/}
				{/*				onChange={(e) => {*/}
				{/*					setTextOptions(items => ({...items,[item.type]: e}))*/}
				{/*				}}*/}
				{/*			/>*/}
				{/*		)*/}
				{/*	})*/}
				{/*}*/}

				<Select title={"Til turi"} options={languages} onChange={setInnerType} value={innerType} />
			</div>

			{/*<div*/}
			{/*	ref={refModal}*/}
			{/*	className={classNames(styles.modal,{*/}
			{/*		[`${styles.active}`] : modalOpts.active,*/}
			{/*		[`${styles.right}`] : modalOpts.position === "right",*/}
			{/*		[`${styles.left}`] : modalOpts.position === "left",*/}
			{/*	})}*/}
			{/*	style={{top: modalOpts?.y + "px", left: modalOpts?.x + "px"}}*/}
			{/*>*/}
			{/*	{*/}
			{/*		innerModals.map((item,index ) => {*/}
			{/*			return (*/}
			{/*				<div className={styles.item} key={index}>*/}
			{/*					<span>{item.title}</span>*/}
			{/*					<i className="fa-solid fa-caret-down" />*/}
			{/*					<div className={styles.innerModal}>*/}
			{/*						<Select*/}
			{/*							value={defaultValuesModals[item.type]}*/}
			{/*							options={item.options}*/}
			{/*							onChange={(e) => onChangeInnerModalSelect(item.type,e)}*/}
			{/*						/>*/}
			{/*					</div>*/}
			{/*				</div>*/}
			{/*			)*/}
			{/*		})*/}
			{/*	}*/}
			{/*</div>*/}

			<div
				onClick={onAdd}
				className={styles.submitBtn}
			>
				Tasdiqlash
			</div>

		</div>
	)
}


const SnippetView = ({component,onChangeCompletedComponent,type}) => {

	const [textOpts,setTextOpts] = useState({})
	const [words,setWords] = useState([])

	const [copy,setCopy] = useState(false)


	useEffect(() => {
		if (component) {
			setTextOpts(component.textOptions)
			setWords(component.words)
		}
	},[component])

	useEffect(() => {
		if (copy) {
			setTimeout(() => {
				setCopy(false)
			},2000)
		}
	},[copy])


	return (
		<div className={styles.component__view} >
			<div className={styles.code}>
				{
					type !== 'view' ?
						<div onClick={() => onChangeCompletedComponent(component.id)} className={styles.popup}>
							<i className="fa-sharp fa-solid fa-pen-to-square" />
						</div> : null
				}
				<div className={styles.copyBtn}>
					<CopyToClipboard text={component.text} onCopy={() => setCopy(!copy)}>
						{copy ? <span style={{color:"white"}}>Copied</span> : <i className="fa-regular fa-copy"></i>}

					</CopyToClipboard>
				</div>

				<SyntaxHighlighter
					language={component.innerType}
					style={darcula}
					showLineNumbers={true}
					wrapLines={true}
				>
					{component.text}
				</SyntaxHighlighter>
			</div>

		</div>
	)
}





export default Snippet

