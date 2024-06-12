import React, {useEffect, useRef, useState} from "react";
import SyntaxHighlighter  from 'react-syntax-highlighter';

import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import styles from "./style.module.sass";
import Select from "components/ui/form/select";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";


const ExcSnippet = React.memo(({component,type, onChangeCompletedComponent, onSetCompletedComponent,onDeleteComponent}) => {

	const [textComponent,setTextComponent] = useState({})
	useEffect(() => {
		setTextComponent(component)
	},[component])
	return component.completed ?
		<SnippetView type={type} component={textComponent} onChangeCompletedComponent={onChangeCompletedComponent}/>
		:
		<SnippetCreate
			component={textComponent}
			onSetCompletedComponent={onSetCompletedComponent}
			onDeleteComponent={onDeleteComponent}
		/>
})



const SnippetCreate = ({onSetCompletedComponent,component,onDeleteComponent,type}) => {
	const [text,setText] = useState("")
	const [innerType,setInnerType] = useState()

	useEffect(() => {
		if (component) {
			setText(component.text)
			setInnerType(component.innerType)
		}
	},[component])


	const onSubmit = () => {
		onSetCompletedComponent({...component,text,innerType})
	}



	const languages = [
		"python","javascript","html","css","sass","scss"
	]

	return (
		<div className={styles.createCode}>

			<div className={styles.subHeader}>
				<i
					onClick={() => onDeleteComponent(component.index)}
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

				<div onClick={onSubmit} className={styles.btn}>
					Tasdiqlash
				</div>
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
		<div className={styles.viewText}>
			<div className={styles.code}>
				{
					onChangeCompletedComponent ?
						<div onClick={() => onChangeCompletedComponent(component.index)} className={styles.popup}>
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

