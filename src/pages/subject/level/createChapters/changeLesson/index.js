import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from "./style.module.sass"
import classNames from "classnames";

import Video from "components/lesson/video"
import Img from "components/lesson/img";
import Exercises from "components/lesson/exercises";
import Snippet from "components/lesson/snippet";
import File from "components/lesson/file/File";
import TextEditorExc from "components/exercises/textEditor/TextEditor";
import Confirm from "components/ui/confirm";
import Button from "components/ui/button";
import Input from "components/ui/form/input";
import Form from "components/ui/form";
import Select from "components/ui/form/select";

import {useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {setAlertOptions} from "slices/layoutSlice";
import {useHttp} from "hooks/http.hook";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import {ReactComponent as ChangePen} from "assets/icons/pen-solid.svg"
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {unstable_batchedUpdates} from "react-dom";


const ChangeLesson = () => {
    const {lessonId, levelId,chapterId} = useParams()
    const {id} = useSelector(state => state.subject)
    const [activeTools, setActiveTools] = useState(false)
    const [nameLesson, setNameLesson] = useState("")
    const [components, setComponents] = useState([])
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)

    const [chapters, setChapters] = useState([])

    const [selectedChapter, setSelectedChapter] = useState("")
    const [activeConfirm, setActiveConfirm] = useState(false)

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}info_lesson/${chapterId}/${lessonId}`, "GET", null, headers())
            .then(res => {
                setNameLesson(res.data.name)
                setSelectedChapter(res.data.chapter_id)
                setComponents(res.data.blocks.map((item, i) => {
                    const index = i + 1
                    const type = item.type
                    const text = item.desc
                    const img = item.img
                    const clone = item.clone
                    const audio = item.audio
                    const video = item.audio
                    const file = item.file
                    const block_id = item.id
                    let editorState = null


                    if (item.type === "exc") {
                        const block = item.exercise_block
                        return {
                            completed: true,
                            exc: {
                                block
                            },
                            id: item.exercise_id,
                            block_id: item.id,
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
                        block_id,
                        editorState,
                        completed: true
                    }

                }))
            })
    }, [lessonId])


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
        request(`${BackUrl}chapters/${levelId}`, "GET", null, headers())
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
                    index: components.length + 1
                }]);
            })
        } else {
            setComponents(components => [...components, {
                type: type,
                completed: false,
                index: components.length + 1
            }])
        }
    }

    const onDeleteComponent = (index) => {

        const sortedList = components.filter((item, i) => item.index !== index)
        const deletedItem = components.filter((item, i) => item.index === index)[0]

        if (deletedItem.block_id) {
            request(`${BackUrl}del_lesson_block/${deletedItem.block_id}`, "DELETE", null, headers())
        }

        setComponents(sortedList)
    }


    const onSetCompletedComponent = useCallback((data) => {
        setComponents(state => state.map((item, index) => {
            if (!item.completed) {
                return {...item, ...data, completed: true}
            }
            return item
        }))
    }, [components])


    const onChangeCompletedComponent = (index) => {

        if (components.every(item => item.completed)) {
            setComponents(state => state.map(item => {
                if (item.index === index) {
                    return {...item, completed: false}
                }
                return item
            }))
        }
    }



    const renderComponents = useCallback(() => {
        return components?.map((item, index) => {
            if (item.type === "text") {
                return (
                    <SortableItem
                        isChange={changeLessonsSort}
                        item={item}
                        key={item.index}
                        id={item.index}
                    >
                        <TextEditorExc
                            onChangeCompletedComponent={onChangeCompletedComponent}
                            onSetCompletedComponent={onSetCompletedComponent}
                            onDeleteComponent={onDeleteComponent}
                            component={item}
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
    }, [components, changeLessonsSort])


    const dispatch = useDispatch()

    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()

        const componentImg = components.filter(item => item.type === "img")
        const componentAudio = components.filter(item => item.type === "audio")
        const componentFile = components.filter(item => item.type === "file")


        if (componentImg.length > 0) {
            for (let item of componentImg) {
                formData.append(
                    `component-${item.index}-img`,
                    item.img
                )
            }
        }

        if (componentAudio.length > 0) {
            for (let item of componentAudio) {
                formData.append(
                    `component-${item.index}-audio`,
                    item.audio
                )
            }
        }

        if (componentFile.length > 0) {
            for (let item of componentFile) {
                formData.append(
                    `component-${item.index}-file`,
                    item.file
                )
            }
        }

        const newData = {
            components,
            levelId,
            subjectId: id,
            name: nameLesson,
            chapter: selectedChapter
        }
        formData.append("info", JSON.stringify(newData))

        const token = sessionStorage.getItem("token")

        request(`${BackUrl}info_lesson/${chapterId}/${lessonId}`, "POST", formData, {
            "Authorization": "Bearer " + token,
        })
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
                const oldIndex = items.findIndex(item => item.index === active.id);
                const newIndex = items.findIndex(item => item.index === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const itemsIndex = useMemo(() => {
        return components.map(item => item?.index)
    }, [components])

    const onToggleChangeLessonSort = (id) => {
        setChangeLessonsSort(prev => !prev)
    }
    const typeChangeLessonSort = useMemo(() => {
        return changeLessonsSort ? "danger" : "simple"
    }, [changeLessonsSort])


    const onToggleDelete = () => {
        setActiveConfirm(prev => !prev)
    }


    console.log(components)

    const onDelete = () => {

        request(`${BackUrl}info_lesson/${chapterId}/${lessonId}`, "DELETE", null, headers())
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


    return (
        <div className={styles.createLesson}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Form id={"createLesson"} typeSubmit={"outside"}>
                    <div className={styles.header}>
                        <div className={styles.header__item}>
                            <Input required={true} title={"Darslik nomi"} value={nameLesson} onChange={setNameLesson}/>
                            <Select
                                title={"Bo'lim"}
                                value={selectedChapter}
                                options={chapters}
                                onChange={setSelectedChapter}
                            />
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
                            <Button onClick={onToggleDelete} type={"danger"}>O'chirish</Button>
                        </div>

                        <h1 className={styles.title}>Darslik o'zgartirish</h1>
                    </div>

                </Form>


                <SortableContext
                    items={itemsIndex}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.createLesson__container}>
                        {renderComponents()}
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
                    components[components.length - 1]?.completed ?
                        <div className={styles.submit}>
                            <Button form={"createLesson"} type={"submit"} onClick={onSubmit}>
                                O'zgartirish
                            </Button>


                        </div> : null
                }
            </DndContext>

            <Confirm onSubmit={onDelete} active={activeConfirm} setActive={() => setActiveConfirm(false)}>
                O'chrishni tasdiqlaysizmi
            </Confirm>
        </div>


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


export default ChangeLesson;