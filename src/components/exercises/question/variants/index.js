import React, {useCallback, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import styles from "../style.module.sass";
import {QuestionContext} from "../index";
import {BackUrlForDoc} from "constants/global";
import MathField from "components/ui/mathField";

const QuestionVariants = ({setVariants,variants}) => {

	const [typeVariants,setTypeVariants] = useState("select")

	useEffect(() => {
		if (variants) {
			setTypeVariants(variants.typeVariants)
		}
	},[variants])

	const getVariants = useCallback((data) => {
		setVariants({...data,typeVariants})
	},[setVariants, typeVariants])



	return(
		<div className={styles.createQuestion__variants}>
			{
				variants && !variants?.edit ?
					<QuestionVariantsView
						variants={variants}
						typeVariants={typeVariants}
						setTypeVariants={setTypeVariants}
						getVariants={getVariants}
					/>
					:
					<QuestionVariantsCreate
						variants={variants}
						typeVariants={typeVariants}
						setTypeVariants={setTypeVariants}
						getVariants={getVariants}
					/>
			}
		</div>
	)


}



const QuestionVariantsCreate = React.memo(({getVariants,typeVariants,setTypeVariants,variants}) => {


	const onSubmitVariant = (data) => {
		getVariants(data)
	}

	const renderVariants = () => {
		if (typeVariants === "input") {
			return (
				<InputVariant
					variants={variants}
					onSubmitVariant={onSubmitVariant}
				/>
			)
		}
		if (typeVariants === "select") {
			return (
				<Select
					variants={variants}
					onSubmitVariant={onSubmitVariant}
				/>
			)
		}
	}

	return (
		<div className={styles.createQuestion__variantsCreate}>
			<div className={styles.createQuestion__variantsCreate_header}>
				<h1>Varianlar :</h1>
				<select value={typeVariants} onChange={e => setTypeVariants(e.target.value)}  name="" id="">
					<option value="input">Input</option>
					<option value="select">select</option>
					<option value="math">Math</option>
				</select>
			</div>
			<div className={styles.createQuestion__variantsCreate_container}>
				{renderVariants()}
			</div>

		</div>
	)
}) 

const QuestionVariantsView = React.memo(({setTypeVariants,typeVariants,variants,getVariants,parentIndex}) => {



	const renderVariants = () => {
		if (typeVariants === "input") {
			return (
				<InputVariant variants={variants} type={"view"}/>
			)
		}
		if (typeVariants === "select") {
			return (
				<Select variants={variants} type={"view"}/>
			)
		}
	}

	const onEdit = () => {
		getVariants({...variants,edit: true})
	}

	return (
		<div className={styles.createQuestion__variantsView}>
			<div className={styles.createQuestion__variantsView_header}>
				<h1>
					Variantlar:
				</h1>

				<i className="fa-sharp fa-solid fa-pen-to-square" onClick={onEdit} />
			</div>
			<div className={styles.createQuestion__variantsView_container}>
				{renderVariants()}
			</div>
		</div>
	)
}) 


const InputVariant =  ({onSubmitVariant,variants,type}) => {

	const [answer,setAnswer] = useState('')

	const onSubmit = () => {
		const data = {
			type: "input",
			answer,
		}
		onSubmitVariant(data)
	}
	
	useEffect(() => {
		if (variants) {
			setAnswer(variants.answer)
		}
	},[variants])

	return (
		<>
			<div className={styles.input}>
				{
					type === "view" ?
						<input type="text" placeholder={variants.answer}/>
						:
						<>
							<h1>Javobini kiriting. Kiritilgan javob o'quvchida korinmaydi. </h1>
							<input type="text" value={answer} onChange={e => setAnswer(e.target.value)}/>
							<div className={styles.submit} onClick={onSubmit}>
								Variantni Kiritish
							</div>
						</>
				}
			</div>
		</>
	)
}


const Select = ({variants,onSubmitVariant,type}) => {
	
	const [options,setOptions] = useState([])

	const [error,setError] = useState("")

	useEffect(() => {
		if (variants?.options) {
			setOptions(variants.options)
		} else {
			setOptions([{
				innerType : "text",
				text: "",
				isTrue: false,
				img: null
			}])
		}
	},[variants])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onChange = useCallback((data) => {
		setOptions(options => options.map((item,index) => {
			if (index === data.index) {
				return {...item,...data}
			}
			return item
		}))
	},[])

	const onDeleteOption = (index) => {
		const filtered = options.filter((item,i) => i !== index)
		setOptions(filtered)
	}
	
	const onChangeIsTrue = useCallback((index) => {

		setOptions(options => options.map((item,i) => {
			if (i === index) {
				return {...item,isTrue: !item.isTrue}
			}
			return {...item,isTrue: false}
		}))
	},[]) 
	
	const renderOptions = useCallback((isView) => {
		return options.map((item,index) => {
			return <Option
				key={index}
				item={item}
				index={index}
				onChange={onChange}
				onChangeIsTrue={onChangeIsTrue}
				isView={isView}
				onDeleteOption={onDeleteOption}
			/>
		})
	},[onChange, onChangeIsTrue, options])



	const addOption = () => {

		setOptions([...options,{
			innerType : "text",
			text: "",
			isTrue: false,
			img: null
		}])
	}



	const onSubmit = () => {
		const isEmpty = options.every(item => item.innerType === "text" || item.innerType === "math"  ? item.text.length > 0 : item.img)
		const isChecked = options.some(item => item.isTrue)

		if (isChecked && isEmpty) {
			const data = {
				type: "select",
				options
			}
			onSubmitVariant(data)
		} else {
			setError("Variantlar to'liq toldirilmagan yoki tog'ri javob tanlanmagan")
		}
	}


	return (
		<div className={styles.select}>
			{
				type === "view" ?
					<>
						{renderOptions(true)}
					</>
					:
					<>
						<h1>
							{error}
						</h1>
						{renderOptions(false)}

						<div className={styles.select__addOption}>
							<i onClick={addOption} className="fa-sharp fa-solid fa-plus" />
						</div>

						<div className={styles.submit} onClick={onSubmit}>
							Variantlarni Kiritish
						</div>
					</>
			}
		</div>
	)
}

const Option = React.memo( ({index,item,onChange,onChangeIsTrue,isView,onDeleteOption}) => {


	const {component} = useContext(QuestionContext)
	const [innerType,setInnerType] = useState(item.innerType)
	const [text,setText] = useState(item.text)
	const [isTrue,setIsTrue] = useState(item.isTrue)
	const [img,setImg] = useState(item.img)
	const imageRef = useRef()


	useLayoutEffect(() => {
		setText(item.text)
		setIsTrue(item.isTrue)
		setImg(item.img)
		setInnerType(item.innerType)
	},[item])

	useEffect(() => {
		if (innerType || text || img) {
			onChange({innerType,text,img,index})
		}
	},[img, index, innerType, onChange, text])
	



	const onGetImage =  () => {
		imageRef.current.click()
	}

	const onChangeImage = useCallback( async (e) => {
		setImg(e.target.files[0])
	},[])



	const renderOptionView = useCallback(() => {
		return (
			<label htmlFor={`question-${component.index}-variant-${item.index}`} className={styles.option__view}>
				<input type="radio" name={`question-${component.index}`} id={`question-${component.index}-variant-${item.index}`} />
				{
					item.innerType === "text" ?
						<span>{item.text}</span>
						: item.innerType === "math" ?
							<MathField
								style={{
									backgroundColor: "white",
									color:"black",
									border: "none",
									fontSize: "2.5rem",}}
								value={item.text}
								readOnly
							/>
						:
						<img src={typeof item.img === "string" ? `${BackUrlForDoc}${item.img}` : URL.createObjectURL(item.img)} alt=""/>
				}
			</label>
		)
	},[item])

	return (
		<>
			{
				isView ?
					renderOptionView()
					:
					<div className={styles.option}>
						<input
							checked={isTrue}
							type="checkbox"
							onChange={() => onChangeIsTrue(index)}
							className={styles.option__checkbox}
						/>
						<span>{index+1}.</span>
						{
							innerType === "text" ?
								<input value={text} className={styles.option__input} onChange={e => setText(e.target.value)} type="text"/>
								:
								innerType === "math" ?
									<div className={styles.option__math}>
										<MathField
											value={text} onChange={setText} default-mode="math"
										/>
									</div>

								:
								<div onClick={onGetImage} className={styles.option__img}>

									{
										img ? <img src={typeof img === "string" ? `${BackUrlForDoc}${img}` : URL.createObjectURL(img)} alt=""/> : <h1>Rasm tanlang</h1>
									}

									<input
										onChange={onChangeImage}
										ref={imageRef}
										className={styles.option__input}
										type="file"
									/>
								</div>
						}
						<select value={innerType} onChange={e => setInnerType(e.target.value)} name="" id="">
							<option value="text">Text</option>
							<option value="img">Image</option>
							<option value="math">Math</option>
						</select>
						{
							index !== 0 ?
								<div onClick={() => onDeleteOption(index)} className={styles.minus}>
									<i className="fa-solid fa-minus"></i>
								</div> : null
						}

					</div>
			}
		</>
	)
})




export default QuestionVariants