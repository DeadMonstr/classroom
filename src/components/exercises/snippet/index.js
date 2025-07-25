import React, {useEffect, useRef, useState} from "react";
import SyntaxHighlighter  from 'react-syntax-highlighter';

import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import styles from "./style.module.sass";
import Select from "components/ui/form/select";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import {BackUrl, headers, headersImg} from "constants/global";
import {useHttp} from "hooks/http.hook";


const ExcSnippet = React.memo(({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent,extra}) => {

	const [textComponent,setTextComponent] = useState({})
	useEffect(() => {
		setTextComponent(component)
	},[component])
	return component.completed ?
		<SnippetView
			type={type}
			component={textComponent}
			onChangeCompletedComponent={onChangeCompletedComponent}
			extra={extra}
		/>
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

		request(`${BackUrl}exercise/block/code/${component?.id}/`,method,JSON.stringify({...component,text,innerType,...extra}),headers())
			.then(res => {
				onSetCompletedComponent({text,innerType},res.id)
			})
	}


	const onDelete = () => {
		if (component?.id) {

			request(`${BackUrl}exercise/block/code/${component?.id}/`, "DELETE", null, headers())
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
		<div className={styles.createCode}>

			<div className={styles.subHeader}>
				<i
					onClick={onDelete}
					className={`fa-solid fa-trash ${styles.trash}`}
				/>
			</div>
			<div className={styles.createCode__header}>
				<textarea
					value={text}
					required
					onChange={e => setText(e.target.value)}
				/>
				<Select title={"Til turi"} options={languages} onChange={setInnerType} value={innerType} />
			</div>
			<div className={styles.createCode__container}>

				<div onClick={onAdd} className={styles.btn}>
					Tasdiqlash
				</div>
			</div>

		</div>
	)
}


const SnippetView = ({component,onChangeCompletedComponent,type}) => {



	const [copy,setCopy] = useState(false)



	useEffect(() => {
		if (copy) {
			setTimeout(() => {
				setCopy(false)
			},2000)
		}
	},[copy])


	return (
		<div className={styles.viewText}>
			<div className={styles.code}>
				{
					onChangeCompletedComponent ?
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





export default ExcSnippet

