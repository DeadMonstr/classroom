import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm} from "react-hook-form";

import Select from "components/ui/form/select";
import Input from "components/ui/form/input";

import styles from "./style.module.sass"



import Button from "components/ui/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, headersImg} from "constants/global";
import Form from "components/ui/form";
import {setAlertOptions} from "slices/layoutSlice";
import {useDispatch} from "react-redux";
import { useNavigate, useParams} from "react-router";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";

import {ReactComponent as ChangePen} from "assets/icons/pen-solid.svg"
import Checkbox from "components/ui/form/checkbox";

import ExcAudio from "components/exercises/audio";
import ExcImg from "components/exercises/img";
import ExcQuestion from "components/exercises/question";
import ExcText from "components/exercises/text";
import TextEditor from "components/exercises/textEditor/TextEditor";
import ExcSnippet from "components/exercises/snippet";
import ExcVideo from "components/exercises/video";
import Loader from "components/ui/loader/Loader";


const CreateExercises = () => {

    const {id} = useParams()


    const { formState: {errors}} = useForm()
    const [oldData,setOldData] = useState()

    const [components, setComponents] = useState([])
    const [subjects, setSubjects] = useState([])
    const [levels, setLevels] = useState([])
    const [types, setTypes] = useState([])
    const [dataBaseComponents, setDataBaseComponents] = useState([])
    const [isChanged, setIsChanged] = useState(false)


    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [selectedType, setSelectedType] = useState(null)
    const [random, setRandom] = useState(false)


    const [title, setTitle] = useState(null)
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)
    const [loading, setLoading] = useState(false)


    const {request} = useHttp()



    useEffect(() => {
        if (
            oldData && Object.keys(oldData).length &&
            (title !== oldData?.name ||
                selectedLevel !== oldData?.level?.id ||
                selectedType !== oldData?.type?.id ||
                selectedSubject !== oldData?.subject?.id)
        ) {
            setIsChanged(true)
        } else {
            setIsChanged(false)
        }
    },[title,selectedLevel,selectedType,selectedSubject,oldData])

    useEffect(() => {
        const preparedComponents = dataBaseComponents.map((item, index) => {
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

                const newOptions = options.map(opt => {
                    if (opt.innerType === "img") {
                        const match = answers?.find(ans => ans.order === opt.index && ans.type_img === "variant_img");
                        return {
                            ...opt,
                            img: match?.img || null
                        };
                    }
                    return opt;
                });

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
                return {
                    type,
                    text,
                    editorState: clone,
                    words: item.words_clone || [],
                    completed: true,
                    id,
                    index: indexNum
                };
            }

            // === DEFAULT CASE ===
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

        setComponents(preparedComponents);
    }, [dataBaseComponents])


    useEffect(() => {
        request(`${BackUrl}exercise/crud/${id}/`, "GET",null,headers())
            .then(res => {
                setDataBaseComponents(res.data.blocks)
                setSelectedSubject(res.data.subject.id)
                setSelectedLevel(res.data.level.id)
                setSelectedType(res.data.type.id)
                setTitle(res.data.name)
                // setRandom(res.data.random)
                setOldData(res.data)
            })
    }, [id])


    useEffect(() => {
        request(`${BackUrl}subject/list/`, "GET", null, headers())
            .then(res => {
                setSubjects(res.subjects)

            })

        request(`${BackUrl}exercise/type/crud/`, "GET", null, headers())
            .then(res => {

                setTypes(res.data)
            })
    }, [])

    useEffect(() => {

        if (selectedSubject) {
            request(`${BackUrl}level/info/${selectedSubject}`, "GET", null, headers())
                .then(res => {
                    setLevels(res.data)
                    // setSelectedLevel(null)
                })
        }
    }, [selectedSubject])




    // useDebounce(() => {
    //
    //     if (!selectedType || !selectedLevel || !selectedSubject ) return;
    //
    //     if (
    //         oldData && Object.keys(oldData).length &&
    //         (title !== oldData?.name ||
    //         selectedLevel !== oldData?.level?.id ||
    //         selectedType !== oldData?.type?.id ||
    //         selectedSubject !== oldData?.subject?.id)
    //     ) {
    //         request(`${BackUrl}exercise/crud/${id}/`, "PUT", JSON.stringify({title, subject: selectedSubject, level: selectedLevel, type: selectedType}), headers())
    //             .then(res => {
    //                 const alert = {
    //                     active: true,
    //                     message: res.msg,
    //                     type: res.status
    //                 }
    //                 dispatch(setAlertOptions({alert}))
    //             })
    //     }
    // }, 1000, [title,selectedLevel,selectedType,selectedSubject,id, oldData])




    const onSetCompletedComponent = useCallback((data, id) => {
        setComponents(state => state.map((item, index) => {
            if (!item.completed) {
                return {...item, ...data, completed: true, id, canDelete: true}
            }
            return item
        }))
    }, [components])



    const onChangeCompletedComponent = (id) => {
        if (components.every(item => item.completed)) {
            setComponents(state => state.map((item, i) => {
                if (item.id === id) {
                    return {...item, completed: false}
                }
                return item
            }))
        }
    }

    const onDeleteComponent = (id) => {
        const sortedList = components.filter((item) => item.id !== id)
        setComponents(sortedList)
    }



    const renderComponents = useCallback(() => {
        return components.map((item, index) => {
            if (item.type === "textEditor") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <TextEditor
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{exc_id: id}}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "text") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <ExcText
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{exc_id: id}}
                        />
                    </SortableItem>

                )
            }
            if (item.type === "question") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <ExcQuestion
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{exc_id: id}}
                        />
                    </SortableItem>

                )
            }
            if (item.type === "image") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <ExcImg
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{exc_id: id}}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "audio") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <ExcAudio
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{exc_id: id}}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "video") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <ExcVideo
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "snippet") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <ExcSnippet
                            component={{...item, parentIndex: index}}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{exc_id: id}}
                        />
                    </SortableItem>
                )
            }
        })
    }, [components, onSetCompletedComponent, changeLessonsSort])


    const onClickText = (type) => {
        const index = components.length + 1
        if (components.every(item => item.completed) || components.length === 0) {
            if (type === "textEditor") {
                setComponents(state => [...state, {
                    index: index, type: "textEditor", text: "", completed: false
                }])
            }
            if (type === "text") {
                setComponents(state => [...state, {
                    index: index, type: "text", text: "", words: [], completed: false
                }])
            }
            if (type === "snippet") {
                setComponents(state => [...state, {
                    index: index, type: "snippet", text: "", completed: false
                }])
            }
            if (type === "question") {
                setComponents(state => [...state, {
                    index: index, type: "question", text: "", words: [], completed: false
                }])
            }
            if (type === "image") {
                setComponents(state => [...state, {
                    index: index, type: "image", img: null, completed: false
                }])
            }
            if (type === "audio") {
                setComponents(state => [...state, {
                    index: index, type: "audio", audio: null, completed: false
                }])
            }
            if (type === "video") {
                setComponents(state => [...state, {
                    index: index, type: "video", video: null, completed: false
                }])
            }
        }
    }

    useEffect(() => {
        const handler = (e) => {
            if (!isChanged) return;
            e.preventDefault();
            e.returnValue = ""; // Required for Chrome
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isChanged]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onSubmit = (e) => {
        e.preventDefault()
        // const formData = new FormData()
        //
        // const componentQuestionImg = components.filter(item => item.type === "question")
        // const componentImg = components.filter(item => item.type === "image")
        // const componentAudio = components.filter(item => item.type === "audio")
        //
        // if (componentQuestionImg.length > 0) {
        //     for (let item of componentQuestionImg) {
        //         const convertVariantsImagesToFormData = item.variants?.options?.filter(item => item.innerType === "img")
        //         const convertWordsImagesToFormData = item.words?.filter(item => item.img)
        //         const convertImageToFormData = item.image
        //
        //         if (convertImageToFormData) {
        //             formData.append(
        //                 `component-${item.index}-img`,
        //                 convertImageToFormData
        //             )
        //         }
        //
        //
        //         for (let i = 0; i < convertVariantsImagesToFormData?.length; i++) {
        //             formData.append(
        //                 `component-${item.index}-variants-index-${convertVariantsImagesToFormData[i].index}`,
        //                 convertVariantsImagesToFormData[i].img
        //             )
        //         }
        //
        //
        //         for (let i = 0; i < convertWordsImagesToFormData?.length; i++) {
        //             formData.append(
        //                 `component-${item.index}-words-index-${convertWordsImagesToFormData[i].id}`,
        //                 convertWordsImagesToFormData[i].img
        //             )
        //         }
        //
        //         // formData.append(`component-${item.index}[]`,item.variantsImgFormData)
        //     }
        // }
        //
        // if (componentImg.length > 0) {
        //     for (let item of componentImg) {
        //         formData.append(
        //             `component-${item.index}-img`,
        //             item.img
        //         )
        //     }
        // }
        //
        // if (componentAudio.length > 0) {
        //     for (let item of componentAudio) {
        //         formData.append(
        //             `component-${item.index}-audio`,
        //             item.audio
        //         )
        //     }
        // }
        //
        // const newData = {
        //     components,
        //     title,
        //     selectedSubject,
        //     selectedLevel,
        //     typeEx: selectedType,
        //     random
        // }
        //
        //
        //
        // formData.append("info", JSON.stringify(newData))
        // setLoading(true)
        //
        // request(`${BackUrl}info_exercise`, "POST", formData, headersImg())
        //     .then(res => {
        //         setLoading(false)
        //
        //         const alert = {
        //             active: true,
        //             message: res.msg,
        //             type: res.status
        //         }
        //         dispatch(setAlertOptions({alert}))
        //     })
        //     .then(res => {
        //         navigate(`/exercises`)
        //     })


        request(`${BackUrl}exercise/crud/${id}/`, "PUT", JSON.stringify({title, subject: selectedSubject, level: selectedLevel, type: selectedType}), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                setIsChanged(false)
                dispatch(setAlertOptions({alert}))
            })
    }


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );





    function handleDragEnd(event) {
        const {active, over} = event;


        console.log(active,over)



        if (active.id !== over.id) {
            setComponents((items) => {
                const activeItem = items.filter(item => item.index === active.id)[0]
                const overItem = items.filter(item => item.index === over.id)[0]


                request(`${BackUrl}exercise/block/order/`, "PUT", JSON.stringify({active: activeItem, over: overItem}), headers())
                    .then(res => {
                        console.log(res)
                    })



                const oldIndex = items.findIndex(item => item.index === active.id);
                const newIndex = items.findIndex(item => item.index === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }


    const itemsIndex = useMemo(() => {
        return components.map(item => item.index)
    }, [components])


    const onToggleChangeLessonSort = () => {
        setChangeLessonsSort(prev => !prev)
    }
    const typeChangeLessonSort = useMemo(() => {
        return changeLessonsSort ? "danger" : "simple"
    }, [changeLessonsSort])

    const onToggleTypeExcs = (e) => {
        setSelectedType(+e)
        setRandom(false)
    }

    //
    // const location = useLocation();
    //
    // useEffect(() => {
    //     window.history.pushState(null, document.title, window.location.href);
    //     window.addEventListener('popstate', function(event) {
    //         window.history.pushState(null, document.title, window.location.href);
    //     });
    // }, [location]);

    if (loading) return <Loader/>


    return (<div className={styles.createExc}>
        <main>
            {/*<QuillEditor*/}
            {/*    className={styles.editor}*/}
            {/*    theme="snow"*/}
            {/*    value={value}*/}
            {/*    onChange={(value) => setValue(value)}*/}
            {/*/>*/}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Form id={"formCreateExc"} onSubmit={onSubmit} typeSubmit={"outside"}>
                    <div className={styles.formInfo}>
                        <div className={styles.formInfo__inputs}>

                            <Input
                                required={true}
                                errors={errors}
                                type={"text"}
                                title={"Mashq nomi"}
                                value={title}
                                onChange={setTitle}
                            />
                            {types.length ? <Select
                                onChange={onToggleTypeExcs}
                                title={"Mashq turi"}
                                name={"type-exc"}
                                value={selectedType}
                                options={types}
                            /> : null}
                            {subjects.length > 0 ? <Select
                                onChange={setSelectedSubject}
                                title={"Fan"}
                                name={"subject"}
                                options={subjects}
                                value={selectedSubject}
                            /> : null}
                            {levels.length > 0 ? <Select
                                onChange={setSelectedLevel}
                                title={"Mashq darajasi"}
                                name={"level-exc"}
                                options={levels}
                                value={selectedLevel}
                            /> : null}

                        </div>

                        <div>
                            {
                                types.filter(item => item.id === +selectedType)[0]?.type === "random" &&
                                <div className={styles.makeRandom}>
                                    <h2>Random qilish</h2>
                                    <Checkbox onChange={setRandom} value={random}/>
                                </div>
                            }


                            {
                                components[components.length - 1]?.completed || components.length === 0 ?
                                    <Button
                                        form={null}
                                        type={typeChangeLessonSort}
                                        active={changeLessonsSort}
                                        onClick={onToggleChangeLessonSort}
                                    >
                                        <ChangePen/>
                                    </Button> : null
                            }


                        </div>
                    </div>
                </Form>
                <SortableContext
                    items={itemsIndex}
                    strategy={verticalListSortingStrategy}
                >
                    {renderComponents()}
                </SortableContext>



            </DndContext>

            {
                isChanged &&
                <div className={styles.submit}>
                    <Button form={"formCreateExc"} type={"submit"}>
                        Tasdiqlash
                    </Button>
                </div>
            }


        </main>
        <div className={styles.nav}>
            <div className={styles.nav__item} onClick={() => onClickText("textEditor")}>
                Text editor
            </div>
            <div className={styles.nav__item} onClick={() => onClickText("text")}>
                Text
            </div>

            <div className={styles.nav__item} onClick={() => onClickText("question")}>
                Question
            </div>
            <div className={styles.nav__item} onClick={() => onClickText("image")}>
                Image
            </div>
            <div className={styles.nav__item} onClick={() => onClickText("audio")}>
                Audio
            </div>
            <div className={styles.nav__item} onClick={() => onClickText("snippet")}>
                Code
            </div>
            {/*<div className={styles.nav__item} onClick={() => onClickText("video")}>*/}
            {/*	video*/}
            {/*</div>*/}
        </div>
    </div>);
};

function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.item.index,
        disabled: !props.item.completed ? true : !props.isChange
    });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {props.children}
        </div>
    );
}

export default CreateExercises;