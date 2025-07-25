import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from "./style.module.sass"
import classNames from "classnames";

import Video from "components/lesson/video"
import Img from "components/lesson/img";
import Exercises from "components/lesson/exercises";
import Snippet from "components/lesson/snippet";
import File from "components/lesson/file/File";
import Input from "components/ui/form/input";
import Form from "components/ui/form";
import Select from "components/ui/form/select";
import Button from "components/ui/button";


import {useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {setAlertOptions, setOptionsByHref} from "slices/layoutSlice";
import {useHttp} from "hooks/http.hook";
import TextEditorExc from "components/exercises/textEditor/TextEditor";
import Loader from "components/ui/loader/Loader";

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import {ReactComponent as ChangePen} from "assets/icons/pen-solid.svg"



import {createPortal, unstable_batchedUpdates} from "react-dom";
import Checkbox from "components/ui/form/checkbox";
import TextEditorLesson from "components/lesson/text";
import Confirm from "components/ui/confirm";


const CreateLesson = () => {

    const {levelId,lessonId} = useParams()
    const {id} = useSelector(state => state.subject)
    const [oldData,setOldData] = useState()


    const [activeTools, setActiveTools] = useState(false)
    const [isTest, setIsTest] = useState(false)
    const [nameLesson, setNameLesson] = useState("")
    const [numberTest, setNumberTest] = useState(null)
    const [chapters, setChapters] = useState([])
    const [isChanged, setIsChanged] = useState(false)


    const [selectedChapter, setSelectedChapter] = useState("")

    const [components, setComponents] = useState([])
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)
    const [activeConfirm, setActiveConfirm] = useState(false)


    const [loading, setLoading] = useState(false)


    const tools = [
        {
            value: "text",
            title: "Matn"
        },
        {
            value: "snippet",
            title: "Code"
        },
        {
            value: "video",
            title: "Video"
        },
        {
            value: "img",
            title: "Rasm"
        },
        {
            value: "file",
            title: "Fayl"
        },
        {
            value: "exc",
            title: "Mashq"
        }
    ]


    useEffect(() => {
        request(`${BackUrl}lesson/info/${lessonId}/`, "GET", null, headers())
            .then(res => {
                setNameLesson(res.data.name)
                setSelectedChapter(res.data.chapter_id)
                setIsTest(!!res.data.test_numbers)
                setNumberTest(res.data.test_numbers)
                setOldData(res.data)
                setComponents(res.data.lesson_blocks.map((item, i) => {
                    const index = i + 1
                    const type = item.type_block
                    const text = item.desc
                    const img = item.file
                    const clone = item.clone
                    const audio = item.file
                    const video = item.video_url
                    const file = {
                        name: item.original_name,
                        url: item.file
                    }
                    const id = item.id
                    const innerType = item.inner_type
                    let editorState = null


                    if (item.type_block === "exc") {
                        const block = item.exercise
                        return {
                            completed: true,
                            exc: {
                                ...block
                            },
                            exercise_id: item.exercise_id,
                            id: item.id,
                            type: "exc",
                            index: index,

                        }
                    }

                    if (item.type === "text") {
                        if (item.clone.editorState) editorState = item.clone.editorState
                        else editorState = item.clone
                    }

                    return {
                        ...clone,
                        type,
                        index,
                        img,
                        video,
                        audio,
                        text,
                        file,
                        clone,
                        id,
                        editorState,
                        innerType,
                        completed: true
                    }

                }))
            })
    },[lessonId])



    useEffect(() => {
        if (
            oldData && Object.keys(oldData).length &&
            (nameLesson !== oldData?.name ||
                selectedChapter !== oldData?.chapter_id ||
                isTest !== !!oldData?.number_test ||
                numberTest !== oldData?.number_test
            )
        ) {
            setIsChanged(true)
        } else {
            setIsChanged(false)
        }
    },[nameLesson,selectedChapter,isTest,numberTest,oldData])

    useEffect(() => {
        request(`${BackUrl}chapter/info/${levelId}`, "GET", null, headers())
            .then(res => {
                setChapters(res.chapters)
            })
    }, [levelId])

    const addComponent = (type) => {
        if (type === "text") {
            unstable_batchedUpdates(() => {
                setComponents(components => [...components, {
                    type: type,
                    text: "",
                    words: [],
                    completed: false,
                    index: components.length+1
                }]);
            })
        } else {
            setComponents(components => [...components, {
                type: type,
                completed: false,
                index: components.length+1
            }])
        }
    }

    const onDeleteComponent = (id) => {
        const sortedList = components.filter((item) => item.id !== id)
        setComponents(sortedList)
    }

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



    const renderComponents = useCallback(() => {
        return components?.map((item) => {
            if (item.type === "text") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                       <TextEditorLesson
                           onChangeCompletedComponent={onChangeCompletedComponent}
                           onSetCompletedComponent={onSetCompletedComponent}
                           onDeleteComponent={onDeleteComponent}
                           component={item}
                           extra={{lesson_id: lessonId}}
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
                        <Video
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{lesson_id: lessonId}}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "img") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <Img
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{lesson_id: lessonId}}
                        />
                    </SortableItem>
                )
            }
            if (item.type === "file") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <File
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{lesson_id: lessonId}}
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
                        <Snippet
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            extra={{lesson_id: lessonId}}
                        />
                    </SortableItem>

                )
            }
            if (item.type === "exc") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <Exercises
                            lessonId={lessonId}
                            subjectId={id}
                            levelId={levelId}
                            component={item}
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            exercises={components.filter(item => item.type === "exc")}
                        />
                    </SortableItem>
                )
            }
        })
    }, [components,changeLessonsSort,lessonId])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()



    const onSubmit = (e) => {
        e.preventDefault()


        const newData = {
            // components,
            level_id: levelId,
            subject_id: id,
            name: nameLesson,
            chapter: selectedChapter,
            number_test: numberTest,
        }


        setLoading(true)
        request(`${BackUrl}lesson/info/${lessonId}/`, "PUT", JSON.stringify(newData), headers())
            .then(res => {
                setLoading(false)
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
            })
            .then(() => {
                navigate(-1)
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

        if (active.id !== over.id) {





            setComponents((items) => {


                const activeItem = items.filter(item => item.index === active.id)[0]
                const overItem = items.filter(item => item.index === over.id)[0]


                request(`${BackUrl}lesson/block/order/`, "PUT", JSON.stringify({active: activeItem, over: overItem}), headers())
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


    const renderedComponents = renderComponents()

    const onToggleChangeLessonSort = () => {
        setChangeLessonsSort(prev => !prev)
    }
    const onToggleDelete = () => {
        setActiveConfirm(prev => !prev)
    }


    const onDelete = () => {

        request(`${BackUrl}lesson/info/${lessonId}/`, "DELETE", null, headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                navigate(-1)
            })
    }


    const typeChangeLessonSort = useMemo(() => {
        return changeLessonsSort ? "danger" : "simple"
    },[changeLessonsSort])




    if (loading) return <Loader/>

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.createLesson}>
                <Form id={"createLesson"} onSubmit={onSubmit}  typeSubmit={"outside"}>
                    <div className={styles.header}>
                        <div className={styles.header__item}>
                            <Input required={true} title={"Darslik nomi"} value={nameLesson} onChange={setNameLesson} />
                            <Select
                                title={"Bo'lim"}
                                value={selectedChapter}
                                options={chapters}
                                onChange={setSelectedChapter}
                            />
                            <div className={styles.test}>
                                <h2>Test</h2>
                                <Checkbox onChange={setIsTest} checked={isTest}/>
                            </div>
                            {isTest &&  <Input type={"number"} required={true} title={"Test soni"} value={numberTest} onChange={setNumberTest} />}
                            {
                                components[components.length- 1]?.completed || components.length === 0 ?
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
                        {/*<h1 className={styles.title}>Darslik yaratish</h1>*/}
                        <Button onClick={onToggleDelete} type={"danger"}>O'chirish</Button>
                    </div>

                </Form>


                <SortableContext
                    items={itemsIndex}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.createLesson__container}>
                        {renderedComponents}
                        {
                            components[components.length - 1]?.completed || components.length === 0 ?
                                <div className={styles.createLesson__add}>
                                    <div
                                        onClick={() => setActiveTools(!activeTools)}
                                        className={classNames(styles.icon, {
                                            [`${styles.active}`]: activeTools
                                        })}
                                    >
                                        <i className="fa-solid fa-plus"/>
                                    </div>
                                    <div className={classNames(styles.tools, {
                                        [`${styles.active}`]: activeTools
                                    })}>
                                        {
                                            tools.map(item => {
                                                return (
                                                    <div
                                                        onClick={() => addComponent(item.value)}
                                                        className={styles.tools__item}
                                                    >
                                                        {item.title}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>
                </SortableContext>

                {
                    isChanged && <div className={styles.submit}>
                        <Button disabled={loading} form={"createLesson"} type={"submit"}>
                            Tasdiqlash
                        </Button>
                    </div>
                }

                <Confirm onSubmit={onDelete} active={activeConfirm} setActive={() => setActiveConfirm(false)}>
                    O'chrishni tasdiqlaysizmi
                </Confirm>

            </div>
        </DndContext>
    );
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

export default CreateLesson;