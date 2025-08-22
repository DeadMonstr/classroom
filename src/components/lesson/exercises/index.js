import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
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
import {useDispatch} from "react-redux";
import {setArchiveId, setLessonData} from "slices/lessonSlice";
import LoaderPage from "components/ui/loaderPage/LoaderPage";


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
         lessonId,
         archiveId
     }) => {

        const [excComponent, setExcComponent] = useState({})

        useEffect(() => {
            if (component) {
                setExcComponent(component)
            }
        }, [component])

        const {request} = useHttp()

        const onDelete = () => {
            if (component?.id) {
                request(`${BackUrl}lesson/block/exercise/${component.id}/`, "DELETE", null, headers())
                    .then(res => {
                        onDeleteComponent(component.id)
                    })
            } else {
                onDeleteComponent(component.id)
            }
        }


        return excComponent.completed ?
            <ViewExc
                lessonId={lessonId}
                type={type}
                onDeleteComponent={onDelete}
                component={excComponent}
                onChangeCompletedComponent={onChangeCompletedComponent}
                archiveId={archiveId}
            />
            : Object.keys(excComponent).length > 0 ?
                <CreateExc
                    lessonId={lessonId}
                    oldExercises={exercises}
                    subjectId={subjectId}
                    levelId={levelId}
                    component={excComponent}
                    onSetCompletedComponent={onSetCompletedComponent}
                    onDeleteComponent={onDeleteComponent}
                /> : null
    };


const CreateExc = ({
                       onDeleteComponent,
                       onSetCompletedComponent,
                       component,
                       levelId,
                       subjectId,
                       oldExercises,
                       lessonId
                   }) => {

    const [search, setSearch] = useState("")
    const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState(null)
    const [loading, setLoading] = useState(false)
    const [exercises, setExercises] = useState([])

    const {request} = useHttp()

    useEffect(() => {

        if (subjectId && selectedType) {
            setLoading(true)
            request(`${BackUrl}lesson/filter/exercise/${subjectId}/${selectedType}`, "GET", null, headers())
                .then(res => {
                    setLoading(false)
                    setExercises(res.data.filter(item => {
                        if (!oldExercises.length > 0) return item
                        return oldExercises.every(oldExc => oldExc?.exc?.id !== item.id)
                    }))
                })
        }

    }, [subjectId, selectedType])


    useEffect(() => {
        request(`${BackUrl}exercise/type/crud/`, "GET")
            .then(res => {
                setTypes(res.data)
            })
    }, [])

    const multiPropsFilter = useMemo(() => {
        return exercises.filter(exc => {
            if (!selectedType) return true
            return exc.type.id === +selectedType
        });
    }, [selectedType, exercises])


    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter.slice()
        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search?.toLowerCase())
        )
    }, [multiPropsFilter, search])


    const onSubmit = async () => {
        // setLoading(true)

        const activedExc = exercises.filter(item => item.active)[0]

        await request(`${BackUrl}lesson/block/exercise/`, "POST", JSON.stringify({
            exercise_id: activedExc.id,
            lesson_id: lessonId,
            type: "exc"
        }), headers())
            .then(res => {
                onSetCompletedComponent({exc: {...res.exercise}, id: res.id})
            })


        // await setLoading(false)
    }


    const onActive = (id) => {
        setExercises(items => items.map(item => {
            if (item.id === id) {
                return {...item, active: !item.active}
            }
            return {...item, active: false}
        }))
    }


    if (loading) {
        return <Loader/>
    }


    return (
        <Modal active={true} setActive={() => onDeleteComponent(component?.id)}>
            <div className={styles.exc}>
                <h1>Mashqlar</h1>
                <div className={styles.header}>
                    <Input title={"Qidiruv"} onChange={e => setSearch(e)}/>
                    <Select title={"Turi"} options={types} onChange={setSelectedType} value={selectedType}/>
                </div>

                <div className={styles.container}>
                    {
                        loading ? <LoaderPage/> :
                        <>
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
                        </>
                    }
                </div>
                {
                    exercises.some(item => item.active) ?
                        <div className={styles.footer}>
                            <Button
                                type={"submit"}
                                onClick={onSubmit}
                            >
                                Tasdiqlash
                            </Button>
                        </div> : null
                }
            </div>
        </Modal>
    )
}


const ViewExc = ({component, onDeleteComponent, type, lessonId, archiveId}) => {


    const [exc, setExc] = useState()
    const [excComponents, setExcComponents] = useState([])
    const [answers, setAnswers] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [disabledExc, setDisabledExc] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [changedAnswerData, setChangedAnswerData] = useState({})

    const [loading, setLoading] = useState(false)


    useEffect(() => {

        const dataLesson = JSON.parse(localStorage.getItem("dataLesson"))

        setExc(component)

        // setExcComponents(component.exercise.block.map((item, index) => {
        //     const type = item.type
        //     const innerType = item.innerType
        //     const text = item.desc
        //     const img = item.img
        //     const clone = item.clone
        //     const audio = item.audio
        //     let oldData = null
        //     if (dataLesson && dataLesson.lessonId === lessonId) {
        //         oldData = dataLesson.answers.filter(comp => comp.index === index)[0]
        //     }
        //
        //
        //     if (item.isAnswered || type === "check") {
        //         setDisabled(true)
        //         setDisabledExc(true)
        //     } else {
        //         setDisabled(false)
        //         setDisabledExc(false)
        //     }
        //
        //
        //     if (type === "text") {
        //
        //         let words
        //
        //         if (item.isAnswered) {
        //             console.log("keldi")
        //             const old = item?.words_clone
        //             words = old.map(word => {
        //                 const filtered = item.answers.filter(ans => ans.order === word.index)[0]
        //                 if (word.type === "matchWord") {
        //                     return {
        //                         ...word,
        //                         status: filtered?.status,
        //                         item: filtered?.value
        //                     }
        //                 }
        //                 return {
        //                     ...word,
        //                     status: filtered?.status,
        //                     value: filtered?.value
        //                 }
        //
        //             })
        //         } else {
        //             words = oldData?.answers || item?.words_clone
        //             // words = item?.words_clone
        //         }
        //
        //
        //         return {
        //             type,
        //             innerType,
        //             text,
        //             index,
        //             img,
        //             // clone,
        //             // ...clone,
        //             words,
        //             audio,
        //             completed: true,
        //             block_id: item.id
        //         }
        //     }
        //
        //     if (type === "question") {
        //
        //         const answers = item.answers;
        //         const wordsImg = item.words_img;
        //         const options = clone?.variants?.options;
        //         const words = clone.words;
        //         let newOptions = [];
        //         let newWords = [];
        //         let answerInput
        //
        //
        //         for (let i = 0; i < options?.length; i++) {
        //             if (options[i].innerType === "img") {
        //                 const ans = answers.filter(ans => ans.order === options[i].index && ans.type_img === "variant_img")
        //                 newOptions.push({
        //                     ...options[i],
        //                     img: typeof options[i].img === "object" ? ans[0].img : options[i].img
        //                 })
        //             } else {
        //                 newOptions.push(options[i])
        //             }
        //         }
        //
        //
        //         if (clone.variants.type === "select") {
        //             const ans = answers[0]
        //
        //
        //             if (ans.status) {
        //                 newOptions = newOptions.map(opt => {
        //                     if (opt.index === ans.order) {
        //                         return {
        //                             ...opt,
        //                             isAnswer: true,
        //                             checked: ans.value
        //                         }
        //                     }
        //                     return opt
        //                 })
        //             } else if (!ans.status && ans.status !== undefined) {
        //
        //                 newOptions = newOptions.map(opt => {
        //                     if (opt.index === ans.order) {
        //                         return {
        //                             ...opt,
        //                             isAnswer: false
        //                         }
        //                     }
        //                     return opt
        //                 })
        //             } else {
        //                 newOptions = newOptions.map(opt => {
        //                     const isChecked = oldData?.answers.filter(old => old.index === opt.index)[0].checked
        //                     return {
        //                         ...opt,
        //                         checked: isChecked
        //                     }
        //
        //                 })
        //             }
        //         } else {
        //
        //
        //             const ans = answers[0]
        //
        //             answerInput = {
        //                 checked: ans.checked,
        //                 value: oldData?.answers || ans.value,
        //                 isAnswer: ans.status
        //             }
        //         }
        //
        //
        //         if (words && innerType === "imageInText") {
        //             for (let i = 0; i < words.length; i++) {
        //                 if (words[i].active) {
        //                     const img = wordsImg.filter(ans => ans.order === words[i].id && ans.type === "word")
        //                     newWords.push({
        //                         ...words[i],
        //                         img: typeof words[i].img === "object" ? img[0].img : words[i].img
        //                     })
        //                 } else {
        //                     newWords.push(words[i])
        //                 }
        //             }
        //         }
        //
        //         return {
        //             type,
        //             innerType,
        //             text,
        //             index,
        //             completed: true,
        //             words: newWords,
        //             image: innerType !== "text" ? img : null,
        //             variants: {
        //                 ...item.clone.variants,
        //                 options: newOptions,
        //                 ...answerInput
        //             },
        //             clone,
        //             block_id: item.id
        //         }
        //     }
        //
        //     return {
        //         type,
        //         innerType,
        //         text,
        //         index,
        //         img,
        //         clone,
        //         ...clone,
        //         audio,
        //         completed: true,
        //         block_id: item.id
        //     }
        // }))

        const isAnsweredExc =  component.exc.isAnswered || false
        const isChecking =  component.exc.isCheckFinished || false

        if (isAnsweredExc || isChecking) {
            setDisabled(true)
            setDisabledExc(true)
        }
        const preparedComponents = component.exc.blocks.map((item, index) => {
            const {
                type,
                innerType,
                desc: text,
                img,
                audio,
                clone,
                id,
                answers
            } = item;


            const indexNum = index + 1;
            if (type === "question") {
                const options = clone?.variants?.options || [];
                let newOptions = options.map(opt => {
                    if (opt.innerType === "img") {
                        const match = answers?.find(ans => ans.order === opt.index && ans.type_img === "variant_img");
                        return {
                            ...opt,
                            img: match?.img || null
                        };
                    }
                    return opt;
                });


                if (isAnsweredExc) {

                    newOptions = newOptions.map(item => {

                        const ans = answers?.find(ans => ans.order === item.index);
                        return {
                            ...item,
                            isAnswer: ans.student_exercise?.status ? ans.student_exercise.status: false,
                            checked: ans.student_exercise?.status ? !!ans.student_exercise.status: false
                        }
                    })
                }



                return {
                    type,
                    innerType,
                    text,
                    completed: true,
                    image: innerType !== "text" ? img : null,
                    variants: {
                        ...clone.variants,
                        options: newOptions,
                    },
                    clone,
                    id,
                    index: indexNum
                };
            }

            if (type === "text" || type === "textEditor") {

                let words

                if (isAnsweredExc && item?.words_clone) {
                    const old = item?.words_clone
                    words = old.map(word => {
                        const filtered = item.answers.filter(ans => ans.order === word.index)[0]

                        if (word.type === "matchWord") {
                            return {
                                ...word,
                                status: filtered?.student_exercise?.status,
                                item: filtered?.student_exercise?.value
                            }
                        }
                        return {
                            ...word,
                            status: filtered?.student_exercise?.status,
                            value: filtered?.student_exercise?.value
                        }

                    })
                } else {
                    words = item?.words_clone
                    // words = item?.words_clone
                }

                return {
                    type,
                    text,
                    editorState: clone,
                    words,
                    completed: true,
                    id,
                    index: indexNum
                };
            }

            return {
                type,
                innerType,
                text,
                clone,
                ...clone,
                img,
                audio,
                completed: true,
                id,
                index: indexNum
            };
        });

        setExcComponents(preparedComponents);
    }, [component])

    // useEffect(() => {
    //     const dataLesson = JSON.parse(localStorage.getItem("dataLesson"))
    //     console.log("render 2")
    //
    //     if (excComponents.length && Object.keys(dataLesson).length && dataLesson.lessonId === lessonId) {
    //
    //         setExcComponents(components => components.map(item => {
    //             const oldData = dataLesson.answers.filter(comp => comp.index === item.index)
    //             console.log(oldData)
    //             return oldData[0]
    //         }))
    //
    //     }
    // },[excComponents.length])
    //


    const onSetAnswers = (index, changedAnswer) => {
        const isInAnswers = answers.some(item => item.index === index)

        if (isInAnswers) {
            setAnswers(answers => answers.map((item) => {
                if (item.index === index) {
                    return changedAnswer
                }
                return item
            }))
            setChangedAnswerData({index, answer: changedAnswer})
        } else {
            setAnswers(answers => [...answers, changedAnswer])
        }

    }



    useEffect(() => {
        if (answers.length > 0 && !disabledExc) {
            setDisabled(!answers.every(item => item.everyFilled))
        }
    }, [answers])


    useLayoutEffect(() => {


        if (answers && answers.some(item => item.someFilled)) {

            const dataLesson = JSON.parse(localStorage.getItem("dataLesson"))


            // console.log(dataLesson, lessonId)
            if (dataLesson && dataLesson?.lessonId === lessonId && answers.length === dataLesson.answers.length) {
                // console.log("yengi sukaaaa", dataLesson.answers)
                // console.log("sukaaaa", changedAnswerData)

                const newDataLesson = dataLesson.answers.map(item => {
                    if (item.index === changedAnswerData.index) {
                        return changedAnswerData.answer
                    }
                    return item
                })

                // console.log(newDataLesson, "newdasdasdas")
                localStorage.setItem("dataLesson", JSON.stringify({answers: newDataLesson, lessonId}))

            } else {
                // console.log("eski sukaaaa", answers)
                localStorage.setItem("dataLesson", JSON.stringify({answers, lessonId}))
            }
        }

    }, [answers, changedAnswerData, disabled])


    const renderBlocks = () => {
        return excComponents.map((item, index) => {

            if (item.type === "textEditor") {
                return (
                    <div className={styles.line}>
                        <TextEditor component={item}/>
                    </div>
                )
            }
            if (item.type === "text") {
                return (
                    <div className={styles.line}>
                        <Text component={item} setAnswers={onSetAnswers}/>
                    </div>
                )
            }
            if (item.type === "question") {
                return (
                    <div className={styles.line}>
                        <Question component={item} setAnswers={onSetAnswers}/>
                    </div>
                )
            }
            if (item.type === "image") {
                return (
                    <div className={styles.line}>
                        <ExcImg component={item}/>
                    </div>
                )
            }
            if (item.type === "audio") {
                return (
                    <div className={styles.line}>
                        <ExcAudio component={item}/>
                    </div>
                )
            }
            if (item.type === "snippet") {
                return (
                    <div className={styles.line}>
                        <Snippet component={item}/>
                    </div>
                )
            }
        })
    }

    const {request} = useHttp()


    const setComponentBlock = (item, index) => {
        const {
            type,
            innerType,
            desc: text,
            img,
            audio,
            clone,
            id,
            answers
        } = item;

        if (item.isAnswered) {
            setDisabled(true)
            setDisabledExc(true)
        }
        const indexNum = index + 1;
        if (type === "question") {
            const options = clone?.variants?.options || [];
            let newOptions = options.map(opt => {
                if (opt.innerType === "img") {
                    const match = answers?.find(ans => ans.order === opt.index && ans.type_img === "variant_img");
                    return {
                        ...opt,
                        img: match?.img || null
                    };
                }
                return opt;
            });




            newOptions = newOptions.map(item => {

                const ans = answers?.find(ans => ans.order === item.index);
                return {
                    ...item,
                    isAnswer: ans.student_exercise?.status ? ans.student_exercise.status: false,
                    checked: ans.student_exercise?.status ? !!ans.student_exercise.status: false
                }
            })




            return {
                type,
                innerType,
                text,
                completed: true,
                image: innerType !== "text" ? img : null,
                variants: {
                    ...clone.variants,
                    options: newOptions,
                },
                clone,
                id,
                index: indexNum
            };
        }

        if (type === "text" || type === "textEditor") {

            let words

            if (item.isAnswered) {
                const old = item?.words_clone
                words = old.map(word => {
                    const filtered = item.answers.filter(ans => ans.order === word.index)[0]

                    if (word.type === "matchWord") {
                        return {
                            ...word,
                            status: filtered?.student_exercise?.status,
                            item: filtered?.student_exercise?.value
                        }
                    }
                    return {
                        ...word,
                        status: filtered?.student_exercise?.status,
                        value: filtered?.student_exercise?.value
                    }

                })
            } else {
                words = item?.words_clone
                // words = item?.words_clone
            }

            return {
                type,
                text,
                editorState: clone,
                words,
                completed: true,
                id,
                index: indexNum
            };
        }

        return {
            type,
            innerType,
            text,
            clone,
            ...clone,
            img,
            audio,
            completed: true,
            id,
            index: indexNum
        };
    }




    const dispatch = useDispatch()
    const onSubmit = () => {
        setDisabled(true)
        setDisabledExc(true)

        const data = {
            block: answers,
            lessonId,
            excId: component.id
        }

        if (!disabled && !disabledExc) {
            request(`${BackUrl}student/lesson/complete/`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    setAnswers([])
                    dispatch(setArchiveId({id: res.archive_id}))
                    localStorage.removeItem("dataLesson")
                    setExcComponents(excComponents.map((item, index) => {
                        const filtered = res.blocks.filter(comp => comp.id === item.id)[0]
                        if (filtered) {
                            console.log("hellojasdnjasnbd asdasd")
                            return setComponentBlock(filtered, index)
                        }
                        return item
                    }))
                })
        }
    }


    const onReset = () => {
        setAnswers([])
        localStorage.removeItem("dataLesson")
        setLoading(true)
        request(`${BackUrl}student/lesson/reset/${archiveId}/`, "GET", null, headers())
            .then(res => {
                setLoading(false)
                setDisabled(false)
                setDisabledExc(false)
                dispatch(setLessonData({data: res.data}))

            })
    }


    // if (loading) return <Loader/>

    return (
        <div className={styles.exc__view}>

            <form className={styles.container} id={`component-${component.index}`}>
                <div className={styles.subheader}>

                </div>

                {
                    type !== "view" && type !== "check" ?
                        <div className={styles.edit} onClick={() => onDeleteComponent(component?.index)}>
                            <i className="fa-solid fa-trash"></i>
                        </div> : null
                }
                <ExcContext.Provider value={{disabledExc, isView: type === "view"}}>
                    {renderBlocks()}
                </ExcContext.Provider>
            </form>

            {
                type === "view" && !disabled ?
                    <Button form={`component-${component.index}`} type={"submit"} disabled={disabled}
                            onClick={onSubmit}>
                        Tasdiqlash
                    </Button> : null
            }

            {
                archiveId ?
                    <Button
                        onClick={onReset}
                        type={"warning"}
                    >
                        Qayta topshirish
                    </Button>
                    : null
            }

        </div>
    )
}

export default Exercises;