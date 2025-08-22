import React, {useCallback, useEffect, useLayoutEffect, useRef, useState, createContext, useContext} from "react";
import styles from "./style.module.sass";
import classNames from "classnames";
import QuestionVariants from "./variants";
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import Radio from "components/ui/form/radio";
import {ExcContext} from "helpers/contexts";
import Input from "../../ui/form/input";
import {useHttp} from "hooks/http.hook";
import Button from "components/ui/button";
import MathField from "components/ui/mathField";

const QuestionContext = createContext()

const ExcQuestion = React.memo(({
                                    component,
                                    onChangeCompletedComponent,
                                    onSetCompletedComponent,
                                    onDeleteComponent,
                                    setAnswers,
                                    extra
                                }) => {


    const [questionComponent, setQuestionComponent] = useState({})

    useEffect(() => {
        setQuestionComponent(component)
    }, [component])

    return (
        <QuestionContext.Provider value={{component: questionComponent}}>
            {
                component.completed ?
                    <ViewExc
                        questionComponent={questionComponent}
                        setQuestionComponent={setQuestionComponent}
                        onChangeCompletedComponent={onChangeCompletedComponent}
                        setAnswers={setAnswers}
                        extra={extra}
                    /> :
                    <CreateExc
                        questionComponent={questionComponent}
                        setQuestionComponent={setQuestionComponent}
                        onSetCompletedComponent={onSetCompletedComponent}
                        onDeleteComponent={onDeleteComponent}
                        extra={extra}
                    />
            }
        </QuestionContext.Provider>

    )
})


const ViewExc = ({onChangeCompletedComponent, questionComponent = {}, setAnswers}) => {

    const {disabledExc, isView} = useContext(ExcContext)
    const [variants, setVariants] = useState([])
    const [input, setInput] = useState("")
    const [isChanged, setIsChanged] = useState(false)


    useEffect(() => {
        if (questionComponent.variants?.type === "select") {
            setVariants(questionComponent.variants.options)
        } else {
            if (questionComponent.variants?.value) {
                setInput(questionComponent.variants?.value)
            } else {
                setInput("")
            }
        }
    }, [questionComponent])


    const onSetValue = (index) => {
        setVariants(options => options.map((item, i) => {
            if (i === index) {
                return {...item, checked: true}
            }
            return {...item, checked: false}
        }))
        setIsChanged(true)
    }
    const onChangeInput = (value) => {
        setInput(value)
        setIsChanged(true)
    }


    useEffect(() => {
        if (!isChanged) return;

        const type = questionComponent?.variants?.typeVariants === "select" ? variants.length > 0 : questionComponent?.variants?.typeVariants === 'input'
        if (type && setAnswers) {
            setAnswers(questionComponent.index, {
                ...questionComponent,
                answers: questionComponent?.variants?.typeVariants === "select" ? variants : input,
                value: input,
                everyFilled: questionComponent?.variants?.typeVariants === "select" ? variants.some(item => item.checked) : input.length > 0,
                someFilled: questionComponent?.variants?.typeVariants === "select" ? variants.some(item => item.checked) : input.length > 0
            })
        }
    }, [variants, input, questionComponent, isChanged])


    return (
        <div className={styles.viewQuestion}>
            <div className={styles.text}>
                {
                    onChangeCompletedComponent ?
                        <div onClick={() => onChangeCompletedComponent(questionComponent.id)}
                             className={styles.popup}>
                            <i className="fa-sharp fa-solid fa-pen-to-square"/>
                        </div> : null
                }

                {/*<div onClick={() => onChangeCompletedComponent(questionComponent.index)} className={styles.popup}>*/}
                {/*	<i className="fa-sharp fa-solid fa-pen-to-square" />*/}
                {/*</div>*/}
                <>
                    {
                        questionComponent.innerType === "text" ? <p>{questionComponent.text}</p>
                            : questionComponent.innerType === "math" ?
                                <>

                                    <MathField
                                        style={{
                                            backgroundColor: "white",
                                            color:"black",
                                            border: "none",
                                            fontSize: "2.5rem",}}
                                        value={questionComponent.text}
                                        readOnly
                                    />


                                </> :
                                questionComponent.innerType === "image" ? <img
                                        src={typeof questionComponent.image === "string" ? `${BackUrlForDoc}${questionComponent.image}` : URL.createObjectURL(questionComponent.image)}
                                        alt=""/>
                                    :
                                    <div className={styles.words}>
                                        <Words type={"view"} words={questionComponent.words}/>
                                    </div>
                    }
                </>
                {
                    questionComponent?.variants?.typeVariants === "select" ?
                        <div className={styles.variants}>
                            {
                                variants.map(item => {
                                    return (
                                        <Radio
                                            disabled={disabledExc}
                                            extraClassname={item.isAnswer !== undefined && !item.isAnswer ? styles.error : item.isAnswer ? styles.active : null}
                                            onChange={() => onSetValue(item.index)}
                                            id={`question-${questionComponent.id}-variant-${item.index}`}
                                            name={`question-${questionComponent.index}-block-${questionComponent.id}`}
                                            checked={item.checked}
                                        >
                                            {
                                                item.innerType === "text" ?
                                                    <p>{item.text}</p>
                                                    : item.innerType === "math" ?
                                                        <MathField
                                                            style={{
                                                                userSelect: "none",
                                                                backgroundColor: "white",
                                                                color:"black",
                                                                border: "none",
                                                                fontSize: "2.5rem",
                                                            }}
                                                            value={item.text}
                                                            readOnly
                                                        />

                                                    :
                                                    <img
                                                        src={typeof item.img === "string" ? `${BackUrlForDoc}${item.img}` : URL.createObjectURL(item.img)}
                                                        alt=""/>
                                            }
                                        </Radio>
                                    )
                                })
                            }
                        </div>
                        :
                        <div className={styles.input}>
                            <Input
                                // title={questionComponent.variants?.isAnswer !== undefined && !questionComponent.variants?.isAnswer ? `Javob: ${questionComponent.variants?.answer}` : null}
                                onChange={onChangeInput}
                                value={input}
                                type="text"
                                disabled={disabledExc}
                                placeholder={!isView && questionComponent?.variants?.answer}
                                extraClassName={questionComponent.variants?.isAnswer !== undefined && questionComponent.variants?.isAnswer ? styles.active :
                                    questionComponent.variants?.isAnswer !== undefined && !questionComponent.variants?.isAnswer ? styles.error : null}
                            />
                        </div>
                }
            </div>
        </div>
    )
}


const CreateExc = ({questionComponent, onSetCompletedComponent, onDeleteComponent, extra}) => {

    const [text, setText] = useState("")
    const [image, setImage] = useState("")
    const [innerType, setInnerType] = useState("text")
    const [words, setWords] = useState([])
    const [variants, setVariants] = useState()
    const [clone, setClone] = useState([])
    const [loading, setLoading] = useState(false)


    const imageRef = useRef()

    const changeType = (e) => {
        setInnerType(e.target.value)
    }

    useEffect(() => {
        if (questionComponent) {
            setText(questionComponent?.text)
            setInnerType(questionComponent.innerType ? questionComponent.innerType : "text")
            setWords(questionComponent?.words)
            setVariants(questionComponent?.variants)
            setImage(questionComponent?.image)
        }
    }, [questionComponent])

    const handleDoubleClick = useCallback((index) => {
        const filteredItem = words.filter((item, i) => i === index)
        if (!filteredItem[0]?.active) {
            onGetImage()
        }
        setWords(words => words.map((item, i) => {
            if (i === index) {
                if (item.active) {
                    return {...item, active: false, lastModified: true, img: null}
                }
                return {...item, active: !item.active, lastModified: true}
            }
            return {...item, lastModified: false}
        }))

    }, [words])


    useLayoutEffect(() => {
        if (innerType === "imageInText") {
            const regex = /\w+|\s+|[^\s\w]+/g;
            let m
            let newWords = []
            while ((m = regex.exec(text)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                newWords.push({
                    id: newWords.length,
                    word: m[0],
                    start: m.index,
                    end: regex.lastIndex
                })
            }
            setWords(newWords)
        }
    }, [text, innerType])


    const onGetImage = () => {
        imageRef.current.click()
    }


    const onChangeImage = useCallback(async (e) => {
        const currentImg = e.target.files[0]
        if (innerType === "imageInText") {
            setWords(words => words.map((word, i) => {
                if (word.active && word.lastModified) {
                    return {...word, img: currentImg}
                }
                return word
            }), [])
            e.target.value = null
        } else {
            setImage(e.target.files[0])
        }
    }, [innerType])


    const {request} = useHttp()

    const onSubmit = () => {
        const isEmpty = innerType === "text" || innerType === "math" ? text.length === 0 : innerType === "imageInText" ? !words.some(item => item.img) : !image

        if (variants && !isEmpty) {

            const data = {
                text,
                innerType,
                words,
                image: innerType !== "text" && innerType !== "math" ? image : null,
                variants,
                clone
            }

            const formData = new FormData()


            const convertVariantsImagesToFormData = variants?.options?.filter(item => item.innerType === "img")
            const convertImageToFormData = image

            if (convertImageToFormData) {
                formData.append(
                    `img`,
                    convertImageToFormData
                )
            }

            for (let i = 0; i < convertVariantsImagesToFormData?.length; i++) {
                formData.append(
                    `img-index-${convertVariantsImagesToFormData[i].index}`,
                    convertVariantsImagesToFormData[i].img
                )
            }


            let method = questionComponent?.id ? "PUT" : "POST"

            const newData = {
                ...questionComponent, ...data, ...extra
            }

            formData.append("info", JSON.stringify(newData))


            setLoading(true)
            request(`${BackUrl}exercise/block/question/${questionComponent?.id ? questionComponent?.id + "/" : ""}`, method, formData, headersImg())
                .then(res => {
                    setLoading(false)
                    onSetCompletedComponent(data, res.id)
                })
            // onSetCompletedComponent(data)
        }
    }


    console.log(questionComponent , "questionComponent")

    const onDelete = () => {
        if (questionComponent?.id) {
            request(`${BackUrl}exercise/block/question/${ questionComponent?.id}/`, "DELETE", null, headers())
                .then(res => {
                    onDeleteComponent(questionComponent.id)
                })
        } else {
            onDeleteComponent(questionComponent.id)
        }
    }

    useEffect(() => {
        if (variants?.options?.length > 0 || words?.length > 0) {
            setClone({
                variants,
                words
            })
        }

    }, [variants, words])

    return (
        <div className={styles.createQuestion}>
            <div className={styles.subHeader}>
                <i
                    onClick={onDelete}
                    className={`fa-solid fa-trash ${styles.trash}`}
                />
            </div>
            <div className={styles.createQuestion__header}>
                {
                    innerType === "text" || innerType === "imageInText" ?
                        <textarea disabled={innerType === "imageInText"} value={text}
                                  onChange={e => setText(e.target.value)} name="" id=""/>
                        : null
                }
                {
                    innerType === "math" ?
                        <div className={styles.mathField}>
                            <MathField
                                value={text} onChange={setText} default-mode="math"
                            />
                        </div>

                        : null
                }
                {
                    innerType === "image" ?
                        <div className={styles.image} onClick={onGetImage}>
                            {image ? <img
                                src={typeof image === "string" ? `${BackUrlForDoc}${image}` : URL.createObjectURL(image)}
                                alt=""/> : <h1>Rasm tanlang</h1>}
                        </div>
                        : null
                }
                <input
                    onChange={onChangeImage}
                    className={styles.imgInput} type="file"
                    ref={imageRef}
                />
                {/*<input value={text} onChange={e => setText(e.target.value)} type="text"/>*/}
                <select value={innerType} name="" id="" onChange={changeType}>
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="math">Math</option>
                    {/*<option value="imageInText">Image in text</option>*/}
                </select>
            </div>
            <div className={styles.createQuestion__container}>
                {
                    innerType === "text" ?
                        <div className={styles.createQuestion__text}>
                            {text}
                        </div> : null
                }
                {
                    innerType === "image" ?
                        <>
                            <div></div>
                        </>
                        : null
                }
                {
                    innerType === "math" ?
                        <>
                            <div className={styles.createQuestion__text}>
                                <MathField value={text} readOnly/>

                            </div>
                        </>
                        : null
                }

                {/*{*/}
                {/*    innerType === "imageInText" ?*/}
                {/*        <>*/}
                {/*            <div className={styles.createQuestion__innerHeader}>*/}
                {/*                <div>*/}
                {/*                    <h1>So'zlarni tanlang</h1>*/}
                {/*                    <h1 className={styles.error}>*/}
                {/*                        So'zlarni tanlashdan oldin matn to'liq yozilganliga ishonch hosil qiling !*/}
                {/*                    </h1>*/}
                {/*                </div>*/}
                {/*                <div className={styles.about}>*/}
                {/*                    <div className={styles.popup}>*/}
                {/*                        Qollanma*/}
                {/*                    </div>*/}
                {/*                    <i className="fa-solid fa-question"></i>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className={styles.createQuestion__text}>*/}
                {/*                {*/}
                {/*                    words.length > 0*/}
                {/*                        ? <Words words={words} handleDoubleClick={handleDoubleClick}/>*/}
                {/*                        : <h1>Matn mavjud emas</h1>*/}
                {/*                }*/}
                {/*            </div>*/}
                {/*        </>*/}
                {/*        : null*/}
                {/*}*/}
                <QuestionVariants
                    variants={variants}
                    setVariants={setVariants}
                />
                <Button type={"submit"} disabled={loading} onClick={onSubmit}>
                    Tasdiqlash {loading && <i className="fa-solid fa-spinner"/>}
                </Button>
            </div>
        </div>
    )
}

const Words = React.memo(({words, handleDoubleClick, type}) => {
    let inValid = /\s/;
    let inValidDots = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

    return words?.map((item, index) => {
        if (type === "view") {
            if (item.active && item.img) {
                return (
                    <img
                        onDoubleClick={() => handleDoubleClick(index)}
                        src={typeof item.img === "string" ? `${BackUrlForDoc}${item.img}` : URL.createObjectURL(item.img)}
                        alt=""
                    />
                )
            }
            if (item.word.includes("\n")) {
                return (
                    <>
                        <br/>
                    </>
                )
            }
            return (
                <span>
					{item.word}
				</span>
            )

        } else {
            if (item.active && item.img) {
                return (
                    <img
                        onDoubleClick={() => handleDoubleClick(index)}
                        src={typeof item.img === "string" ? `${BackUrlForDoc}${item.img}` : URL.createObjectURL(item.img)}
                        alt=""
                    />
                )
            }
            if (item.word.includes("\n")) {
                return (
                    <>
                        <br/>
                    </>
                )
            }
            if (inValid.test(item.word)) {
                return (
                    <span>
					{item.word}
				</span>
                )
            }
            if (inValidDots.test(item.word)) {
                return (
                    <span>
                        {item.word}
                    </span>
                )
            }
            return (
                <span
                    className={classNames(styles.word, {
                        [styles.active]: item.active
                    })}
                    onDoubleClick={() => handleDoubleClick(index)}
                >
				{item.word}
			</span>
            )
        }
    })
})


export {QuestionContext}
export default ExcQuestion